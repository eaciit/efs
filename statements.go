package efs

import (
	. "github.com/eaciit/orm"
)

type Statements struct {
	ModelBase `bson:"-",json:"-"`
	ID        string ` bson:"_id" , json:"_id" `
	Title     string
	Enable    bool
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
