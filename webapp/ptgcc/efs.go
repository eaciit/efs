package main

import (
	"github.com/eaciit/dbox"
	"github.com/eaciit/efs"
	"github.com/eaciit/efs/webapp/ptgcc/controller"
	"github.com/eaciit/efs/webapp/ptgcc/installation"
	"github.com/eaciit/efs/webapp/ptgcc/model"
	"github.com/eaciit/knot/knot.v1"
	"github.com/eaciit/toolkit"
	"net/http"
	// "os"
	"path/filepath"
	"runtime"
)

var (
	server *knot.Server
)

func main() {
	runtime.GOMAXPROCS(4)
	efscore.ConfigPath = controller.EFS_CONFIG_PATH

	server = new(knot.Server)

	port := new(efscore.Ports)
	port.ID = "port"
	if err := port.GetPort(); err != nil {
		toolkit.Printf("Error get port: %s \n", err.Error())
	}
	if port.Port == 0 {
		if err := setup.Port(port); err != nil {
			toolkit.Printf("Error set port: %s \n", err.Error())
		}
	}

	server.Address = toolkit.Sprintf("localhost:%v", toolkit.ToString(port.Port))
	server.RouteStatic("res", filepath.Join(controller.AppBasePath, "assets"))
	server.RouteStatic("image", filepath.Join(controller.EFS_DATA_PATH, "image"))
	server.Register(controller.CreateWebController(server), "")
	server.Register(controller.CreateStatementController(server), "")
	server.Register(controller.CreateStatementVersionController(server), "")
	server.Register(controller.CreateLedgerTransactionController(server), "")
	server.Register(controller.CreateLedgerTransFileController(server), "")
	server.Register(controller.CreateAccountController(server), "")
	server.Register(controller.CreateLoginController(server), "")

	// server.Route("/", func(r *knot.WebContext) interface{} {
	// 	http.Redirect(r.Writer, r.Request, "/web/index", 301)
	// 	return true
	// })

	server.Route("/", func(r *knot.WebContext) interface{} {
		sessionid := r.Session("sessionid", "")
		if sessionid == "" {
			http.Redirect(r.Writer, r.Request, "/web/login", 301)
		} else {
			http.Redirect(r.Writer, r.Request, "/web/index", 301)
		}

		return true
	})

	conn, err := prepareconnection()

	if err != nil {
		toolkit.Printf("Error connecting to database: %s \n", err.Error())
	}

	err = efs.SetDb(conn)
	if err != nil {
		toolkit.Printf("Error set database to efs: %s \n", err.Error())
	}

	server.Listen()
}

func prepareconnection() (conn dbox.IConnection, err error) {
	conn, err = dbox.NewConnection("mongo",
		&dbox.ConnectionInfo{"192.168.0.200:27017", "efspttgcc", "", "", toolkit.M{}.Set("timeout", 3)})

	// db := filepath.Join(controller.EFS_DATA_PATH, "db")
	// conn, err = dbox.NewConnection("jsons",
	// 	&dbox.ConnectionInfo{db, "", "", "", toolkit.M{}.Set("newfile", true)})

	if err != nil {
		return
	}

	err = conn.Connect()
	return
}
