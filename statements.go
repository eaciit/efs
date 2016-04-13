package efs

import (
	"errors"
	"github.com/eaciit/orm/v1"
	"github.com/eaciit/toolkit"
	"regexp"
	"strings"
)

type Statements struct {
	orm.ModelBase `bson:"-",json:"-"`
	ID            string `json:"_id",bson:"_id"`
	Title         string
	Enable        bool
	Elements      []*StatementElement
}

func (e *Statements) RecordID() interface{} {
	return e.ID
}

func NewStatements() *Statements {
	e := new(Statements)
	e.Enable = true
	return e
}

func (e *Statements) TableName() string {
	return "statements"
}

func (e *Statements) Save() error {
	if err := Save(e); err != nil {
		return err
	}
	return nil
}

func (e *Statements) Run(ins toolkit.M) (sv *StatementVersion, err error) {
	sv = new(StatementVersion)
	// toolkit.Println("data format, : ", toolkit.TypeName(ins["data"]))
	inst := toolkit.M{}
	if ins.Has("data") && strings.Contains(toolkit.TypeName(ins["data"]), "StatementVersion") {
		inst = generateinst(ins["data"].(*StatementVersion))
	} else if ins.Has("data") && toolkit.TypeName(ins["data"]) != "*StatementVersion" {
		err = errors.New("Data has wrong format.")
		return
	}

	// sv.ID = toolkit.ToString(ins.Get("ID", ""))
	// if sv.ID == "" {
	// 	sv.ID = toolkit.RandomString(32)
	// }

	// sv.Title = toolkit.ToString(ins.Get("title", ""))
	sv.StatementID = e.ID
	// toolkit.Printf("Debug Elements : %#v\n", e.Elements)
	sv.Element = make([]*VersionElement, 0, 0)
	for _, v := range e.Elements {
		// toolkit.Printf("%#v\n", v)
		tve := new(VersionElement)
		tve.StatementElement = v

		tve.IsTxt = false
		switch {
		case v.Type == ElementParmString || v.Type == ElementParmDate:
			tve.IsTxt = true
			tve.ValueTxt = toolkit.ToString(inst.Get(toolkit.Sprintf("@%v", v.Index), ""))
		case v.Type == ElementParmNumber:
			str := toolkit.ToString(inst.Get(toolkit.Sprintf("@%v", v.Index), ""))
			decimalPoint := len(str) - (strings.Index(str, ".") + 1)
			tve.ValueNum = toolkit.ToFloat64(str, decimalPoint, toolkit.RoundingAuto)
		case v.Type == ElementFormula:
			str := toolkit.ToString(inst.Get(toolkit.Sprintf("@%v", v.Index), ""))
			if isnum(str) {
				decimalPoint := len(str) - (strings.Index(str, ".") + 1)
				tve.ValueNum = toolkit.ToFloat64(str, decimalPoint, toolkit.RoundingAuto)
			} else {
				tve.IsTxt = true
				tve.ValueTxt = str
			}

			// if strings.Contains(str, "@") {
			// 	//checkinstvar(str, inst); please do check as well to find condition require field with formula
			// 	f, erf := toolkit.NewFormula(str)
			// 	if erf != nil {
			// 		err = errors.New(erf.Error())
			// 		return
			// 	}
			// 	inst.Set(toolkit.Sprintf("@%v", v.Index), f.Run(inst))
			// 	str = toolkit.ToString(inst.Get(toolkit.Sprintf("@%v", v.Index), ""))
			// }
		}

		sv.Element = append(sv.Element, tve)

	}

	return
}

func generateinst(inputsv *StatementVersion) (tkm toolkit.M) {
	// toolkit.Println("ID of Statement version : ", inputsv.ID)
	tkm = toolkit.M{}

	for _, val := range inputsv.Element {
		//spare for other case depend on type and mode from config
		switch {
		case val.StatementElement.Type == ElementFormula:
			tkm.Set(toolkit.Sprintf("@%v", val.StatementElement.Index), val.Formula)
		case val.StatementElement.Type == ElementParmString || val.StatementElement.Type == ElementParmDate:
			tkm.Set(toolkit.Sprintf("@%v", val.StatementElement.Index), val.ValueTxt)
		default:
			tkm.Set(toolkit.Sprintf("@%v", val.StatementElement.Index), val.ValueNum)
		}
	}

	tkcond := false

	for !tkcond {
		tkcond = true
		for key, val := range tkm {
			switch {
			case strings.Contains(toolkit.ToString(val), "SUM("):
				//
			case strings.Contains(toolkit.ToString(val), "IF("):
				//
			case strings.Contains(toolkit.ToString(val), "@"):
				tkcond = false
				f, err := toolkit.NewFormula(toolkit.ToString(val))
				if err != nil {
					continue
				}
				ires := f.Run(tkm)
				tkm.Set(key, ires)
			}
		}
	}

	// 	str := toolkit.ToString(inst.Get(toolkit.Sprintf("@%v", v.Index), ""))
	// if strings.Contains(str, "@") {
	// 	//checkinstvar(str, inst); please do check as well to find condition require field with formula
	// 	f, erf := toolkit.NewFormula(str)
	// 	if erf != nil {
	// 		err = errors.New(erf.Error())
	// 		return
	// 	}
	// 	inst.Set(toolkit.Sprintf("@%v", v.Index), f.Run(inst))
	// 	str = toolkit.ToString(inst.Get(toolkit.Sprintf("@%v", v.Index), ""))
	// }

	// decimalPoint := len(str) - (strings.Index(str, ".") + 1)
	// tve.ValueNum = toolkit.ToFloat64(str, decimalPoint, toolkit.RoundingAuto)
	return
}

func sumdata(formula string, inst toolkit.M) (snum float64) {
	return
}

func ifcond(formula string, inst toolkit.M) (sif interface{}) {
	return
}

func isnum(str string) bool {

	matchFloat, matchNumber := false, false
	x := strings.Index(str, ".")

	if x > 0 {
		matchFloat = true
		str = strings.Replace(str, ".", "", 1)
	}

	matchNumber, _ = regexp.MatchString("^\\d+$", str)

	return matchFloat && matchNumber
}

//sum and if function
