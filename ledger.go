package efs

import (
	"github.com/eaciit/dbox"
	"github.com/eaciit/orm/v1"
	"github.com/eaciit/toolkit"
)

type Ledger struct {
	orm.ModelBase `bson:"-",json:"-"`
	ID            string `json:"_id",bson:"_id"`
	Title         string
	Enable        bool
	Group         string
}

func LedgerGetByID(id string) *Ledger {
	ledger := new(Ledger)
	DB().GetById(ledger, id)
	return ledger
}
func LedgerFindByTitle(title string, order []string, skip, limit int) dbox.ICursor {
	c, _ := DB().Find(new(Ledger),
		toolkit.M{}.Set("where", dbox.Eq("title", title)).
			Set("order", order).
			Set("skip", skip).
			Set("limit", limit))
	return dbox.NewCursor(c)
}

func LedgerFindByEnable(enable bool, order []string, skip, limit int) dbox.ICursor {
	c, _ := DB().Find(new(Ledger),
		toolkit.M{}.Set("where", dbox.Eq("enable", enable)).
			Set("order", order).
			Set("skip", skip).
			Set("limit", limit))
	return dbox.NewCursor(c)
}

func (e *Ledger) RecordID() interface{} {
	return e.ID
}

func NewLedger() *Ledger {
	e := new(Ledger)
	e.Title = "empty"
	e.Enable = true
	return e
}

func (e *Ledger) TableName() string {
	return "ledgers"
}
