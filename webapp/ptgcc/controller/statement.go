package controller

import (
	"github.com/eaciit/efs"
	"github.com/eaciit/efs/webapp/ptgcc/helper"
	"github.com/eaciit/knot/knot.v1"
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
	if err := payload.Save(); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}

	return helper.CreateResult(true, payload, "")
}

func (st *StatementController) EditStatement(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	data := efs.Statements{}
	if err := r.GetPayload(&data); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}
	if err := data.GetById(); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}

	return helper.CreateResult(true, data, "")
}

func (st *StatementController) RemoveStatement(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	payload := map[string]interface{}{}
	if err := r.GetPayload(&payload); !helper.HandleError(err) {
		return helper.CreateResult(false, nil, err.Error())
	}

	idArray := payload["_id"].([]interface{})

	for _, id := range idArray {
		o := new(efs.Statements)
		o.ID = id.(string)
		if err := o.Delete(); err != nil {
			return helper.CreateResult(false, nil, err.Error())
		}
	}

	return helper.CreateResult(true, nil, "")
}
