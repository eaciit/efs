package efs

import (
	"errors"
	"github.com/eaciit/dbox"
	"github.com/eaciit/orm/v1"
	"time"
	// "github.com/eaciit/toolkit"
)

type Comments struct {
	orm.ModelBase `bson:"-",json:"-"`
	ID            string    `json:"_id",bson:"_id"`
	Name          string    `json:"name",bson:"name"`
	Text          string    `json:"text",bson:"text"`
	Time          time.Time `json:"time",bson:"time"`
}

func (e *Comments) RecordID() interface{} {
	return e.ID
}

func (e *Comments) TableName() string {
	return "comments"
}

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

func (c *Comments) Save() error {
	e := Save(c)
	if e != nil {
		return errors.New("Save: " + e.Error())
	}
	return e
}

func (c *Comments) Delete() error {
	e := Delete(c)
	if e != nil {
		return errors.New("Save: " + e.Error())
	}
	return e
}
