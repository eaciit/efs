app.section('formula');

viewModel.FormulaPage = {}; var fp = viewModel.FormulaPage;
fp.templateFormula = {
	index:0,
    title1:"",
    title2:"",
    type:1,
    datavalue:[],
    datavalue2:[],
    value1: "",
    value2: "",
    show:false,
    bold:false,
    negatevalue:false,
    negatedisplay:false
};
fp.configFormula = ko.mapping.fromJS(fp.templateFormula);
fp.selectListAkun = function(index){

};
fp.showFormula = function(index,data){
	$("#formula-popup").modal("show");
};

fp.dataFormula = ko.observableArray([
	{
        index:1,
        title1:"EBT(Acc Base)",
        title2:"",
        type:1,
        datavalue:[],
        datavalue2:["200000"],
        value1: "",
        value2: "6400000",
        show:true,
        bold:true,
        negatevalue:false,
        negatedisplay:false
    },
	{
        index:1,
        title1:"Step 1",
        title2:"Depre (Add back)",
        type:1,
        datavalue:[],
        datavalue2:["200000"],
        value1: "",
        value2: "",
        show:true,
        bold:false,
        negatevalue:false,
        negatedisplay:false
    },
    {
        index:2,
        title1:"EBT 2",
        title2:"Depre (Add back) 50%",
        type:50,
        datavalue:[],
        datavalue2:["@1/2"],
        value1: "",
        value2: "@1/2",
        show:true,
        bold:false,
        negatevalue:false,
        negatedisplay:false
    }
]);