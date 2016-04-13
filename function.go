package efs

import (
	// "errors"
	"github.com/eaciit/toolkit"
	"strings"
)

type Fn func(tkm toolkit.M, formula string) interface{}
type MapFn map[string]Fn

var efsfunc MapFn

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
		// toolkit.Printf("DEBUG 31 : %v\n", cval)
		tacval := strings.Split(cval, ",")
		for _, tcval := range tacval {
			fval += toolkit.ToFloat64(tkm.Get(tcval, 0), 6, toolkit.RoundingAuto)
		}
	}
	return fval
}

var fnIF Fn = func(tkm toolkit.M, formula string) interface{} {
	var fval float64
	// Process in here
	return fval
}

var fnAVG Fn = func(tkm toolkit.M, formula string) interface{} {
	var fval float64
	// Process in here
	return fval
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
