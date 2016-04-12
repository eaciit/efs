package efs

import (
	"github.com/eaciit/orm/v1"
)

type StatementVersion struct {
	orm.ModelBase `bson:"-",json:"-"`
	ID            string `json:"_id",bson:"_id"`
	Title         string
	StatementID   string

	Element []VersionElement
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
	StatementElement
	IsTxt    bool
	ValueTxt string
	ValueNum float64
}

//-- Index         int
// Title1        string
// Title2        string
//-- Type          ElementTypeEnum
// DataValue     []string
// Show          bool
// Bold          bool
// NegateValue   bool
// NegateDisplay bool
