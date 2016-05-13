package efs

import (
	"errors"
	"github.com/eaciit/orm/v1"
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
	Process       float64   `json:"process",bson:"process"`
	Status        string    `json:"status",bson:"status"`
}

func (e *LedgerTransFile) RecordID() interface{} {
	return e.ID
}

func (e *LedgerTransFile) TableName() string {
	return "ledgertransfile"
}

func (ltf *LedgerTransFile) Save(fileloc string) error {
	//Process File
	e := Save(ltf)
	if e != nil {
		return errors.New("Save: " + e.Error())
	}

	return e
}

func (ltf *LedgerTransFile) Delete() error {
	e := Delete(ltf)
	if e != nil {
		return errors.New("Save: " + e.Error())
	}
	return e
}
