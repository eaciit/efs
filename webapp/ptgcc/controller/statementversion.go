package controller

import (
	"github.com/eaciit/efs/webapp/ptgcc/helper"
	"github.com/eaciit/efs/webapp/ptgcc/model"
	"github.com/eaciit/knot/knot.v1"
	"github.com/eaciit/toolkit"
	"path/filepath"
)

type StatementVersionController struct {
	App
}

func CreateStatementVersionController(s *knot.Server) *StatementVersionController {
	var controller = new(StatementVersionController)
	controller.Server = s
	return controller
}

func (st *StatementVersionController) GetComment(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	payload := toolkit.M{}
	if err := r.GetPayload(&payload); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}
	data := efscore.GetComment(payload)

	return helper.CreateResult(true, data, "")
}

/*func (st *StatementVersionController) SaveComment(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	payload := new(efscore.Comment)
	if err := r.GetPayload(&payload); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}
	if err := payload.Save(); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}

	return helper.CreateResult(true, nil, "")
}*/

func (st *StatementVersionController) RemoveComment(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	payload := toolkit.M{}
	if err := r.GetPayload(&payload); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}
	if err := new(efscore.Comment).Delete(payload); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}

	return helper.CreateResult(true, nil, "")
}

func (st *StatementVersionController) SaveStatementVersion(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	// payload := new(efscore.StatementVersion)
	payload := toolkit.M{}
	if err := r.GetPayload(&payload); err != nil {
		return helper.CreateResult(false, "", err.Error())
	}
	/*if err := payload.Save(); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}*/
	if err := new(efscore.StatementVersion).Save(payload); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}

	return helper.CreateResult(true, nil, "")
}

func (st *StatementVersionController) RemoveStatementVersion(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	payload := new(efscore.StatementVersion)
	if err := r.GetPayload(&payload); err != nil {
		return helper.CreateResult(false, "", err.Error())
	}
	if err := payload.Delete(); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}

	return helper.CreateResult(true, nil, "")
}

func (st *StatementVersionController) SaveImageSV(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	imageLocation := filepath.Join(EFS_DATA_PATH, "image", "sv")

	err, imageName := helper.ImageUploadHandler(r, "userfile", imageLocation)
	if err != nil {
		return helper.CreateResult(false, "", err.Error())
	}

	return helper.CreateResult(true, imageName, "")
}

func (st *StatementVersionController) GetSVBySID(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	payload := toolkit.M{}
	if err := r.GetPayload(&payload); err != nil {
		return helper.CreateResult(false, "", err.Error())
	}
	data, err := efscore.GetSVBySID(payload)
	if err != nil {
		return helper.CreateResult(false, "", err.Error())
	}

	return helper.CreateResult(true, data, "")
}

func (st *StatementVersionController) GetStatementVersion(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	payload := toolkit.M{}
	if err := r.GetPayload(&payload); err != nil {
		return helper.CreateResult(false, "", err.Error())
	}

	result, err := efscore.GetSVByRun(payload)
	if err != nil {
		return helper.CreateResult(false, result, err.Error())
	}

	return helper.CreateResult(true, result, "")
}
