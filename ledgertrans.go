package efs

import (
	"time"

	. "github.com/eaciit/orm"
)

type LedgerTrans struct {
	ModelBase `bson:"-",json:"-"`
	ID        string
	JournalNo string
	TransDate time.Time
	Amount    float64
	Account   string
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
