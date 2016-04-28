package controller

import (
	"github.com/eaciit/efs/webapp/ptgcc/helper"
	"github.com/eaciit/efs/webapp/ptgcc/model"
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

	payload := new(efscore.Statement)
	if err := r.GetPayload(&payload); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}
	if err := payload.Save(); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}

	return helper.CreateResult(true, nil, "")
}

func (st *StatementController) GetStatement(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	payload := toolkit.M{}
	if err := r.GetPayload(&payload); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}
	val := toolkit.ToString(payload.Get("search", ""))

	keyword := toolkit.M{}.Set("key", "title").Set("val", val)
	data, err := efscore.GetStatementList(keyword)
	if err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}
	return helper.CreateResult(true, data, "")
}

func (st *StatementController) EditStatement(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	data := new(efscore.Statement)
	if err := r.GetPayload(&data); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}

	if err := data.GetById(); err != nil {
		return helper.CreateResult(false, "", err.Error())
	}

	return helper.CreateResult(true, data, "")
}

func (st *StatementController) RemoveStatement(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	payload := toolkit.M{}
	if err := r.GetPayload(&payload); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}
	if err := new(efscore.Statement).Delete(payload); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}

	return helper.CreateResult(true, nil, "")
}
