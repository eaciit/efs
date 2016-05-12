package efs

import (
	"errors"
	"github.com/eaciit/dbox"
	"github.com/eaciit/orm/v1"
	"github.com/eaciit/toolkit"
	"math"
	"strings"
	"time"
)

type LedgerTrans struct {
	orm.ModelBase `bson:"-",json:"-"`
	ID            string    `json:"_id",bson:"_id"`
	Company       string    `json:"company",bson:"company"`
	JournalNo     string    `json:"journalno",bson:"journalno"`
	TransDate     time.Time `json:"transdate",bson:"transdate"`
	Amount        float64   `json:"amount",bson:"amount"`
	Account       string    `json:"account",bson:"account"`
	ProfitCenter  string    `json:"profitcenter",bson:"profitcenter"`
	CostCenter    string    `json:"costcenter",bson:"costcenter"`
}

func (e *LedgerTrans) RecordID() interface{} {
	return e.ID
}

func NewLedgerTrans() *LedgerTrans {
	e := new(LedgerTrans)
	return e
}

func (e *LedgerTrans) TableName() string {
	return "ledgertrans"
}

func (l *LedgerTrans) Save() error {
	if l.ID == "" {
		l.ID = toolkit.RandomString(32)
	}

	l.TransDate = l.TransDate.UTC()
	e := Save(l)
	if e != nil {
		return errors.New("Save: " + e.Error())
	}

	inamount, outamount, e := suminout(l.TransDate, l.Account)
	// toolkit.Println("IN OUT E : ", inamount, "-", outamount, "-", e)
	if e != nil {
		return errors.New("Fail calculate inout")
	}
	e = updatesummary(l, inamount, outamount)
	return e
}

func (l *LedgerTrans) Delete() error {
	e := Delete(l)
	if e != nil {
		return errors.New("Save: " + e.Error())
	}

	inamount, outamount, e := suminout(l.TransDate, l.Account)
	if e != nil {
		return errors.New("Fail calculate inout")
	}
	e = updatesummary(l, inamount, outamount)

	return e
}

func suminout(tdate time.Time, taccount string) (in, out float64, err error) {
	alt := make([]LedgerTrans, 0, 0)
	cond := dbox.And(dbox.Eq("transdate", tdate), dbox.Eq("account", taccount))
	csr, err := Find(new(LedgerTrans), cond, nil)
	if err != nil {
		return
	}
	err = csr.Fetch(&alt, 0, false)
	csr.Close()
	if err != nil && !strings.Contains(err.Error(), "Not found") {
		return
	}

	err = nil

	for _, v := range alt {
		if v.Amount > 0 {
			in += v.Amount
		} else {
			out += math.Abs(v.Amount)
		}
	}

	return
}
