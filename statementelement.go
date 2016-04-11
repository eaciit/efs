package efs

type ElementTypeEnum int
const (
    ElementNone ElementTypeEnum = 0
    ElementCoA  = 1
    ElementGroup = 2
    ElementFromTo = 3
    ElementParmNumber = 10
    ElementParmDate = 11
    ElementFormula = 50
)

type StatementElement struct{
    Index int
    Title string
    Type ElementTypeEnum
    DataValue []string
    Show bool
    Bold bool
    NegateValue bool
    NegateDisplay bool
}