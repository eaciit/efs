package efscore

import (
	"errors"
	"github.com/eaciit/dbox"
	"github.com/eaciit/efs"
	"github.com/eaciit/toolkit"
	"time"
)

type StatementVersion struct {
	efs.StatementVersion
}

type Comment struct {
	efs.Comments
}

func (cm *Comment) Save() error {
	if cm.ID == "" {
		cm.ID = toolkit.RandomString(32)
	}
	cm.Time = time.Now().UTC()

	if err := efs.Save(cm); err != nil {
		return err
	}
	return nil
}

func (cm *Comment) Delete(payload toolkit.M) error {
	idArray := payload.Get("_id").([]interface{})

	for _, id := range idArray {
		o := new(efs.Comments)
		o.ID = toolkit.ToString(id)
		if err := efs.Delete(o); err != nil {
			return err
		}
	}
	return nil
}

func GetSVList(search toolkit.M) ([]efs.StatementVersion, error) {
	var query *dbox.Filter
	if search.Has("key") && search.Has("val") {
		key := toolkit.ToString(search.Get("key", ""))
		val := toolkit.ToString(search.Get("val", ""))
		if key != "" && val != "" {
			query = dbox.Contains(key, val)
		}
	}

	data := []efs.StatementVersion{}
	cursor, err := efs.Find(new(efs.StatementVersion), query, nil)
	if err != nil {
		return nil, err
	}
	if err := cursor.Fetch(&data, 0, false); err != nil {
		return nil, err
	}
	defer cursor.Close()
	return data, nil
}

func GetSVBySID(payload toolkit.M) (toolkit.Ms, error) {
	keyword := toolkit.M{}.Set("key", "statementid").Set("val", toolkit.ToString(payload.Get("statementid", "")))
	svArr, err := GetSVList(keyword)
	if err != nil {
		return nil, err
	}
	data := toolkit.Ms{}
	for _, val := range svArr {
		_data := toolkit.M{}
		_data.Set("_id", val.ID)
		_data.Set("title", val.Title)
		_data.Set("statementid", val.StatementID)
		data = append(data, _data)
	}

	return data, nil
}

func GetSVByRun(payload toolkit.M) (toolkit.M, error) {
	statement := new(efs.Statements)
	statementid := toolkit.ToString(payload.Get("statementid", ""))
	if statementid == "" {
		statementid = "bid1EWFRZwL-at1uyFvzJYUjPu3yuh3j"
	}

	if err := efs.Get(statement, statementid); err != nil {
		return nil, errors.New("Error to get statement by id, found :" + err.Error())
	}
	sv := new(efs.StatementVersion)
	var err error

	mode := toolkit.ToString(payload.Get("mode", ""))
	if mode == "" {
		mode = "new"
	}
	result := toolkit.M{}
	if mode == "new" {
		sv, _, err = statement.Run(nil)
		if err != nil {
			return result, err
		}
		result.Set("data", sv)
	} else if mode == "find" {
		sv.ID = toolkit.ToString(payload.Get("_id", ""))
		if err := efs.Get(sv, sv.ID); err != nil {
			return result, err
		}
		commentArr := []string{}
		lenElement := toolkit.SliceLen(sv.Element)
		for i := 0; i < lenElement; i++ {
			if toolkit.SliceLen(sv.Element[i].Comments) > 0 {
				for _, val := range sv.Element[i].Comments {
					commentArr = append(commentArr, val)
				}
			}
		}
		comments := efs.Getcomment(commentArr)
		result.Set("data", sv)
		result.Set("comment", comments)

	} else if mode == "simulate" {
		data := toolkit.M{}
		if payload.Has("comment") {
			data.Set("comment", payload.Get("comment"))
			payload.Unset("comment")
		}
		data.Set("mode", payload.Get("mode"))
		payload.Unset("mode")
		if err := toolkit.Serde(payload, sv, "json"); err != nil {
			return result, err
		}
		data.Set("data", sv)
		sv = nil
		sv, comment, err := statement.Run(data)
		if err != nil {
			return result, err
		}
		result.Set("data", sv)
		result.Set("comment", comment)
	}

	return result, nil
}

func (sv *StatementVersion) GetById() error {
	if err := efs.Get(sv, sv.ID); err != nil {
		return err
	}
	return nil
}

func (sv *StatementVersion) Save() error {
	query := dbox.And(dbox.Eq("statementid", sv.StatementID), dbox.Eq("title", sv.Title))

	svFind := new(efs.StatementVersion)
	cursor, _ := efs.Find(svFind, query, nil)
	cursor.Fetch(&svFind, 1, false)
	defer cursor.Close()

	if cursor.Count() > 0 && sv.ID == "" {
		return errors.New("please choose another new title")
	}
	if sv.ID == "" {
		sv.ID = toolkit.RandomString(32)
	}

	if err := efs.Save(sv); err != nil {
		return err
	}
	return nil
}

func (sv *StatementVersion) Delete() error {
	if err := efs.Delete(sv); err != nil {
		return err
	}
	return nil
}
