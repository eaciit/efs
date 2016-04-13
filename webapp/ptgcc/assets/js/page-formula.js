app.section('formula');

var dataexample = {
    "ID": "3TfZVRgHLLY4BQQxMyYyuBG44O1nfKLe",
    "Title": "base-v1",
    "StatementID": "bid1EWFRZwL-at1uyFvzJYUjPu3yuh3j",
    "Element": [{
        "Index": 1,
        "Title1": "",
        "Title2": "EBT (Acc Base)",
        "Type": 10,
        "DataValue": [],
        "Show": true,
        "Bold": false,
        "NegateValue": false,
        "NegateDisplay": false,
        "IsTxt": false,
        "ValueTxt": "",
        "ValueNum": 0
    }, {
        "Index": 2,
        "Title1": "AB",
        "Title2": "",
        "Type": 11,
        "DataValue": [],
        "Show": true,
        "Bold": false,
        "NegateValue": false,
        "NegateDisplay": false,
        "IsTxt": false,
        "ValueTxt": "",
        "ValueNum": 0
    }, {
        "Index": 3,
        "Title1": "",
        "Title2": "Depre (Add back)",
        "Type": 12,
        "DataValue": [],
        "Show": true,
        "Bold": false,
        "NegateValue": false,
        "NegateDisplay": false,
        "IsTxt": false,
        "ValueTxt": "",
        "ValueNum": 0
    }, {
        "Index": 4,
        "Title1": "",
        "Title2": "Educational support",
        "Type": 1,
        "DataValue": [],
        "Show": true,
        "Bold": false,
        "NegateValue": false,
        "NegateDisplay": false,
        "IsTxt": false,
        "ValueTxt": "",
        "ValueNum": 0
    }, {
        "Index": 5,
        "Title1": "",
        "Title2": "Contribution for public charities",
        "Type": 1,
        "DataValue": [],
        "Show": true,
        "Bold": false,
        "NegateValue": false,
        "NegateDisplay": false,
        "IsTxt": false,
        "ValueTxt": "",
        "ValueNum": 0
    }, {
        "Index": 6,
        "Title1": "",
        "Title2": "Expenses for education or sports",
        "Type": 1,
        "DataValue": [],
        "Show": true,
        "Bold": false,
        "NegateValue": false,
        "NegateDisplay": false,
        "IsTxt": false,
        "ValueTxt": "",
        "ValueNum": 0
    }, {
        "Index": 7,
        "Title1": "LB",
        "Title2": "",
        "Type": 1,
        "DataValue": [],
        "Show": true,
        "Bold": false,
        "NegateValue": false,
        "NegateDisplay": false,
        "IsTxt": false,
        "ValueTxt": "",
        "ValueNum": 0
    }, {
        "Index": 8,
        "Title1": "",
        "Title2": "Dividend Paid",
        "Type": 1,
        "DataValue": [],
        "Show": true,
        "Bold": false,
        "NegateValue": false,
        "NegateDisplay": false,
        "IsTxt": false,
        "ValueTxt": "",
        "ValueNum": 0
    }, {
        "Index": 9,
        "Title1": "",
        "Title2": "",
        "Type": 1,
        "DataValue": [],
        "Show": true,
        "Bold": false,
        "NegateValue": false,
        "NegateDisplay": false,
        "IsTxt": false,
        "ValueTxt": "",
        "ValueNum": 0
    }, {
        "Index": 10,
        "Title1": "EBT",
        "Title2": "",
        "Type": 1,
        "DataValue": [],
        "Show": true,
        "Bold": false,
        "NegateValue": false,
        "NegateDisplay": false,
        "IsTxt": false,
        "ValueTxt": "",
        "ValueNum": 0
    }]
}
viewModel.FormulaPage = {}; var fp = viewModel.FormulaPage;
fp.templatestatement = {
    ID: "",
    Title: "",
    StatementID: "",
    Element: [],
};
fp.templateFormula = {
	Index:0,
    Title1:"",
    Title2:"",
    Type:1,
    DataValue:[],
    Show: "",
    Bold: false,
    NegateValue: false,
    NegateDisplay: false,
    IsTxt: false,
    ValueTxt: "",
    ValueNum: 0,
    ElementVersion: [],
};
fp.configFormula = ko.mapping.fromJS(fp.templateFormula);
fp.konstanta = ko.observable(0);
fp.dataFormula = ko.mapping.fromJS(fp.templatestatement);
fp.selectColumn = ko.observable({});
fp.dataVersion = ko.observableArray([]);
fp.modeFormula = ko.observable("");
fp.lastParam = ko.observable(true);
fp.recordKoefisien = ko.observableArray([]);
fp.selectListAkun = function(index, data){
    if (fp.modeFormula() == ""){
    	$('#formula-editor').ecLookupDD("addLookup",{id:'@'+index, value: "@"+(index+1), koefisien:true});
    } else if (fp.modeFormula() == "SUM" || fp.modeFormula() == "AVG") {
        var $areaselect = $("#tablekoefisien>tbody .eclookup-selected").parent().find(".areakoefisien"), idselect = $areaselect.attr("id");
        if($areaselect.length>0)
            $('#'+idselect).ecLookupDD("addLookup",{id:'@'+index, value: "@"+(index+1), koefisien:true});
    }
    fp.lastParamSelect();
};
fp.changeKonstanta = function(){
    console.log("asdasd");
};
fp.lastParamSelect = function(){
    var objFormula = $('#formula-editor').ecLookupDD("get");
    if (objFormula.length>0)
        fp.lastParam(objFormula[objFormula.length-1].koefisien);
    else
        fp.lastParam("");
}
fp.showFormula = function(index,data, indexColoumn){
    console.log("index",index);
    console.log("index coloum",indexColoumn);
    // if (data.Type == 50){
        fp.modeFormula("");
    	$("#formula-popup").modal("show");
        fp.selectColumn({index:index,indexcol:indexColoumn});
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
    fp.modeFormula("");
	$('#formula-editor').ecLookupDD("addLookup",{id:event, value: event, koefisien:false});
    fp.lastParamSelect();
    $("#konstanta").focus();
};
fp.selectKoefisienGroup = function(event){
    fp.backFormulaEditor();
    fp.modeFormula(event);
	// $('#formula-editor').ecLookupDD("addLookup",{id:event, value: event});

};
fp.backFormulaEditor = function(){
    fp.recordKoefisien([]);
    fp.addParameter();
    fp.modeFormula("");
};
fp.addParameter = function(){
    fp.recordKoefisien.push({valueform:"",valueto:""});
    $('#koefisien1'+(fp.recordKoefisien().length-1)).ecLookupDD({
        dataSource:{
            data:[],
        }, 
        placeholder: "Area Formula",
        areaDisable: false,
        inputType: 'ddl', 
        inputSearch: "value", 
        idField: "id", 
        idText: "value", 
        displayFields: "value", 
        showSearch: false,
        focusable: true,
    });
    $('#koefisien2'+(fp.recordKoefisien().length-1)).ecLookupDD({
        dataSource:{
            data:[],
        }, 
        placeholder: "Area Formula",
        areaDisable: false,
        inputType: 'ddl', 
        inputSearch: "value", 
        idField: "id", 
        idText: "value", 
        displayFields: "value", 
        showSearch: false,
        focusable: true,
    });
};
fp.addKostantaFormula = function(){

    fp.backFormulaEditor();
}
fp.removeKoefisien = function(data){
    fp.recordKoefisien.remove(data)
};
fp.clearFormula = function(){
	$('#formula-editor').ecLookupDD("clear");
};
fp.getDataStatement = function(){
    // app.ajaxPost("/statement/getstatementversion",{}, function(res){
    //     if(!app.isFine(res)){
    //         return;
    //     }
    //     if (!res.data) {
    //         res.data = [];
    //     }
    //     fp.dataFormula(res.data);
    // });
    for(var i in dataexample.Element){
        dataexample.Element[i] = $.extend({}, fp.templateFormula, dataexample.Element[i] || {});
    }
    ko.mapping.fromJS(dataexample, fp.dataFormula);
};
fp.removeColumnFormula = function(index){
    console.log($("td[indexid="+index+"]"));
}
fp.addColumn = function(){
    var dataStatement = $.extend(true, {}, ko.mapping.toJS(fp.dataFormula)), elemVer = {};
    for (var i in dataStatement.Element){
        elemVer = $.extend(true, {}, dataStatement.Element[i]);
        delete elemVer["ElementVersion"];
        dataStatement.Element[i].ElementVersion.push(elemVer);
        // fp.dataFormula.Element()[i].ElementVersion.push(fp.dataFormula.Element()[i]);
    }
    ko.mapping.fromJS(dataStatement, fp.dataFormula);
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
    fp.getDataStatement();
    $("#kostanta").bind("keyup", function(e) {
        if (e.keyCode == 13){
            $('#formula-editor').ecLookupDD("addLookup",{id: fp.konstanta().toString(), value: fp.konstanta().toString(), koefisien:true});
            fp.konstanta(0);
        }
    })
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