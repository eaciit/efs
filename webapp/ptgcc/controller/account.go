package controller

import (
	"github.com/eaciit/efs/webapp/ptgcc/helper"
	"github.com/eaciit/efs/webapp/ptgcc/model"
	"github.com/eaciit/knot/knot.v1"
	"github.com/eaciit/toolkit"
)

type AccountController struct {
	App
}

func CreateAccountController(s *knot.Server) *AccountController {
	var controller = new(AccountController)
	controller.Server = s
	return controller
}

func (ac *AccountController) SaveAccount(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	payload := new(efscore.Account)
	if err := r.GetPayload(&payload); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}
	if err := payload.Save(); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}
	return helper.CreateResult(true, nil, "")
}

func (ac *AccountController) GetAccount(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	payload := toolkit.M{}
	if err := r.GetPayload(&payload); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}
	val := toolkit.ToString(payload.Get("search", ""))

	keyword := toolkit.M{}.Set("key", "_id").Set("val", val)
	data, err := efscore.GetAccountList(keyword, false)
	if err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}
	return helper.CreateResult(true, data, "")
}

func (ac *AccountController) GetAllGroup(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson
	var err error

	payload := toolkit.M{}
	if err := r.GetPayload(&payload); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}

	keyword := toolkit.M{}
	var data interface{}
	if payload.Has("search") {
		search, _ := toolkit.ToM(payload.Get("search"))
		keyword.Set("key", "_id")
		keyword.Set("val", toolkit.ToString(search.Get("_id", "")))
		data, err = efscore.GetAccountList(keyword, true)
		if err != nil {
			return helper.CreateResult(false, nil, err.Error())
		}
	} else {
		keyword.Set("key", "type").Set("val", 1)
		data, err = efscore.GetAccountList(keyword, false)
		if err != nil {
			return helper.CreateResult(false, nil, err.Error())
		}
	}
	return helper.CreateResult(true, data, "")
}

func (ac *AccountController) EditAccount(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	data := new(efscore.Account)
	if err := r.GetPayload(&data); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}

	if err := data.GetById(); err != nil {
		return helper.CreateResult(false, "", err.Error())
	}

	return helper.CreateResult(true, data, "")
}

func (ac *AccountController) RemoveAccount(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	payload := toolkit.M{}
	if err := r.GetPayload(&payload); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}
	if err := new(efscore.Account).Delete(payload); err != nil {
		return helper.CreateResult(false, nil, err.Error())
	}

	return helper.CreateResult(true, nil, "")
}
