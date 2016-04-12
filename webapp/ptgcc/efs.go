package main

import (
	"github.com/eaciit/dbox"
	"github.com/eaciit/efs"
	"github.com/eaciit/efs/webapp/ptgcc/controller"
	"github.com/eaciit/knot/knot.v1"
	"github.com/eaciit/toolkit"
	"net/http"
	"path"
	"runtime"
)

var (
	server *knot.Server
)

func main() {
	/*if controller.EFS_CONFIG_PATH == "" {
		fmt.Println("Please set the EFS_CONFIG_PATH variable")
		return
	}*/

	runtime.GOMAXPROCS(4)
	// efs.ConfigPath = controller.EFS_CONFIG_PATH

	server = new(knot.Server)
	server.Address = "localhost:8000"
	server.RouteStatic("res", path.Join(controller.AppBasePath, "assets"))
	server.Register(controller.CreateWebController(server), "")
	server.Register(controller.CreateStatementController(server), "")

	server.Route("/", func(r *knot.WebContext) interface{} {
		http.Redirect(r.Writer, r.Request, "/web/index", 301)
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
	if err != nil {
		return
	}

	err = conn.Connect()
	return
}
