package efscore

import (
	"github.com/eaciit/dbox"
	"github.com/eaciit/efs"
	"github.com/eaciit/toolkit"
)

type LedgerTransFile struct {
	efs.LedgerTransFile
}

func GetLedgerTransFileList(search toolkit.M) ([]efs.LedgerTransFile, error) {
	var query *dbox.Filter
	if search.Has("key") && search.Has("val") {
		key := toolkit.ToString(search.Get("key", ""))
		val := toolkit.ToString(search.Get("val", ""))
		if key != "" && val != "" {
			query = dbox.Contains(key, val)
		}
	}

	data := []efs.LedgerTransFile{}
	cursor, err := efs.Find(new(efs.LedgerTransFile), query, nil)
	if err != nil {
		return nil, err
	}
	if err := cursor.Fetch(&data, 0, false); err != nil {
		return nil, err
	}
	defer cursor.Close()
	return data, nil
}

func GetLedgerTransFileOnProcess() ([]efs.LedgerTransFile, error) {
	var query *dbox.Filter
	query = dbox.And(dbox.Gt("process", 0), dbox.Lt("process", 100))

	data := []efs.LedgerTransFile{}
	cursor, err := efs.Find(new(efs.LedgerTransFile), query, nil)
	if err != nil {
		return nil, err
	}
	if err := cursor.Fetch(&data, 0, false); err != nil {
		return nil, err
	}
	defer cursor.Close()
	return data, nil
}
