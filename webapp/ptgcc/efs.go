package main

import (
	"github.com/eaciit/efs/webapp/ptgcc/controller"
	"github.com/eaciit/knot/knot.v1"
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

	server = new(knot.Server)
	server.Address = "localhost:8000"
	server.RouteStatic("res", path.Join(controller.AppBasePath, "assets"))
	server.Register(controller.CreateWebController(server), "")

	server.Route("/", func(r *knot.WebContext) interface{} {
		http.Redirect(r.Writer, r.Request, "/web/index", 301)
		return true
	})
	server.Listen()
}
