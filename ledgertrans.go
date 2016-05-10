package efs

import (
	"time"

	"github.com/eaciit/orm/v1"
)

type LedgerTrans struct {
	orm.ModelBase `bson:"-",json:"-"`
	ID            string `json:"_id",bson:"_id"`
	Company       string
	JournalNo     string
	TransDate     time.Time
	Amount        float64
	Account       string
	ProfitCenter  string
	CostCenter    string
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
