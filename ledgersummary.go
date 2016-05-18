package efs

import (
	"errors"
	"github.com/eaciit/dbox"
	"github.com/eaciit/orm/v1"
	"github.com/eaciit/toolkit"
	// "math"
	"strings"
	"time"
)

type LedgerSummary struct {
	orm.ModelBase `bson:"-",json:"-"`
	ID            string    `json:"_id",bson:"_id"`
	SumDate       time.Time `json:"sumdate",bson:"sumdate"`
	Account       string    `json:"account",bson:"account"`
	Opening       float64   `json:"opening",bson:"opening"`
	In            float64   `json:"in",bson:"in"`
	Out           float64   `json:"out",bson:"out"`
	Balance       float64   `json:"balance",bson:"balance"`
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

func (l *LedgerSummary) GetLast(ssumdate, lsumdate time.Time, taccount string) (err error) {
	cond := new(dbox.Filter)
	conf := toolkit.M{}

	if ssumdate.IsZero() {
		cond = dbox.And(dbox.Lt("sumdate", lsumdate), dbox.Eq("account", taccount))
		conf.Set("order", []string{"-sumdate"}).Set("take", 1)
	} else {
		cond = dbox.And(dbox.Gte("sumdate", ssumdate), dbox.Lt("sumdate", lsumdate), dbox.Eq("account", taccount))
		conf.Set("order", []string{"sumdate"})
	}
	csr, err := Find(l, cond, conf)
	if err != nil {
		return errors.New("[Save] Get last ledger summary : " + err.Error())
	}
	defer csr.Close()
	err = csr.Fetch(l, 1, false)
	return
}

func (l *LedgerSummary) Save() error {
	e := Save(l)
	if e != nil {
		return errors.New("Save: " + e.Error())
	}
	return e
}

// func (l *LedgerSummary) Delete() error {
// 	e := Delete(l)
// 	if e != nil {
// 		return errors.New("Save: " + e.Error())
// 	}
// 	return e
// }

func updatesummary(lt *LedgerTrans, in, out float64) (err error) {

	als := make([]LedgerSummary, 0, 0)
	cond := dbox.And(dbox.Gte("sumdate", lt.TransDate), dbox.Eq("account", lt.Account))
	csr, err := Find(new(LedgerSummary), cond, toolkit.M{}.Set("order", []string{"sumdate"}))
	if err != nil {
		return errors.New("[Save] Get ledger summary : " + err.Error())
	}
	defer csr.Close()
	err = csr.Fetch(&als, 0, false)
	if err != nil && !strings.Contains(err.Error(), "Not found") {
		return errors.New("[Save] Get ledger summary : " + err.Error())
	}

	var lastbalace float64
	for i, v := range als {
		if i == 0 && v.SumDate.Equal(lt.TransDate) {
			v.In = in
			v.Out = out
		} else if i == 0 {
			tls := new(LedgerSummary)
			tls.ID = toolkit.RandomString(32)
			tls.SumDate = lt.TransDate
			tls.Account = lt.Account
			tls.Opening = v.Opening
			tls.In = in
			tls.Out = out
			tls.Balance = tls.Opening + tls.In - tls.Out

			err = tls.Save()

			v.Opening = tls.Balance
		} else {
			v.Opening = lastbalace
		}

		v.Balance = v.Opening + v.In - v.Out
		lastbalace = v.Balance
		err = v.Save()
	}

	if len(als) == 0 {
		tls := new(LedgerSummary)
		err = tls.GetLast(time.Time{}, lt.TransDate, lt.Account)
		if err != nil {
			return
		}

		tls.ID = toolkit.RandomString(32)
		tls.SumDate = lt.TransDate
		tls.Account = lt.Account
		tls.Opening = tls.Balance
		tls.In = in
		tls.Out = out
		tls.Balance = tls.Opening + tls.In - tls.Out

		err = tls.Save()
	}

	return
}

func GetOpeningInOutBalace(data string, atype AccountTypeEnum, startdate, enddate time.Time) (opening, in, out, balance float64) {
	daccounts := make([]string, 0, 0)
	if atype == Account {
		daccounts = append(daccounts, data)
	} else {
		/*var cond []*dbox.Filter
		for _, v := range data {
			cond = append(cond, dbox.Eq("group", v))
		}
		adata := []Accounts{}
		csr, err := Find(new(Accounts), dbox.Or(cond...), nil)
		if err != nil {
			return
		}
		err = csr.Fetch(&adata, 0, false)
		for _, v := range adata {
			daccounts = append(daccounts, v.ID)
		}
		csr.Close()*/
		var cond *dbox.Filter
		cond = dbox.Eq("_id", data)
		adata := []Accounts{}
		csr, err := Find(new(Accounts), cond, nil)
		if err != nil {
			return
		}
		err = csr.Fetch(&adata, 0, false)
		for _, v := range adata {
			daccounts = append(daccounts, v.ID)
		}
		csr.Close()
	}

	if len(daccounts) == 0 {
		return
	}

	/*var acond []*dbox.Filter
	var cond *dbox.Filter
	for _, v := range data {
		acond = append(acond, dbox.Eq("account", v))
	}

	if len(acond) > 0 {
		cond = dbox.Or(acond...)
	}

	cond = dbox.And(cond, dbox.Gte("sumdate", startdate.UTC()), dbox.Lt("sumdate", enddate.UTC()))
	asum := []LedgerSummary{}
	csr, err := Find(new(LedgerSummary), cond, toolkit.M{}.Set("order", []string{"sumdate"}))
	if err != nil {
		return
	}
	defer csr.Close()
	err = csr.Fetch(&asum, 0, false)
	toolkit.Println("asum", asum)

	for i, v := range asum {

		if i == 0 {
			opening = v.Opening
		}

		in += v.In
		out += v.Out
		balance = v.Balance
	}*/

	var cond *dbox.Filter

	cond = dbox.And(dbox.Eq("account", data), dbox.Gte("sumdate", startdate.UTC()), dbox.Lte("sumdate", enddate.UTC()))
	asum := []LedgerSummary{}
	csr, err := Find(new(LedgerSummary), cond, toolkit.M{}.Set("order", []string{"sumdate"}))
	if err != nil {
		return
	}
	defer csr.Close()
	err = csr.Fetch(&asum, 0, false)

	for i, v := range asum {
		if i == 0 {
			opening = v.Opening
		}

		in += v.In
		out += v.Out
		balance = v.Balance
	}

	return
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
