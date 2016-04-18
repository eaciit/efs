package efscore

import (
	"github.com/eaciit/dbox"
	"github.com/eaciit/orm/v1"
	"github.com/eaciit/toolkit"
)

type Databases struct {
	orm.ModelBase
	ID   string      `json:"_id",bson:"_id"`
	Data interface{} `json:"data",bson:"data"`
}

type Ports struct {
	orm.ModelBase
	ID   string `json:"_id",bson:"_id"`
	Port int    `json:"port",bson:"port"`
}

func (p *Ports) TableName() string {
	return "port"
}

func (p *Ports) RecordID() interface{} {
	return p.ID
}

func (p *Ports) GetPort() error {
	if err := Get(p, p.ID); err != nil {
		return err
	}

	return nil
}

func SetPort(_port *Ports, value interface{}) error {
	_port.Port = toolkit.ToInt(value, toolkit.RoundingAuto)
	if err := Save(_port); err != nil {
		return err
	}

	return nil
}

func (a *Databases) TableName() string {
	return "databases"
}

func (a *Databases) RecordID() interface{} {
	return a.ID
}

func GetDB(key string) interface{} {
	cursor, err := Find(new(Databases), dbox.Eq("_id", key))
	if err != nil {
		return nil
	}

	if cursor.Count() == 0 {
		return nil
	}

	data := Databases{}
	err = cursor.Fetch(&data, 1, false)
	if err != nil {
		return nil
	}

	return data.Data
}

func SetDB(value interface{}) {
	o := new(Databases)
	o.Data = value
	Save(o)
}
