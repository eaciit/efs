package efs

import (
	"errors"
	"github.com/eaciit/dbox"
	_ "github.com/eaciit/dbox/dbc/csv"
	"github.com/eaciit/orm/v1"
	"github.com/eaciit/toolkit"
	"strings"
	"sync"
	"time"
)

var (
	mutex = &sync.Mutex{}
)

type LedgerTransFile struct {
	orm.ModelBase `bson:"-",json:"-"`
	ID            string    `json:"_id",bson:"_id"`
	Filename      string    `json:"filename",bson:"filename"`
	PhysicalName  string    `json:"physicalname",bson:"physicalname"`
	Desc          string    `json:"desc",bson:"desc"`
	Date          time.Time `json:"date",bson:"date"`
	Account       []string  `json:"account",bson:"account"`
	Datacount     float64   `json:"datacount",bson:"datacount"`
	Process       float64   `json:"process",bson:"process"` // 0
	Status        string    `json:"status",bson:"status"`   // ready, done, failed, onprocess, rollback
	Note          string    `json:"note",bson:"note"`
	Pid           string    `json:"pid",bson:"pid"`
}

func (e *LedgerTransFile) RecordID() interface{} {
	return e.ID
}

func (e *LedgerTransFile) TableName() string {
	return "ledgertransfile"
}

func (ltf *LedgerTransFile) Save() error {
	e := Save(ltf)
	if e != nil {
		return errors.New("Save: " + e.Error())
	}

	return e
}

//Validasi check account, change status,
func (ltf *LedgerTransFile) ProcessFile(loc, connector string) (err error) {
	if ltf.Status != "ready" {
		return
	}

	//Check depedency with other process
	arrdboxfilter := make([]*dbox.Filter, 0, 0)
	cond := dbox.And(dbox.Eq("status", "onprocess"), dbox.Gt("process", 0))

	for _, v := range ltf.Account {
		arrdboxfilter = append(arrdboxfilter, dbox.Eq("account", v))
	}

	if len(arrdboxfilter) > 0 {
		cond = dbox.And(dbox.Or(arrdboxfilter...), cond)
	}

	csr, err := Find(new(LedgerTransFile), cond, nil)
	if err != nil {
		err = errors.New(toolkit.Sprintf("Process file check depedency error found : %v", err.Error()))
		return
	}

	if csr.Count() > 0 {
		err = errors.New(toolkit.Sprintf("Process file another process is running"))
		return
	}
	//=======

	conn, err := dbox.NewConnection(connector,
		&dbox.ConnectionInfo{loc, "", "", "", toolkit.M{}.Set("useheader", true)})
	if err != nil {
		err = errors.New(toolkit.Sprintf("Process File error found : %v", err.Error()))
		return
	}

	err = conn.Connect()
	if err != nil {
		err = errors.New(toolkit.Sprintf("Process File error found : %v", err.Error()))
		return
	}

	//next
	for _, v := range ltf.Account {
		var c dbox.ICursor

		mutex.Lock()
		ltf.Status = "onprocess"
		_ = ltf.Save()
		mutex.Unlock()

		c, err = conn.NewQuery().Select().Where(dbox.Eq("account", v)).Cursor(nil)
		if err != nil {
			return
		}
		defer c.Close()

		arrlt := make([]*LedgerTrans, 0, 0)
		err = c.Fetch(&arrlt, 0, false)
		if err != nil {
			if strings.Contains(err.Error(), "Not found") {
				err = nil
				return
			}
			err = errors.New(toolkit.Sprintf("Process File error found : %v", err.Error()))
			return
		}

		go func(arrlt []*LedgerTrans, ltf *LedgerTransFile) {
			ci := 0
			for i, v := range arrlt {
				ci += 1
				// ltf.Process = float64(i) / float64(len(arrlt)) * 100
				err := v.Save()
				if err != nil {
					mutex.Lock()
					ltf.Status = "failed"
					ltf.Process += float64(ci)
					ltf.Note = toolkit.Sprintf("Account %v process-%d error found : %v", v.Account, i, err.Error())
					_ = ltf.Save()
					mutex.Unlock()
					return
				}

				if ci%5 == 0 {
					mutex.Lock()
					ltf.Process += float64(ci)
					_ = ltf.Save()
					mutex.Unlock()
					ci = 0
				}

			}

			mutex.Lock()
			ltf.Process += float64(ci)
			if ltf.Process == ltf.Datacount {
				ltf.Status = "done"
			}
			_ = ltf.Save()
			mutex.Unlock()

		}(arrlt, ltf)
	}

	return
}

func (ltf *LedgerTransFile) Delete() error {
	e := Delete(ltf)
	if e != nil {
		return errors.New("Save: " + e.Error())
	}
	return e
}

func (ltf *LedgerTransFile) GetAccountFile(loc, connector string) (err error) {
	ltf.Account = make([]string, 0, 0)

	conn, err := dbox.NewConnection(connector,
		&dbox.ConnectionInfo{loc, "", "", "", toolkit.M{}.Set("useheader", true)})
	if err != nil {
		err = errors.New(toolkit.Sprintf("Process File error found : %v", err.Error()))
		return
	}

	err = conn.Connect()
	if err != nil {
		err = errors.New(toolkit.Sprintf("Process File error found : %v", err.Error()))
		return
	}

	c, err := conn.NewQuery().Select("Account").Cursor(nil)
	if err != nil {
		return
	}

	ltf.Datacount = float64(c.Count())

	arrtmk := make([]toolkit.M, 0, 0)
	err = c.Fetch(&arrtmk, 0, false)
	for _, v := range arrtmk {
		str := toolkit.ToString(v.Get("Account", ""))
		if str != "" && !toolkit.HasMember(ltf.Account, str) {
			ltf.Account = append(ltf.Account, str)
		}
	}

	return
}
