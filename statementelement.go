package efs

type ElementTypeEnum int
type TransactionReadTypeEnum int
type TimeReadTypeEnum int

const (
	ElementNone       ElementTypeEnum = 0
	ElementCoA                        = 1
	ElementGroup                      = 2
	ElementFromTo                     = 3
	ElementParmNumber                 = 10
	ElementParmDate                   = 11
	ElementParmString                 = 12
	ElementFormula                    = 50
)

const (
	ReadOpening  TransactionReadTypeEnum = 0
	ReadBalance                          = 1
	ReadIn                               = 2
	ReadOut                              = 3
	ReadMovement                         = 4
)

const (
	Timemtd         TimeReadTypeEnum = 0
	Timeqtd                          = 1
	Timeytd                          = 2
	TimeLastMonth                    = 3
	TimeLastQuarter                  = 4
	TimeLastYear                     = 5
)

type StatementElement struct {
	Index               int
	Title1              string
	Title2              string
	Type                ElementTypeEnum
	DataValue           []string
	Show                bool
	Showformula         bool
	Bold                bool
	NegateValue         bool
	NegateDisplay       bool
	Column              int
	Formula             []string
	TransactionReadType TransactionReadTypeEnum
	TimeReadType        TimeReadTypeEnum
}
