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
	inst, aformula := toolkit.M{}, toolkit.M{}
	if ins.Has("data") && strings.Contains(toolkit.TypeName(ins["data"]), "StatementVersion") {
		sv = ins["data"].(*StatementVersion)
		inst, aformula, err = extractdatainput(ins["data"].(*StatementVersion))
	} else if ins.Has("data") && toolkit.TypeName(ins["data"]) != "*StatementVersion" {
		err = errors.New("Data has wrong format.")
		return
	}

	sv.StatementID = e.ID
	sv.Element = make([]*VersionElement, 0, 0)
	for _, v := range e.Elements {
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
			str := ""
			if toolkit.IsSlice(inst.Get(toolkit.Sprintf("@%v", v.Index), "")) {
				str = strings.Join(inst[toolkit.Sprintf("@%v", v.Index)].([]string), "")
			} else {
				str = toolkit.ToString(inst.Get(toolkit.Sprintf("@%v", v.Index), ""))
			}

			if isnum(str) {
				decimalPoint := len(str) - (strings.Index(str, ".") + 1)
				tve.ValueNum = toolkit.ToFloat64(str, decimalPoint, toolkit.RoundingAuto)
			} else {
				tve.IsTxt = true
				tve.ValueTxt = str
			}

			if aformula.Has(toolkit.Sprintf("@%v", v.Index)) {
				tve.Formula = aformula[toolkit.Sprintf("@%v", v.Index)].([]string)
			}

		}

		sv.Element = append(sv.Element, tve)

	}

	return
}

func extractdatainput(inputsv *StatementVersion) (tkm, aformula toolkit.M, err error) {
	// toolkit.Println("ID of Statement version : ", inputsv.ID)
	tkm, aformula = toolkit.M{}, toolkit.M{}
	arrint := make([]int, 0, 0)

	for _, val := range inputsv.Element {
		//spare for other case depend on type and mode from config
		switch {
		case val.StatementElement.Type == ElementFormula:
			//get formula
			arr := []string{}
			for _, as := range val.Formula {
				arr = append(arr, as)
			}
			aformula.Set(toolkit.Sprintf("@%v", val.StatementElement.Index), arr)
			// ====

			tkm.Set(toolkit.Sprintf("@%v", val.StatementElement.Index), val.Formula)
		case val.StatementElement.Type == ElementParmString || val.StatementElement.Type == ElementParmDate:
			tkm.Set(toolkit.Sprintf("@%v", val.StatementElement.Index), val.ValueTxt)
		default:
			tkm.Set(toolkit.Sprintf("@%v", val.StatementElement.Index), val.ValueNum)
		}

		if val.StatementElement.Type != ElementNone {
			arrint = append(arrint, val.StatementElement.Index)
		}
	}

	tkcond := false
	in := 0
	for !tkcond {
		tkcond = true
		in += 1
		for _, i := range arrint {
			// val := toolkit.ToString(tkm[toolkit.Sprintf("@%v", i)])
			if toolkit.TypeName(tkm[toolkit.Sprintf("@%v", i)]) == "[]string" {
				arrstr := tkm[toolkit.Sprintf("@%v", i)].([]string)
				if hasdependencyarr(arrstr, tkm) {
					tkcond = false
				} else {
					str := strings.Join(arrstr, "")
					if strings.Contains(str, "fn:") {
						err = executefunction(arrstr, tkm)
						if err != nil {
							err = errors.New(toolkit.Sprintf("Execute function found : %v", err.Error()))
							return
						}
						str = strings.Join(arrstr, "")
					}

					f, err := toolkit.NewFormula(str)
					if err != nil {
						err = errors.New(toolkit.Sprintf("Error found : %v \n", err.Error()))
					} else {
						tkm.Set(toolkit.Sprintf("@%v", i), f.Run(tkm))
					}
				}
			}
		}

		if in > len(arrint) {
			tkcond = true
			err = errors.New("Formula not completed run")
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

func hasdependencyarr(arrstr []string, tkm toolkit.M) (cond bool) {
	cond = false
	for _, v := range arrstr {
		if strings.Contains(v, "@") && toolkit.TypeName(tkm[v]) == "[]string" {
			cond = true
			return
		}
	}

	return
}

func hasdependencystr(str string, tkm toolkit.M) (cond bool) {
	cond = false

	tvar := ""
	for i := 0; i < len(str); i++ {
		c := string(str[i])
		switch {
		case c == "@":
			tvar += c
		case strings.Contains(signs, c):
			if strings.Contains(tvar, "..") {
				//for sum or other that use .. or comma
			} else if len(tvar) > 0 && strings.Contains(toolkit.ToString(tkm.Get(tvar, "")), "@") {
				cond = true
				return
			}
			tvar = ""
		default:
			if len(tvar) > 0 {
				tvar += c
			}
		}
	}
	return
}

func executefunction(arrstr []string, tkm toolkit.M) (err error) {
	return
}
