package efs

import (
	"errors"
	"github.com/eaciit/dbox"
	_ "github.com/eaciit/dbox/dbc/csv"
	"github.com/eaciit/orm/v1"
	"github.com/eaciit/toolkit"
	"strings"
	"time"
)

type LedgerTransFile struct {
	orm.ModelBase `bson:"-",json:"-"`
	ID            string    `json:"_id",bson:"_id"`
	Filename      string    `json:"filename",bson:"filename"`
	PhysicalName  string    `json:"physicalname",bson:"physicalname"`
	Desc          string    `json:"desc",bson:"desc"`
	Date          time.Time `json:"date",bson:"date"`
	Account       []string  `json:"account",bson:"account"`
	Process       float64   `json:"process",bson:"process"` // 0
	Status        string    `json:"status",bson:"status"`   // ready, done, failed, onprocess
	Note          string    `json:"note",bson:"note"`
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

	c, err := conn.NewQuery().Select().Cursor(nil)
	if err != nil {
		return
	}

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
		for i, v := range arrlt {
			ltf.Process = float64(i) / float64(len(arrlt)) * 100
			err := v.Save()
			if err != nil {
				ltf.Note = toolkit.Sprintf("Process-%d error found : %v", i, err.Error())
				_ = ltf.Save()
				return
			}

			if toolkit.ToInt(ltf.Process, toolkit.RoundingAuto)%5 == 0 {
				_ = ltf.Save()
			}

		}
		ltf.Process = 100
		_ = ltf.Save()
	}(arrlt, ltf)

	return
}

func (ltf *LedgerTransFile) Delete() error {
	e := Delete(ltf)
	if e != nil {
		return errors.New("Save: " + e.Error())
	}
	return e
}

func GetAccount(loc, connector string) (arrstr []string) {
	arrstr = make([]string, 0, 0)

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

	arrtmk := make([]toolkit.M, 0, 0)
	err = c.Fetch(&arrtmk, 0, false)
	for _, v := range arrtmk {
		str := toolkit.ToString(v.Get("Account", ""))
		if str != "" && toolkit.HasMember(arrstr, str) {
			arrstr = append(arrstr, str)
		}
	}

	return
}
