package efscore

import (
	"github.com/eaciit/dbox"
	"github.com/eaciit/efs"
	"github.com/eaciit/toolkit"
	"reflect"
	"strings"
	"time"
)

type Account struct {
	efs.Accounts
}

func GetAccountList(search toolkit.M, hasPattern bool) ([]efs.Accounts, error) {
	var query *dbox.Filter
	account := new(efs.Accounts)
	field := toolkit.ToString(search.Get("key", ""))

	valueType := reflect.TypeOf(account).Elem()

	if search.Has("key") && search.Has("val") {
		for i := 0; i < valueType.NumField(); i++ {
			key := strings.ToLower(valueType.Field(i).Name)
			dataType := valueType.Field(i).Type.String()
			if field == "_id" && key == "id" {
				key = "_id"
			}
			if key == field {
				if hasPattern {
					query = dbox.ParseFilter(field, toolkit.ToString(search.Get("val", "")),
						dataType, "")
				} else {
					switch dataType {
					case "int":
						query = dbox.Eq(field, toolkit.ToInt(search.Get("val"), toolkit.RoundingAuto))
					case "float32":
						query = dbox.Eq(field, toolkit.ToFloat32(search.Get("val"), 2, toolkit.RoundingAuto))
					case "float64", "efs.AccountTypeEnum":
						query = dbox.Eq(field, toolkit.ToFloat64(search.Get("val"), 2, toolkit.RoundingAuto))
					default:
						query = dbox.Contains(field, toolkit.ToString(search.Get("val", "")))
					}
				}
			}

		}
	}

	data := []efs.Accounts{}
	cursor, err := efs.Find(new(efs.Accounts), query, nil)
	if err != nil {
		return nil, err
	}
	if err := cursor.Fetch(&data, 0, false); err != nil {
		return nil, err
	}
	defer cursor.Close()
	return data, nil
}

func (ac *Account) GetById() error {
	obj := new(efs.Accounts)
	if err := efs.Get(obj, ac.ID); err != nil {
		return err
	}
	if err := toolkit.Serde(obj, ac, "json"); err != nil {
		return err
	}
	return nil
}

func (ac *Account) SaveAcc(payload toolkit.M) error {
	ls := new(efs.LedgerSummary)
	ls.ID = toolkit.RandomString(32)
	ls.SumDate, _ = time.Parse(time.RFC3339, payload.Get("date").(string))
	ls.Account = toolkit.ToString(payload.Get("_id", ""))
	ls.Opening = toolkit.ToFloat64(payload.Get("opening"), 6, toolkit.RoundingAuto)
	ls.In = 0
	ls.Out = 0
	ls.Balance = ls.Opening

	if err := toolkit.Serde(payload, ac, ""); err != nil {
		return err
	}

	if err := ac.Save(ls); err != nil {
		return err
	}

	return nil
}

func (ac *Account) Delete(payload toolkit.M) error {
	idArray := payload.Get("_id").([]interface{})

	for _, id := range idArray {
		o := new(efs.Accounts)
		o.ID = toolkit.ToString(id)
		if err := efs.Delete(o); err != nil {
			return err
		}
	}
	return nil
}
