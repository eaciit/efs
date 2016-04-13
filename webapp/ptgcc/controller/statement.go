package controller

import (
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
	keyword := toolkit.M{}
	keyword.Set("key", "statementid")
	keyword.Set("val", toolkit.ToString(payload.Get("statementid", "")))
	sv, err := new(efs.StatementVersion).Get(keyword)
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

	// payload := new(efs.Statements)
	payload := toolkit.M{}
	if err := r.GetPayload(&payload); err != nil {
		return helper.CreateResult(false, "", err.Error())
	}
	statement := new(efs.Statements)
	//ID or other filter will get and generated from payload
	// sid := "bid1EWFRZwL-at1uyFvzJYUjPu3yuh3j"
	if err := efs.Get(statement, toolkit.ToString(payload.Get("statementid", ""))); err != nil {
		return helper.CreateResult(false, "", toolkit.Sprintf("Error to get statement by id, found : %s \n", err.Error()))
	}
	sv := new(efs.StatementVersion)

	mode := toolkit.ToString(payload.Get("mode", ""))
	if mode == "new" {
		sv = statement.Run(nil)
	} else if mode == "find" {
		sv.ID = toolkit.ToString(payload.Get("_id", ""))
		if err := efs.Get(sv, sv.ID); err != nil {
			return helper.CreateResult(false, "", err.Error())
		}
	} else if mode == "simulate" {
		sv = statement.Run(payload)
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
