package efs

import (
	"github.com/eaciit/dbox"
	"github.com/eaciit/orm/v1"
	// "github.com/eaciit/toolkit"
)

type Comments struct {
	orm.ModelBase `bson:"-",json:"-"`
	ID            string `json:"_id",bson:"_id"`
	Sveid         string `json:"sveid",bson:"sveid"`
	Text          string `json:"text",bson:"text"`
}

func (e *Comments) RecordID() interface{} {
	return e.ID
}

func (e *Comments) TableName() string {
	return "comments"
}

func Countcomment(sveid string) int {
	n := 0
	c := new(Comments)

	filter := dbox.Eq("sveid", sveid)
	cur, err := Find(c, filter, nil)

	if err == nil && cur != nil {
		n = cur.Count()
	}

	return n
}

func Getcomment(sveid string) (arrcom []Comments) {
	arrcom = make([]Comments, 0, 0)
	c := new(Comments)

	filter := dbox.Eq("sveid", sveid)
	cur, err := Find(c, filter, nil)

	if err != nil {
		return
	}

	// artkm := make([]toolkit.M, 0, 0)
	err = cur.Fetch(&arrcom, 0, false)
	// for _, val := range artkm {
	// 	arrstr = append(arrstr, toolkit.ToString(val.Get("text", "")))
	// }

	return
}
