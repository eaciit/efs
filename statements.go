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

func (e *Statements) GetById() error {
	if err := Get(e, e.ID); err != nil {
		return err
	}
	return nil
}

func (e *Statements) Delete() error {
	if err := Delete(e); err != nil {
		return err
	}
	return nil
}

func (e *Statements) Run(ins toolkit.M) *StatementVersion {
	return nil
}
