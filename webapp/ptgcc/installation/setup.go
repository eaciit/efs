package setup

import (
	"fmt"
	"github.com/eaciit/efs/webapp/ptgcc/model"
	"github.com/eaciit/toolkit"
)

func Database() {
	var driver, host, db, user, pass string

	fmt.Println("Setup ACL database ==============")

	fmt.Print("  driver (mongo/json/csv/mysql) : ")
	fmt.Scanln(&driver)

	fmt.Print("  host (& port) : ")
	fmt.Scanln(&host)

	fmt.Print("  database name : ")
	fmt.Scanln(&db)

	fmt.Print("  username : ")
	fmt.Scanln(&user)

	fmt.Print("  password : ")
	fmt.Scanln(&pass)

	config := toolkit.M{}
	config.Set("driver", driver)
	config.Set("host", host)
	config.Set("db", db)
	config.Set("user", user)
	config.Set("pass", pass)

	fmt.Println("Database Configuration saved!")
	efscore.SetDB(config)
}

func Port(_port *efscore.Ports) error {
	var port string

	fmt.Println("Port Setup ==============")

	fmt.Print("  port : ")
	fmt.Scanln(&port)

	if err := efscore.SetPort(_port, port); err != nil {
		return err
	}
	fmt.Println("Port Configuration saved!")
	return nil
}
