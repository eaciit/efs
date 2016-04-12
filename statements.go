package efs

import (
	"github.com/eaciit/orm/v1"
	"github.com/eaciit/toolkit"
)

type Statements struct {
	orm.ModelBase `bson:"-",json:"-"`
	ID            string `bson:"_id" , json:"_id"`
	Title         string
	Enable        bool
	Elements      []StatementElement
}

func (e *Statements) RecordID() interface{} {
	return e.ID
}

func NewStatements() *Statements {
	e := new(Statements)
	e.Enable = true
	return e
}

func (e *Statements) TableName() string {
	return "statements"
}

func (e *Statements) Save() error {
	if err := Save(e); err != nil {
		return err
	}
	return nil
}

func (e *Statements) Run(ins toolkit.M) (sv *StatementVersion) {
	sv = new(StatementVersion)

	if sv.ID == "" {
		sv.ID = toolkit.RandomString(32)
	}

	sv.Title = toolkit.ToString(ins.Get("title", ""))
	sv.StatementID = e.ID
	sv.Element = make([]VersionElement, 0, 0)

	for _, v := range e.Elements {
		tve := VersionElement{}

		tve.StatementElement = v
		tve.IsTxt = false
		tve.ValueTxt = ""
		tve.ValueNum = 0

		sv.Element = append(sv.Element, tve)

	}

	return
}
