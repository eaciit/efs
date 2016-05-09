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
	ID            string              `json:"_id",bson:"_id"`
	Title         string              `json:"title",bson:"title"`
	Enable        bool                `json:"enable",bson:"enable"`
	Elements      []*StatementElement `json:"elements",bson:"elements"`
	ImageName     string              `json:"imagename",bson:"imagename"`
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

func (e *Statements) Run(ins toolkit.M) (sv *StatementVersion, comments []Comments, err error) {
	sv = new(StatementVersion)
	comments = make([]Comments, 0, 0)
	arrtkmcom := make([]toolkit.M, 0, 0)

	inst, aformula, tidcomment := toolkit.M{}, toolkit.M{}, make([][]string, 0, 0)
	if ins.Has("data") && strings.Contains(toolkit.TypeName(ins["data"]), "StatementVersion") {
		sv = ins["data"].(*StatementVersion)
		inst, aformula, tidcomment, err = extractdatainput(ins["data"].(*StatementVersion))
	} else if ins.Has("data") {
		err = errors.New("Data has wrong format.")
		return
	}

	/*if ins.Has("comment") && strings.Contains(toolkit.TypeName(ins["comment"]), ".M") {
		arrtkmcom = ins["comment"].([]toolkit.M)
	} else if ins.Has("comment") {
		err = errors.New("Comment has wrong format.")
		return
	}*/

	//set array comments and set id for new id
	/*for i, val := range arrtkmcom {
		comment := Comments{}

		if val.Has("type") && toolkit.ToString(val["type"]) != "delete" {
			toolkit.Serde(val, &comment, "json")
			if comment.ID == "" {
				comment.ID = toolkit.RandomString(32)
				val.Set("_id", comment.ID)
				arrtkmcom[i] = val
			}
			comments = append(comments, comment)
		}
	}*/
	commentArr := []interface{}{}
	if ins.Has("comment") {
		commentArr = ins["comment"].([]interface{})
	}

	for _, val := range commentArr {
		commentM, e := toolkit.ToM(val)
		if e != nil {
			err = e
			return
		}
		comment := Comments{}

		if commentM.Has("type") && toolkit.ToString(commentM["type"]) != "delete" {
			toolkit.Serde(commentM, &comment, "json")
			if comment.ID == "" {
				comment.ID = toolkit.RandomString(32)
				commentM.Set("_id", comment.ID)
			}
			// comment.Time = time.Now().UTC()
			comments = append(comments, comment)
		}
		arrtkmcom = append(arrtkmcom, commentM)
	}

	sv.StatementID = e.ID
	sv.Element = make([]*VersionElement, 0, 0)
	for i, v := range e.Elements {
		tve := new(VersionElement)
		tve.StatementElement = v
		tve.Comments = make([]string, 0, 0)

		if len(tidcomment) > i {
			tve.Comments = append(tve.Comments, tidcomment[i]...)
		}

		if len(arrtkmcom) > 0 {
			tve.Comments = updatecomment(tve.StatementElement.Index, tve.Comments, arrtkmcom)
		}

		tve.IsTxt = false
		switch {
		case v.Type == ElementNone:
			tve.IsTxt = true
			tve.ValueTxt = strings.Join(v.DataValue, " ")
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

			tve.Formula = make([]string, 0, 0)
			if aformula.Has(toolkit.Sprintf("@%v", v.Index)) {
				tve.Formula = aformula[toolkit.Sprintf("@%v", v.Index)].([]string)
			}

		}

		sv.Element = append(sv.Element, tve)

	}

	return
}

//= will be split to  helper ==

func extractdatainput(inputsv *StatementVersion) (tkm, aformula toolkit.M, tidcomments [][]string, err error) {
	// toolkit.Println("ID of Statement version : ", inputsv.ID)
	tkm, aformula, tidcomments = toolkit.M{}, toolkit.M{}, make([][]string, 0, 0)
	arrint := make([]int, 0, 0)

	for _, val := range inputsv.Element {
		//spare for other case depend on type and mode from config
		// arrsvid = append(arrsvid, val.Sveid)
		tidcomm := []string{}
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

		if len(val.Comments) > 0 {
			tidcomm = append(tidcomm, val.Comments...)
			tidcomments = append(tidcomments, tidcomm)
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
						err = executefunction(toolkit.Sprintf("@%v", i), arrstr, tkm)
						if err != nil {
							err = errors.New(toolkit.Sprintf("Execute function found : %v", err.Error()))
							return
						}
						str = strings.Join(arrstr, "")
					}

					f, err := NewFormula(str)
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
		switch {
		case strings.Contains(v, "fn:"):
			endsign := signs + ","
			arrtstr := extractstr2var(v, "@", endsign)
			cond = hasdependencyarr(arrtstr, tkm)
			return
		case strings.Contains(v, "@") && tkm.Has(v) && toolkit.TypeName(tkm[v]) == "[]string":
			cond = true
			return
		}
	}
	return
}

func extractstr2var(str, startsign, endsign string) (arrstr []string) {
	arrstr = make([]string, 0, 0)
	tvar := ""
	for i := 0; i < len(str); i++ {
		c := string(str[i])
		switch {
		case c == startsign:
			tvar += c
		case strings.Contains(endsign, c):
			if strings.Contains(tvar, "..") {
				dotcval := strings.Split(tvar, "..")
				n1 := toolkit.ToInt(dotcval[0][1:], toolkit.RoundingAuto)
				n2 := toolkit.ToInt(dotcval[1][1:], toolkit.RoundingAuto)
				for n := n1; n <= n2; n++ {
					arrstr = append(arrstr, toolkit.Sprintf("@%v", n))
				}
			} else if len(tvar) > 0 {
				arrstr = append(arrstr, tvar)
			}
			tvar = ""
		default:
			if len(tvar) > 0 {
				tvar += c
			}
		}
	}
	if len(tvar) > 0 {
		arrstr = append(arrstr, tvar)
	}
	return
}

func executefunction(key string, arrstr []string, tkm toolkit.M) (err error) {
	for i, val := range arrstr {
		cval := ""
		if strings.Contains(val, "fn:") {
			cval = toolkit.ToString(val[3:])
		} else {
			continue
		}
		cname := ""
		for i := 0; i < len(cval); i++ {
			c := string(cval[i])
			if c == "(" {
				break
			}
			cname += c
		}
		arrstr[i] = toolkit.ToString(efsfunc[cname](tkm, cval))
	}
	return
}

func updatecomment(index int, comments []string, arrtkmcom []toolkit.M) (lastcomments []string) {
	add, del, lastcomments := make([]string, 0, 0), make([]string, 0, 0), make([]string, 0, 0)
	for _, val := range arrtkmcom {
		if val.Has("index") && toolkit.ToInt(val["index"], toolkit.RoundingAuto) == index {
			if val.Has("type") && toolkit.ToString(val["type"]) == "add" {
				add = append(add, toolkit.ToString(toolkit.Id(val)))
			} else if val.Has("type") && toolkit.ToString(val["type"]) == "delete" {
				del = append(del, toolkit.ToString(toolkit.Id(val)))
			}
		}
	}

	for _, val := range comments {
		if !toolkit.HasMember(del, val) {
			lastcomments = append(lastcomments, val)
		}
	}

	if len(add) > 0 {
		lastcomments = append(lastcomments, add...)
	}

	return
}
