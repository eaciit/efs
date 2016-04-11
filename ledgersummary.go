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

/*
LedgerSummaries:
[
    {1, 1-Jan-2016, 200000, "depre"},
    {2, 1-Jan-2016, 100000, "xxx"}
]

Statements:
{
    id:"donation"
    title:"donation",
    enable:true,
    elements:[
        {
            index:1,
            title:"Depre (Add back)",
            type:1,
            datavalue:["depre"],
            show:true,
            bold:false,
            negatevalue:false,
            negatedisplay:false
        }
    ]
}
*/
