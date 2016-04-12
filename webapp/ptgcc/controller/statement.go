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

func (st *StatementController) GetStatementVersion(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	// err := r.GetPayload(&payload)
	//ID or other filter will get and generated from payload
	sid := "qZ-SesL2s0Q7VODxyWj6-RVlqsa56ZMJ"

	ds := new(efs.Statements)
	err := efs.Get(ds, sid)
	if err != nil {
		return helper.CreateResult(false, "", toolkit.Sprintf("Error to get statement by id, found : %s \n", err.Error()))
	}

	//tittle or other condition will get and generated from payload
	ins := toolkit.M{}.Set("title", "base-v1")
	sv := ds.Run(ins)

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
