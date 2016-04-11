package efs

import (
	"time"

	. "github.com/eaciit/orm"
)

type LedgerSummary struct {
	ModelBase `bson:"-",json:"-"`
	ID        string ` bson:"_id" , json:"_id" `
	TransDate time.Time
	Amount    float64
	Account   string
}

func (e *LedgerSummary) RecordID() interface{} {
	return e.ID
}

func NewLedgerSummary() *LedgerSummary {
	e := new(LedgerSummary)
	return e
}

func (e *LedgerSummary) TableName() string {
	return "ledgersummaries"
}
