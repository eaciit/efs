package controller

import (
	"github.com/eaciit/efs/webapp/ptgcc/helper"
	"github.com/eaciit/knot/knot.v1"
	"github.com/eaciit/toolkit"
)

type LoginController struct {
	App
}

func CreateLoginController(s *knot.Server) *LoginController {
	var controller = new(LoginController)
	controller.Server = s
	return controller
}

func (s *LoginController) ProcessLogin(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	payload := toolkit.M{}
	err := r.GetPayload(&payload)

	switch {
	case err != nil:
		return helper.CreateResult(false, nil, err.Error())
	case !payload.Has("username") || !payload.Has("password"):
		return helper.CreateResult(false, nil, "username or password not found")
	case payload.Has("username") && len(toolkit.ToString(payload["username"])) == 0:
		return helper.CreateResult(false, nil, "username cannot empty")
	case payload.Has("password") && len(toolkit.ToString(payload["password"])) == 0:
		return helper.CreateResult(false, nil, "password cannot empty")
	}

	if toolkit.ToString(payload["username"]) == "eaciit" && toolkit.ToString(payload["password"]) == "Password.1" {
		sesid := toolkit.RandomString(32)
		r.SetSession("sessionid", sesid)
		return helper.CreateResult(true, toolkit.M{}.Set("status", true).Set("sessionid", sesid), "Login Success")
	}

	return helper.CreateResult(true, "", "Login failed")
}

func (s *LoginController) Logout(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson
	r.SetSession("sessionid", "")
	return helper.CreateResult(true, nil, "Logout success")
}
