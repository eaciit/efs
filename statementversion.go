package efs

import (
	// "github.com/eaciit/dbox"
	"github.com/eaciit/orm/v1"
	// "github.com/eaciit/toolkit"
)

type StatementVersion struct {
	orm.ModelBase `bson:"-",json:"-"`
	ID            string `json:"_id",bson:"_id"`
	Title         string
	StatementID   string

	Element []*VersionElement
}

func (e *StatementVersion) RecordID() interface{} {
	return e.ID
}

func NewStatementVersion() *StatementVersion {
	e := new(StatementVersion)
	return e
}

func (e *StatementVersion) TableName() string {
	return "statementversions"
}

type VersionElement struct {
	StatementElement *StatementElement
	IsTxt            bool
	Formula          string
	ValueTxt         string
	ValueNum         float64
}
