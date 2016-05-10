package efs

import (
	"time"

	"github.com/eaciit/orm/v1"
)

type LedgerSummary struct {
	orm.ModelBase `bson:"-",json:"-"`
	ID            string `json:"_id",bson:"_id"`
	TransDate     time.Time
	// Amount        float64
	Account string
	Opening float64
	In      float64
	Out     float64
	Balance float64
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
    {2, 1-Jan-2016, 100000, "xxx"},
    {2, 2-Jan-2016, 100000, "depre"}
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
        },
        {
            index:2,
            title:"Depre (Add back) 50%",
            type:50,
            datavalue:["@1/2"],
            show:true,
            bold:false,
            negatevalue:false,
            negatedisplay:false
        }
    ]
}

StatementGetByID("donation").Run(nil)
=
[
    1=300000
    2=150000
]
*/
