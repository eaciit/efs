package efs

import (
	. "github.com/eaciit/orm"
    "github.com/eaciit/toolkit"
)

type Statements struct {
	ModelBase `bson:"-",json:"-"`
	ID        string ` bson:"_id" , json:"_id" `
	Title     string
	Enable    bool
    Elements  []StatementElement
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

func (e *Statements) Run(ins toolkit.M) *StatementVersion{
    return nil
}

