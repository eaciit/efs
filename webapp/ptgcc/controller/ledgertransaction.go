package controller

import (
	"github.com/eaciit/efs/webapp/ptgcc/helper"
	"github.com/eaciit/efs/webapp/ptgcc/model"
	"github.com/eaciit/knot/knot.v1"
	"github.com/eaciit/toolkit"
	// "path/filepath"
)

type LedgerTransactionController struct {
	App
}

func CreateLedgerTransactionController(s *knot.Server) *LedgerTransactionController {
	var controller = new(LedgerTransactionController)
	controller.Server = s
	return controller
}

func (st *LedgerTransactionController) SaveLedgerTransaction(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	efsledgertrans := new(efscore.LedgerTrans)

	if err := r.GetPayload(&efsledgertrans); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}

	if err := efsledgertrans.Save(); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}

	return helper.CreateResult(true, nil, "")
}

func (st *LedgerTransactionController) GetLedgerTransaction(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	payload := toolkit.M{}
	if err := r.GetPayload(&payload); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}
	val := toolkit.ToString(payload.Get("search", ""))

	keyword := toolkit.M{}.Set("key", "Account").Set("val", val)
	data, err := efscore.GetLedgerTransList(keyword)
	if err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}
	return helper.CreateResult(true, data, "")
}

func (st *LedgerTransactionController) EditLedgerTransaction(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	data := new(efscore.LedgerTrans)
	if err := r.GetPayload(&data); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}

	if err := data.GetById(); err != nil {
		return helper.CreateResult(false, "", err.Error())
	}

	return helper.CreateResult(true, data, "")
}

func (st *LedgerTransactionController) RemoveLedgerTransaction(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	payload := toolkit.M{}
	if err := r.GetPayload(&payload); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}
	if err := new(efscore.LedgerTrans).Delete(payload); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}

	return helper.CreateResult(true, nil, "")
}
