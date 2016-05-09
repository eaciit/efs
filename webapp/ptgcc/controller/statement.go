package controller

import (
	"github.com/eaciit/efs/webapp/ptgcc/helper"
	"github.com/eaciit/efs/webapp/ptgcc/model"
	"github.com/eaciit/knot/knot.v1"
	"github.com/eaciit/toolkit"
	"path/filepath"
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

	efsstatement := new(efscore.Statement)
	efsstatement.ID = r.Request.FormValue("_id")
	efsstatement.Title = r.Request.FormValue("title")
	if r.Request.FormValue("enable") == "true" {
		efsstatement.Enable = true
	}

	err := toolkit.UnjsonFromString(r.Request.FormValue("elements"), &efsstatement.Elements)

	if err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}

	imageLocation := filepath.Join(EFS_DATA_PATH, "image", "statement")
	err, imageName := helper.ImageUploadHandler(r, "userfile", imageLocation)
	if err != nil {
		return helper.CreateResult(false, "", err.Error())
	}

	efsstatement.ImageName = imageName

	// toolkit.Printfn("LINE 25 M : %s", r.Request.FormValue("elements"))
	// payload := toolkit.M{}
	// if err := r.GetForms(&payload); err != nil {
	// 	toolkit.Printfn("LINE 28")
	// 	return helper.CreateResult(false, nil, err.Error())
	// }

	// err r.GetForms(result)
	// a := r.Request.Form("title")
	// toolkit.Printfn("LINE 34 M : %s", payload)

	if err := efsstatement.Save(); err != nil {
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
