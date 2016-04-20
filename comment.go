package efs

import (
	"github.com/eaciit/dbox"
	"github.com/eaciit/orm/v1"
	"time"
	// "github.com/eaciit/toolkit"
)

type Comments struct {
	orm.ModelBase `bson:"-",json:"-"`
	ID            string `json:"_id",bson:"_id"`
	// Sveid         string    `json:"sveid",bson:"sveid"`
	Name string    `json:"name",bson:"name"`
	Text string    `json:"text",bson:"text"`
	Time time.Time `json:"time",bson:"time"`
}

func (e *Comments) RecordID() interface{} {
	return e.ID
}

func (e *Comments) TableName() string {
	return "comments"
}

// func Countcomment(sveid string) int {
// 	n := 0
// 	c := new(Comments)

// 	filter := dbox.Eq("sveid", sveid)
// 	cur, err := Find(c, filter, nil)

// 	if err == nil && cur != nil {
// 		n = cur.Count()
// 	}

// 	return n
// }

func Getcomment(arrid []string) (arrcom []Comments) {
	arrcom = make([]Comments, 0, 0)
	c := new(Comments)

	arrinterface := make([]interface{}, 0, 0)
	for _, val := range arrid {
		arrinterface = append(arrinterface, val)
	}

	filter := dbox.In("_id", arrinterface...)
	cur, err := Find(c, filter, nil)

	if err != nil {
		return
	}

	err = cur.Fetch(&arrcom, 0, false)

	return
}
