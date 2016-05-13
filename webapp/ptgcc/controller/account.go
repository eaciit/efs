package controller

import (
	"github.com/eaciit/efs"
	"github.com/eaciit/efs/webapp/ptgcc/helper"
	"github.com/eaciit/efs/webapp/ptgcc/model"
	"github.com/eaciit/knot/knot.v1"
	"github.com/eaciit/toolkit"
	"time"
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
	var startdate, enddate time.Time
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

	if payload.Has("startdate") && payload.Has("enddate") {
		_ = toolkit.Serde(payload["startdate"], &startdate, "json")
		_ = toolkit.Serde(payload["enddate"], &enddate, "json")
	}

	if startdate.IsZero() || enddate.IsZero() {
		startdate = time.Date(2016, 1, 1, 0, 0, 0, 0, time.UTC)
		enddate = startdate.AddDate(0, 1, 0)
	}

	mdatas := make([]toolkit.M, 0, 0)
	for _, v := range data {
		mdata := toolkit.M{}
		mdata.Set("_id", v.ID).Set("title", v.Title).Set("type", v.Type).Set("group", v.Group)
		opening, in, out, balace := efs.GetOpeningInOutBalace(v.ID, v.Type, startdate, enddate)
		mdata.Set("opening", opening).Set("in", in).Set("out", out).Set("balance", balace)
		mdatas = append(mdatas, mdata)
	}
	return helper.CreateResult(true, mdatas, "")
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
