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
fp.dataFormula = ko.observable({});
fp.selectColumn = ko.observable(0);
fp.dataVersion = ko.observableArray([]);
fp.selectListAkun = function(index, data){
	// $('#formula-editor').ecLookupDD("addLookup",{id:'@'+index, value: "@"+index+"("+data.title1+" "+data.title2+")"});
	$('#formula-editor').ecLookupDD("addLookup",{id:'@'+index, value: "@"+(index+1)});
};
fp.showFormula = function(index,data, indexColoumn){
    // if (data.Type == 50){
    	$("#formula-popup").modal("show");
        fp.selectColumn(indexColoumn);
        console.log("asd",index);
        console.log("asda",indexColoumn);
    // }
};
fp.saveFormulaEditor = function(){
    var objFormula = $('#formula-editor').ecLookupDD("get"), resultFormula = "";
    for (var i in objFormula){
        resultFormula += objFormula[i].value;
    }
    // if (fp.selectColumn()==1){

    // }
};
fp.saveStatement = function(){

}
fp.selectKoefisien = function(event){
	$('#formula-editor').ecLookupDD("addLookup",{id:event, value: event});
    $("#konstanta").focus();
};
fp.selectKoefisienGroup = function(event){
	$('#formula-editor').ecLookupDD("addLookup",{id:event, value: event});
};
fp.clearFormula = function(){
	$('#formula-editor').ecLookupDD("clear");
};
fp.getDataStatement = function(){
    app.ajaxPost("/statement/getstatementversion",{}, function(res){
        if(!app.isFine(res)){
            return;
        }
        if (!res.data) {
            res.data = [];
        }
        fp.dataFormula(res.data);
    });
};
fp.removeColumnFormula = function(index){
    console.log($("td[indexid="+index+"]"));
}
fp.addColumn = function(){
    fp.dataVersion.push({"Index":1,"Title1":"","Title2":"EBT (Acc Base)","Type":1,"DataValue":[],"Show":true,"Bold":false,"NegateValue":false,"NegateDisplay":false,"IsTxt":false,"ValueTxt":"","ValueNum":0});
    var index = $("#tableFormula>thead>tr input.searchversion").length + 1;
    $("#tableFormula>thead>tr").append("<td indexid='"+index+"'><div class='searchversion'><input class='searchversion' id='version"+index+"' /></div><div class='row-remove'><span class='glyphicon glyphicon-remove' onClick='fp.removeColumnFormula("+index+")'></span></td>");
    $('#version'+index).ecLookupDD({
        dataSource:{
            data:[],
        },
        placeholder: "Search Version",
        inputType: "ddl",
        idField: "id", 
        idText: "value", 
        displayFields: "value", 
    });
}

$(function (){
    // $("#kostanta").kendoNumericTextBox();
    fp.getDataStatement();
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
        placeholder: "Search Version",
        inputType: "ddl",
        idField: "id", 
        idText: "value", 
        displayFields: "value", 
    });
});