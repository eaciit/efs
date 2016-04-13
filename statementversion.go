package efs

import (
	"github.com/eaciit/dbox"
	"github.com/eaciit/orm/v1"
	"github.com/eaciit/toolkit"
)

type StatementVersion struct {
	orm.ModelBase `bson:"-",json:"-"`
	ID            string `json:"_id",bson:"_id"`
	Title         string
	StatementID   string

	Element []*VersionElement
}

func (e *StatementVersion) Get(search toolkit.M) ([]StatementVersion, error) {
	var query *dbox.Filter
	key := toolkit.ToString(search.Get("key", ""))
	val := toolkit.ToString(search.Get("val", ""))

	if key != "" && val != "" {
		query = dbox.Eq(key, val)
	}

	data := []StatementVersion{}
	cursor, err := Find(new(StatementVersion), query, nil)
	if err != nil {
		return nil, err
	}
	if err := cursor.Fetch(&data, 0, false); err != nil {
		return nil, err
	}
	defer cursor.Close()
	return data, nil
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
	ValueTxt         string
	ValueNum         float64
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
