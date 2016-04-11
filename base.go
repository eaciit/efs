package efs

import (
	"errors"
	"github.com/eaciit/dbox"
	_ "github.com/eaciit/dbox/dbc/jsons"
	"github.com/eaciit/orm/v1"
	"github.com/eaciit/toolkit"
	"os"
)

var _db *orm.DataContext
var _conn dbox.IConnection
var ConfigPath string
var _dbErr error

func validateConfig() error {

	if ConfigPath == "" {
		return errors.New("validateConfig: ConfigPath is empty")
	}
	_, e := os.Stat(ConfigPath)
	if e != nil {
		return errors.New("validateConfig: " + e.Error())
	}
	return nil
}

func SetDb(conn dbox.IConnection) error {
	CloseDb()
	_db = orm.New(conn)
	return nil
}

func CloseDb() {
	if _db != nil {
		_db.Close()
	}
}

func DB() *orm.DataContext {
	return _db
}

func getConnection() (dbox.IConnection, error) {
	if e := validateConfig(); e != nil {
		return nil, errors.New("GetConnection: " + e.Error())
	}

	//jsonpath := getJsonFilePath(o)
	c, e := dbox.NewConnection("jsons", &dbox.ConnectionInfo{ConfigPath, "", "", "", toolkit.M{}.Set("newfile", true)})
	if e != nil {
		return nil, errors.New("GetConnection: " + e.Error())
	}
	e = c.Connect()
	if e != nil {
		return nil, errors.New("GetConnection: Connect: " + e.Error())
	}
	return c, nil
}

func ctx() *orm.DataContext {
	var econn error
	if _db == nil {
		if _conn == nil {
			_conn, econn = getConnection()
			if econn != nil {
				_dbErr = errors.New("Connection error: " + econn.Error())
				return nil
			}
		}
		_db = orm.New(_conn)
	}
	return _db
}

func Delete(o orm.IModel) error {
	e := ctx().Delete(o)
	if e != nil {
		return errors.New("Delete: " + e.Error())
	}
	return e

}

func Save(o orm.IModel) error {
	e := ctx().Save(o)
	if e != nil {
		return errors.New("Save: " + e.Error())
	}
	return e
}

func Get(o orm.IModel, id interface{}) error {
	e := ctx().GetById(o, id)
	if e != nil {
		return errors.New("Get: " + e.Error())
	}
	return e
}

func Find(o orm.IModel, filter *dbox.Filter) (dbox.ICursor, error) {
	var filters []*dbox.Filter
	if filter != nil {
		filters = append(filters, filter)
	}
	c, e := ctx().Find(o, toolkit.M{}.Set("where", filters))
	if e != nil {
		return nil, errors.New("Find: " + e.Error())
	}
	return c, nil
}
