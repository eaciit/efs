package controller

import (
	"github.com/eaciit/efs/webapp/ptgcc/helper"
	"github.com/eaciit/efs/webapp/ptgcc/model"
	"github.com/eaciit/knot/knot.v1"
	"github.com/eaciit/toolkit"
	"path/filepath"
	"time"
)

type LedgerTransFileController struct {
	App
}

func CreateLedgerTransFileController(s *knot.Server) *LedgerTransFileController {
	var controller = new(LedgerTransFileController)
	controller.Server = s
	return controller
}

func (ltf *LedgerTransFileController) SaveLedgerTransFile(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	fileLocation := filepath.Join(EFS_DATA_PATH, "file")

	efsledgertrans := new(efscore.LedgerTransFile)
	efsledgertrans.ID = toolkit.RandomString(32)
	err, oldName, newName := helper.UploadFileHandler(r, "userfile", fileLocation, efsledgertrans.ID)
	if err != nil {
		return helper.CreateResult(false, "", err.Error())
	}
	efsledgertrans.Filename = oldName
	efsledgertrans.PhysicalName = newName
	efsledgertrans.Desc = r.Request.FormValue("desc")
	efsledgertrans.Date = time.Now().UTC()
	efsledgertrans.GetAccountFile(filepath.Join(fileLocation, newName), "csv")
	efsledgertrans.Process = 0
	efsledgertrans.Status = "ready"
	efsledgertrans.Note = ""

	if err := efsledgertrans.Save(); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}

	return helper.CreateResult(true, nil, "")
}

func (ltf *LedgerTransFileController) GetLedgerTransFile(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	payload := toolkit.M{}
	if err := r.GetPayload(&payload); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}
	val := toolkit.ToString(payload.Get("search", ""))

	keyword := toolkit.M{}.Set("key", "_id").Set("val", val)
	data, err := efscore.GetLedgerTransFileList(keyword)
	if err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}
	return helper.CreateResult(true, data, "")
}

func (ltf *LedgerTransFileController) GetLTFOnProcess(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	data, err := efscore.GetLedgerTransFileOnProcess()
	if err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}
	return helper.CreateResult(true, data, "")
}
