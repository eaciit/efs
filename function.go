package efs

import (
	// "errors"
	"github.com/eaciit/toolkit"
	"strings"
)

type Fn func(tkm toolkit.M, formula string) interface{}
type MapFn map[string]Fn

var efsfunc MapFn

type CondFormula struct {
	Logic       string
	Value       float64
	TrueVal     float64
	FalseVal    float64
	SubFormulas []*CondFormula
	BaseOp      string

	Txt string
}

var fnSUM Fn = func(tkm toolkit.M, formula string) interface{} {
	var fval float64
	// Process in here : formula SUM(@3..@5)
	acval := strings.Split(string(formula[4:len(formula)-1]), ",")
	for _, cval := range acval {
		if strings.Contains(cval, "..") {
			dotcval := strings.Split(cval, "..")
			i1 := toolkit.ToInt(dotcval[0][1:], toolkit.RoundingAuto)
			i2 := toolkit.ToInt(dotcval[1][1:], toolkit.RoundingAuto)
			cval = ""
			for i := i1; i <= i2; i++ {
				if len(cval) > 0 {
					cval += string(",")
				}
				cval += toolkit.Sprintf("@%v", i)
			}
		}
		tacval := strings.Split(cval, ",")
		for _, tcval := range tacval {
			fval += toolkit.ToFloat64(tkm.Get(tcval, 0), 6, toolkit.RoundingAuto)
		}
	}
	return fval
}

func getFieldValue(tkm toolkit.M, formula string) string {
	// formulaText := "1+@2"
	formulaText := formula
	for key, val := range tkm {
		if strings.Contains(formulaText, key) {
			formulaText = strings.Replace(formulaText, key, toolkit.ToString(val), -1)
		}
	}
	return formulaText
}

func checkLogic(formula string, logic string) bool {
	var result bool
	// trim := strings.Split(formula, "AND")

	return result
}

func compare(val1 float64, val2 float64, operator string) bool {
	switch {
	case operator == "<>":
		return val1 != val2
	case operator == "<=":
		return val1 <= val2
	case operator == ">=":
		return val1 >= val2
	case operator == ">":
		return val1 > val2
	case operator == "<":
		return val1 < val2
	default:
		return val1 == val2
	}
}

func findOperator(text string) string {
	var operatorList = []string{"<>", "<=", ">=", ">", "<", "="}
	var operator string
	for _, op := range operatorList {
		if strings.Contains(text, op) {
			operator = op
			break
		}
	}
	return operator
}

func compareValue(text string, operator string) bool {
	var result bool
	opVal := strings.Split(text, operator)
	var val1 float64
	var val2 float64
	if strings.ContainsAny(opVal[0], "-+*/^%") {
		fm, _ := NewFormula(opVal[0])
		val1 = fm.Run(nil)
	} else {
		val1 = toolkit.ToFloat64(opVal[0], 6, toolkit.RoundingAuto)
	}
	if strings.ContainsAny(opVal[0], "-+*/^%") {
		fm, _ := NewFormula(opVal[1])
		val2 = fm.Run(nil)
	} else {
		val2 = toolkit.ToFloat64(opVal[1], 6, toolkit.RoundingAuto)
	}
	result = compare(val1, val2, operator)
	// toolkit.Printf("\n%v %v %v = %v\n", val1, operator, val2, result)

	return result
}

var fnIF Fn = func(tkm toolkit.M, formula string) interface{} {
	var result interface{}
	var operatorList = []string{"<>", "<=", ">=", ">", "<", "="}
	ifVal := strings.Split(string(formula[3:len(formula)-1]), ",")
	var operator string
	for _, op := range operatorList {
		if strings.Contains(ifVal[0], op) {
			operator = op
			break
		}
	}
	trueVal := ifVal[toolkit.SliceLen(ifVal)-2]
	falseVal := ifVal[toolkit.SliceLen(ifVal)-1]
	var isTrue bool
	for _, _ifVal := range ifVal {
		if strings.Contains(_ifVal, operator) {
			opVal := strings.Split(_ifVal, operator)
			val1 := toolkit.ToFloat64(tkm.Get(opVal[0]), 6, toolkit.RoundingAuto)
			val2 := toolkit.ToFloat64(tkm.Get(opVal[1]), 6, toolkit.RoundingAuto)
			switch {
			case operator == "<>":
				isTrue = val1 != val2
			case operator == "<=":
				isTrue = val1 <= val2
			case operator == ">=":
				isTrue = val1 >= val2
			case operator == ">":
				isTrue = val1 > val2
			case operator == "<":
				isTrue = val1 < val2
			default:
				isTrue = opVal[0] == opVal[1]
			}
		}
	}
	if isTrue {
		result = tkm.Get(trueVal)
	} else {
		result = tkm.Get(falseVal)
	}
	return result
}

var fnAVG Fn = func(tkm toolkit.M, formula string) interface{} {
	var fval float64
	// Process in here : formula AVG(@3..@5)
	var numb float64
	acval := strings.Split(string(formula[4:len(formula)-1]), ",")
	for _, cval := range acval {
		if strings.Contains(cval, "..") {
			dotcval := strings.Split(cval, "..")
			i1 := toolkit.ToInt(dotcval[0][1:], toolkit.RoundingAuto)
			i2 := toolkit.ToInt(dotcval[1][1:], toolkit.RoundingAuto)
			cval = ""
			for i := i1; i <= i2; i++ {
				if len(cval) > 0 {
					cval += string(",")
				}
				cval += toolkit.Sprintf("@%v", i)
			}
		}
		tacval := strings.Split(cval, ",")
		for _, tcval := range tacval {
			numb += 1
			fval += toolkit.ToFloat64(tkm.Get(tcval, 0), 6, toolkit.RoundingAuto)
		}
	}
	return toolkit.ToFloat64((fval / numb), 6, toolkit.RoundingAuto)
}

func (m MapFn) Addfunction(name string, fn Fn) MapFn {
	m[name] = fn
	return m
}

func (m MapFn) Has(name string) bool {
	_, has := m[name]
	return has
}

func init() {
	efsfunc = make(MapFn, 0)

	efsfunc.Addfunction("SUM", fnSUM)
	efsfunc.Addfunction("IF", fnIF)
	efsfunc.Addfunction("AVG", fnAVG)
}
