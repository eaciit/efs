package efscore

import (
	"github.com/eaciit/dbox"
	"github.com/eaciit/efs"
	"github.com/eaciit/toolkit"
)

type LedgerTrans struct {
	efs.LedgerTrans
}

func GetLedgerTransList(search toolkit.M) ([]efs.LedgerTrans, error) {
	var query *dbox.Filter
	if search.Has("key") && search.Has("val") {
		key := toolkit.ToString(search.Get("key", ""))
		val := toolkit.ToString(search.Get("val", ""))
		if key != "" && val != "" {
			query = dbox.Contains(key, val)
		}
	}

	data := []efs.LedgerTrans{}
	cursor, err := efs.Find(new(efs.LedgerTrans), query, nil)
	if err != nil {
		return nil, err
	}
	if err := cursor.Fetch(&data, 0, false); err != nil {
		return nil, err
	}
	defer cursor.Close()
	return data, nil
}

func (st *LedgerTrans) GetById() error {
	if err := efs.Get(st, st.ID); err != nil {
		return err
	}
	return nil
}

func (st *LedgerTrans) Save() error {
	if st.ID == "" {
		st.ID = toolkit.RandomString(32)
	}
	if err := efs.Save(st); err != nil {
		return err
	}
	return nil
}

func (st *LedgerTrans) Delete(payload toolkit.M) error {
	idArray := payload.Get("_id").([]interface{})

	for _, id := range idArray {
		o := new(efs.LedgerTrans)
		o.ID = toolkit.ToString(id)
		if err := efs.Delete(o); err != nil {
			return err
		}
	}
	return nil
}
