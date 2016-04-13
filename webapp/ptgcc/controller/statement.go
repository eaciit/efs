package controller

import (
	"github.com/eaciit/dbox"
	"github.com/eaciit/efs"
	"github.com/eaciit/efs/webapp/ptgcc/helper"
	"github.com/eaciit/knot/knot.v1"
	"github.com/eaciit/toolkit"
)

type StatementController struct {
	App
}

func CreateStatementController(s *knot.Server) *StatementController {
	var controller = new(StatementController)
	controller.Server = s
	return controller
}

func (st *StatementController) Get(search toolkit.M) ([]efs.StatementVersion, error) {
	var query *dbox.Filter
	if search.Has("key") && search.Has("val") {
		key := toolkit.ToString(search.Get("key", ""))
		val := toolkit.ToString(search.Get("val", ""))
		if key != "" && val != "" {
			query = dbox.Eq(key, val)
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

func (st *StatementController) SaveStatement(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	payload := new(efs.Statements)
	if err := r.GetPayload(&payload); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}

	if payload.ID == "" {
		payload.ID = toolkit.RandomString(32)
	}

	if err := efs.Save(payload); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}

	return helper.CreateResult(true, payload, "")
}

func (st *StatementController) SaveStatementVersion(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	payload := new(efs.StatementVersion)
	if err := r.GetPayload(&payload); err != nil {
		return helper.CreateResult(false, "", err.Error())
	}
	query := dbox.And(dbox.Eq("statementid", payload.StatementID), dbox.Eq("title", payload.Title))

	sv := new(efs.StatementVersion)
	cursor, _ := efs.Find(sv, query, nil)
	cursor.Fetch(&sv, 1, false)
	defer cursor.Close()

	if cursor.Count() > 0 && payload.ID == "" {
		return helper.CreateResult(false, "", "please choose another new title")
	}
	if payload.ID == "" {
		payload.ID = toolkit.RandomString(32)
	}
	if err := efs.Save(payload); err != nil {
		return helper.CreateResult(false, "", err.Error())
	}

	return helper.CreateResult(true, nil, "")
}

func (st *StatementController) RemoveStatementVersion(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	payload := new(efs.StatementVersion)
	if err := r.GetPayload(&payload); err != nil {
		return helper.CreateResult(false, "", err.Error())
	}
	if err := efs.Delete(payload); err != nil {
		return helper.CreateResult(false, "", err.Error())
	}

	return helper.CreateResult(true, nil, "")
}

func (st *StatementController) GetSVBySID(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	payload := toolkit.M{}
	if err := r.GetPayload(&payload); err != nil {
		return helper.CreateResult(false, "", err.Error())
	}
	keyword := toolkit.M{}.Set("key", "statementid").Set("val", toolkit.ToString(payload.Get("statementid", "")))
	sv, err := st.Get(keyword)
	if err != nil {
		return helper.CreateResult(false, "", err.Error())
	}
	data := toolkit.Ms{}
	for _, val := range sv {
		_data := toolkit.M{}
		_data.Set("_id", val.ID)
		_data.Set("title", val.Title)
		_data.Set("statementid", val.StatementID)
		data = append(data, _data)
	}

	return helper.CreateResult(true, data, "")
}

func (st *StatementController) GetStatementVersion(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	payload := toolkit.M{}
	if err := r.GetPayload(&payload); err != nil {
		return helper.CreateResult(false, "", err.Error())
	}
	statement := new(efs.Statements)
	if err := efs.Get(statement, toolkit.ToString(payload.Get("statementid", ""))); err != nil {
		return helper.CreateResult(false, "", toolkit.Sprintf("Error to get statement by id, found : %s \n", err.Error()))
	}
	sv := new(efs.StatementVersion)
	var err error

	mode := toolkit.ToString(payload.Get("mode", ""))
	if mode == "new" {
		sv, err = statement.Run(nil)
		if err != nil {
			return helper.CreateResult(false, "", err.Error())
		}
	} else if mode == "find" {
		sv.ID = toolkit.ToString(payload.Get("_id", ""))
		if err := efs.Get(sv, sv.ID); err != nil {
			return helper.CreateResult(false, "", err.Error())
		}
	} else if mode == "simulate" {
		data := toolkit.M{}
		data.Set("mode", payload.Get("mode"))
		payload.Unset("mode")
		if err := toolkit.Serde(payload, sv, "json"); err != nil {
			return helper.CreateResult(false, "", err.Error())
		}
		data.Set("data", sv)
		toolkit.Println("data", data)
		sv = nil
		sv, err = statement.Run(data)
		if err != nil {
			return helper.CreateResult(false, "", err.Error())
		}
	}

	return helper.CreateResult(true, sv, "")
}

// func (st *StatementController) EditStatement(r *knot.WebContext) interface{} {
// 	r.Config.OutputType = knot.OutputJson

// 	data := efs.Statements{}
// 	if err := r.GetPayload(&data); err != nil {
// 		return helper.CreateResult(false, nil, err.Error())
// 	}
// 	if err := data.GetById(); err != nil {
// 		return helper.CreateResult(false, nil, err.Error())
// 	}

// 	return helper.CreateResult(true, data, "")
// }

// func (st *StatementController) RemoveStatement(r *knot.WebContext) interface{} {
// 	r.Config.OutputType = knot.OutputJson

// 	payload := map[string]interface{}{}
// 	if err := r.GetPayload(&payload); !helper.HandleError(err) {
// 		return helper.CreateResult(false, nil, err.Error())
// 	}

// 	idArray := payload["_id"].([]interface{})

// 	for _, id := range idArray {
// 		o := new(efs.Statements)
// 		o.ID = id.(string)
// 		if err := o.Delete(); err != nil {
// 			return helper.CreateResult(false, nil, err.Error())
// 		}
// 	}

// 	return helper.CreateResult(true, nil, "")
// }
