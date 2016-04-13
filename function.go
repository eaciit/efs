package efs

import (
	// "errors"
	"github.com/eaciit/toolkit"
	// "strings"
)

type Fn func(tkm toolkit.M, formula string) interface{}
type MapFn map[string]Fn

var efsfunc MapFn

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

	efsfunc.Addfunction("SUM", func(tkm toolkit.M, formula string) interface{} {
		var fval float64
		return fval
	})

	efsfunc.Addfunction("IF", func(tkm toolkit.M, formula string) interface{} {
		var fval float64
		return fval
	})

	efsfunc.Addfunction("AVG", func(tkm toolkit.M, formula string) interface{} {
		var fval float64
		return fval
	})
}
