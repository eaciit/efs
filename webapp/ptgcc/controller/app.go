package controller

import (
	"fmt"
	"github.com/eaciit/knot/knot.v1"
	"os"
	"path/filepath"
)

type App struct {
	Server *knot.Server
}

var (
	LayoutFile   string   = "views/layout.html"
	IncludeFiles []string = []string{"views/_head.html", "views/_loader.html", "views/_miniloader.html"}
	AppBasePath  string   = func(dir string, err error) string { return dir }(os.Getwd())
	// EFS_CONFIG_PATH  string   = os.Getenv("EFS_CONFIG_PATH")
	EFS_CONFIG_PATH string = filepath.Join(AppBasePath, "config")
)

func init() {
	fmt.Println("Base Path ===> ", AppBasePath)

	if EFS_CONFIG_PATH != "" {
		fmt.Println("EFS_CONFIG_PATH ===> ", EFS_CONFIG_PATH)
	}
}
