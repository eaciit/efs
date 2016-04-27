package efs

import (
	"github.com/eaciit/orm/v1"
)

type AccountTypeEnum int

const (
	Account AccountTypeEnum = iota
	Group
)

type Accounts struct {
	orm.ModelBase `bson:"-",json:"-"`
	ID            string          `json:"_id",bson:"_id"`
	Title         string          `json:"title",bson:"title"`
	Type          AccountTypeEnum `json:"type",bson:"type"`
	Group         []string        `json:"group",bson:"group"`
}

func (e *Accounts) RecordID() interface{} {
	return e.ID
}

func (e *Accounts) TableName() string {
	return "accounts"
}

func (a AccountTypeEnum) String() string {
	switch a {
	case Account:
		return "account"
	case Group:
		return "group"
	}

	return "unknown"
}
