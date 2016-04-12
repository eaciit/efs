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
fp.konstanta = ko.observable("");
fp.selectListAkun = function(index, data){
	// $('#formula-editor').ecLookupDD("addLookup",{id:'@'+index, value: "@"+index+"("+data.title1+" "+data.title2+")"});
	$('#formula-editor').ecLookupDD("addLookup",{id:'@'+index, value: "@"+(index+1)});
};
fp.showFormula = function(index,data){
	$("#formula-popup").modal("show");
};
fp.selectKoefisien = function(event){
	$('#formula-editor').ecLookupDD("addLookup",{id:event, value: event});
    $("#konstanta").focus();
    console.log()
};
fp.selectKoefisienGroup = function(event){
	$('#formula-editor').ecLookupDD("addLookup",{id:event, value: event});
};
fp.clearFormula = function(){
	$('#formula-editor').ecLookupDD("clear");
}

fp.dataFormula = ko.observableArray([
	{
        index:1,
        title1:"EBT(Acc Base)",
        title2:"",
        type:1,
        datavalue:[],
        datavalue2:["200000"],
        value: "6400000",
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
        value: "200000",
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
        value: "@1/2",
        show:true,
        bold:false,
        negatevalue:false,
        negatedisplay:false
    }
]);

$(function (){
    // $("#kostanta").kendoNumericTextBox();
	$('#formula-editor').ecLookupDD({
		dataSource:{
			data:[],
		}, 
		placeholder: "Area Formula",
		areaDisable: true,
		inputType: 'multiple', 
		inputSearch: "value", 
		idField: "id", 
		idText: "value", 
		displayFields: "value", 
	});

    $('#version1').ecLookupDD({
        dataSource:{
            data:[],
        },
        placeholder: "Title Version",
        inputType: "ddl",
        idField: "id", 
        idText: "value", 
        displayFields: "value", 
    });
});