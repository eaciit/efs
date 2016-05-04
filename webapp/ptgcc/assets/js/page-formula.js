app.section('formula');
viewModel.FormulaPage = {}; var fp = viewModel.FormulaPage;
viewModel.fileData = ko.observable({
    dataURL: ko.observable(),
});
viewModel.onClear = function(fileData){
    if(confirm('Are you sure?')){
        fileData.clear && fileData.clear();
    }                            
};
fp.templatestatement = {
    _id: "",
    Title: "",
    StatementID: "",
    Element: [],
};
fp.templateFormula = {
    StatementElement: {
    	Index:0,
        Title1:"",
        Title2:"",
        Type:1,
        DataValue:[],
        Show: true,
        Bold: false,
        NegateValue: false,
        NegateDisplay: false,
    },
    IsTxt: false,
    Formula: [],
    ValueTxt: "",
    ValueNum: 0,
    ImageName: "",
    FormulaText: [],
    ChangeValue: false,
    ElementVersion: [],
    Comments: [],
    CommentsTemp: [],
};
fp.templateComment = {
    _id: "", 
    name: "", 
    // sveid: "", 
    text: "",
    type: "old",
    index: 0

}
fp.PageNumber = ko.observableArray([]);
fp.configFormula = ko.mapping.fromJS(fp.templateFormula);
fp.configComment = ko.mapping.fromJS(fp.templateComment);
fp.konstanta = ko.observable(0);
fp.dataFormula = ko.mapping.fromJS(fp.templatestatement);
fp.selectColumn = ko.observable({});
fp.dataVersion = ko.observableArray([]);
fp.modeFormula = ko.observable("");
fp.lastParam = ko.observable(true);
fp.recordKoefisien = ko.observableArray([]);
fp.recordCondition = ko.observableArray([]);
fp.recordSugest = ko.observableArray([]);
fp.recordComment = ko.observableArray([]);
fp.imageName = ko.observable("");
fp.boolHeightTable = ko.observable(0);
fp.titlePopUp = ko.observable("");
fp.tempStatementId = ko.observable("");
fp.formulaTitle = ko.observable("");
fp.recordAllComment = ko.observableArray([]);
fp.recordPostComment = ko.observableArray([]);

fp.saveImage = function(){
    var idstatement = "";
    var formData = new FormData();
    formData.append("_id", idstatement);
    formData.append("index", fp.selectColumn().index);
    
    var file = viewModel.fileData().dataURL();
    if (file == "" && wl.scrapperMode() == "") {
        sweetAlert("Oops...", 'Please choose file', "error");
        return;
    } else {
        formData.append("userfile", viewModel.fileData().file());   
    }

    app.ajaxPost("/statementversion/saveimagesv", formData, function (res) {
        if (!app.isFine(res)) {
            return;
        }
        swal({title: "Selector successfully upload", type: "success"});
        fp.imageName(res.data);
        if (fp.selectColumn().indexcol == 1)
            fp.dataFormula.Element()[fp.selectColumn().index].ImageName(res.data);
        else
            fp.dataFormula.Element()[fp.selectColumn().index].ElementVersion()[(fp.selectColumn().indexcol - 1)].ImageName(res.data);
    });
};
fp.selectListAkun = function(index, data){
    var titleshow = "";
    if(data.StatementElement.Title2()!="")
        titleshow = data.StatementElement.Title2();
    else if (data.StatementElement.Title2() == "" && data.StatementElement.Title1() != "")
        titleshow = data.StatementElement.Title1();
    else
        titleshow = "@"+(index+1);
    if (fp.modeFormula() == ""){
    	$('#formula-editor').ecLookupDD("addLookup",{id:moment().format("hhmmDDYYYYx"), value: "@"+(index+1), title: titleshow, koefisien:true});
    } else if (fp.modeFormula() == "SUM" || fp.modeFormula() == "AVG") {
        var $areaselect = $("#tablekoefisien>tbody .eclookup-selected").parent().find(".areakoefisien"), idselect = $areaselect.attr("id");
        if($areaselect.length>0)
            $('#'+idselect).ecLookupDD("addLookup",{id:moment().format("hhmmDDYYYYx"), value: "@"+(index+1),title: "@"+(index+1), koefisien:true});
    } else if (fp.modeFormula() == "IF"){
        var $areaselect = $("#tableif>tbody .eclookup-selected").parent().find(".areakoefisien"), idselect = $areaselect.attr("id");
        if($areaselect.length>0)
            $('#'+idselect).ecLookupDD("addLookup",{id:moment().format("hhmmDDYYYYx"), value: "@"+(index+1), title:"@"+(index+1), koefisien:true});
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
    // if (data.StatementElement.Type == 50){
        // viewModel.fileData().clear();
        fp.modeFormula("");
        if(data.StatementElement.Title2() != "")
            fp.titlePopUp(data.StatementElement.Title2());
        else if (data.StatementElement.Title1() != "")
            fp.titlePopUp(data.StatementElement.Title1());
        else
            fp.titlePopUp("Formula");
    	$("#formula-popup").modal("show");
        fp.selectColumn({index:index,indexcol:indexColoumn});
        var datatojs = ko.mapping.toJS(data);
        $('#formula-editor').ecLookupDD("clear");
        viewModel.fileData().dataURL("/image/sv/"+datatojs.ImageName);
        for(var i in datatojs.Formula){
            if (datatojs.Formula[i] == "+" || datatojs.Formula[i] == "-" || datatojs.Formula[i] == "*" || datatojs.Formula[i] == "/")
                $('#formula-editor').ecLookupDD("addLookup",{id:moment().format("hhmmDDYYYYx"), value: datatojs.Formula[i], title:datatojs.FormulaText[i], koefisien:false});
            else
                $('#formula-editor').ecLookupDD("addLookup",{id:moment().format("hhmmDDYYYYx"), value: datatojs.Formula[i], title: datatojs.FormulaText[i], koefisien:true});
        }
    // }
};
fp.saveFormulaEditor = function(){
    var objFormula = $('#formula-editor').ecLookupDD("get"), resultFormula = "", resultFormulaArr = [];
    if (fp.selectColumn().indexcol == 1)
        fp.dataFormula.Element()[fp.selectColumn().index].FormulaText([]);
    else
        fp.dataFormula.Element()[fp.selectColumn().index].ElementVersion()[(fp.selectColumn().indexcol-2)].FormulaText([]);
    for (var i in objFormula){
        resultFormulaArr.push(objFormula[i].value);
        if (fp.selectColumn().indexcol == 1)
            fp.dataFormula.Element()[fp.selectColumn().index].FormulaText.push(objFormula[i].title);
        else
            fp.dataFormula.Element()[fp.selectColumn().index].ElementVersion()[(fp.selectColumn().indexcol-2)].FormulaText.push(objFormula[i].title);
    }
    if (fp.selectColumn().indexcol == 1){
        fp.dataFormula.Element()[fp.selectColumn().index].Formula(resultFormulaArr);
    } else {
        fp.dataFormula.Element()[fp.selectColumn().index].ElementVersion()[(fp.selectColumn().indexcol-2)].Formula(resultFormulaArr);
    }
    $('#formula-editor').ecLookupDD("clear");
    fp.backFormulaEditor();
    $("#formula-popup").modal("hide");
};
fp.refreshAll = function(index){
    // harus diganti
    var objFormula = [], postParam = {
        _id : "",
        statementid : fp.tempStatementId(),
    };
    if (index == 1){
        objFormula = $('#version1').ecLookupDD("get");
        postParam = {
            _id : objFormula[0]._id,
            statementid : objFormula[0].statementid,
            mode: "find"
        };
        app.ajaxPost("/statementversion/getstatementversion", postParam, function(res){
            if(!app.isFine(res)){
                return;
            }
            if (!res.data) {
                res.data = [];
            }
            for (var k in fp.recordAllComment()){
                if (fp.recordAllComment()[k].index == index){
                    fp.recordPostComment()[k].data = [];
                    fp.recordAllComment()[k].data = res.data.comment;
                }
            }
            fp.refreshSimulateByIndex(1, res.data.data);
        });
    }
    // if (fp.dataFormula.Element()[0].ElementVersion().length > 0){
    if (index > 1){
        // for (var i in fp.dataFormula.Element()[0].ElementVersion()){
        //     var aa = (parseInt(i)+2);
            objFormula = $('#version'+index).ecLookupDD("get");
            if (objFormula.length > 0){
                postParam = {
                    _id : objFormula[0]._id,
                    statementid : objFormula[0].statementid,
                    mode: "find"
                };
                app.ajaxPost("/statementversion/getstatementversion", postParam, function(res){
                    if(!app.isFine(res)){
                        return;
                    }
                    if (!res.data) {
                        res.data = [];
                    }
                    for (var k in fp.recordAllComment()){
                        if (fp.recordAllComment()[k].index == index){
                            fp.recordPostComment()[k].data = [];
                            fp.recordAllComment()[k].data = res.data.comment;
                        }
                    }
                    fp.refreshSimulateByIndex(index,res.data.data)
                });
            }
        // }
    }
}
fp.refreshSimulateByIndex = function(index,data){
    if (index == 1){
        var dataStatement = $.extend(true, {}, fp.templatestatement,ko.mapping.toJS(fp.dataFormula)), elemVer = {};
        for(var i in data.Element){
            dataStatement.Element[i] = $.extend({}, dataStatement.Element[i], data.Element[i] || {});
            dataStatement.Element[i].FormulaText = [];
            for(var d in dataStatement.Element[i].Formula){
                if (dataStatement.Element[i].Formula[d].substring(0,1) == "@")
                    formulaindex = dataStatement.Element[i].Formula[d].substring(1,dataStatement.Element[i].Formula[d].length);
                else
                    formulaindex = "";

                if(formulaindex!=""){
                    formulaindex = parseInt(formulaindex)-1;
                    if (dataStatement.Element[formulaindex].StatementElement.Title2 != "")
                        formulatext = dataStatement.Element[formulaindex].StatementElement.Title2;
                    else if(dataStatement.Element[formulaindex].StatementElement.Title2 == "" && dataStatement.Element[formulaindex].StatementElement.Title1 != "")
                        formulatext = dataStatement.Element[formulaindex].StatementElement.Title1;
                    else
                        formulatext = dataStatement.Element[i].Formula[d];
                    dataStatement.Element[i].FormulaText.push(formulatext+" ");
                } else
                    dataStatement.Element[i].FormulaText.push(dataStatement.Element[i].Formula[d]+" ");
            }
        }
        ko.mapping.fromJS(dataStatement, fp.dataFormula);
    } else {
        if (fp.dataFormula.Element()[0].ElementVersion().length > 0){
            var aa = (parseInt(index)-2);
            objFormula = $('#version'+index).ecLookupDD("get");
            var dataStatement = $.extend(true, {}, ko.mapping.toJS(fp.dataFormula)), elemVer = {}, indexVer = i+2, indexyo = 0;
            for (var i in dataStatement.Element){
                dataStatement.Element[i] = $.extend({}, dataStatement.Element[i], ko.mapping.toJS(fp.dataFormula.Element()[i]) || {});
                indexyo = parseInt(index) - 2;
                dataStatement.Element[i].ElementVersion[indexyo] = $.extend({}, dataStatement.Element[i].ElementVersion[indexyo], data.Element[i] || {});
                dataStatement.Element[i].ElementVersion[indexyo].FormulaText = [];
                for(var d in dataStatement.Element[i].ElementVersion[indexyo].Formula){
                    if (dataStatement.Element[i].ElementVersion[indexyo].Formula[d].substring(0,1) == "@")
                        formulaindex = dataStatement.Element[i].ElementVersion[indexyo].Formula[d].substring(1,dataStatement.Element[i].ElementVersion[indexyo].Formula[d].length);
                    else
                        formulaindex = "";

                    if(formulaindex!=""){
                        formulaindex = parseInt(formulaindex)-1;
                        if (dataStatement.Element[formulaindex].ElementVersion[indexyo].StatementElement.Title2 != "")
                            formulatext = dataStatement.Element[formulaindex].ElementVersion[indexyo].StatementElement.Title2;
                        else if(dataStatement.Element[formulaindex].ElementVersion[indexyo].StatementElement.Title2 == "" && dataStatement.Element[formulaindex].ElementVersion[indexyo].StatementElement.Title1 != "")
                            formulatext = dataStatement.Element[formulaindex].ElementVersion[indexyo].StatementElement.Title1;
                        else
                            formulatext = dataStatement.Element[i].ElementVersion[indexyo].Formula[d];
                        dataStatement.Element[i].ElementVersion[indexyo].FormulaText.push(formulatext+" ");
                    } else
                        dataStatement.Element[i].ElementVersion[indexyo].FormulaText.push(dataStatement.Element[i].ElementVersion[indexyo].Formula[d]+" ");
                }
            }
            ko.mapping.fromJS(dataStatement, fp.dataFormula);
        }
    }
    swal({title: "Selector successfully simulate", type: "success"});
    fp.refreshHeightTable();
    fp.changeValueVariable(index,false);
}
fp.changeValueVariable = function(index,valueChange){
    indexElem = index - 2;
    if (valueChange == true){
        if (index == 1 && fp.dataFormula.Element()[0].ChangeValue() == false){
            fp.dataFormula.Element()[0].ChangeValue(true);
        } else if (index > 1 && fp.dataFormula.Element()[0].ElementVersion()[indexElem].ChangeValue() == false) {
            fp.dataFormula.Element()[0].ElementVersion()[indexElem].ChangeValue(true);
        }
    }
    if (valueChange == false){
        if (index == 1 && fp.dataFormula.Element()[0].ChangeValue() == true){
            fp.dataFormula.Element()[0].ChangeValue(false);
        } else if (index > 1 && fp.dataFormula.Element()[0].ElementVersion()[indexElem].ChangeValue() == true) {
            index = index - 2;
            fp.dataFormula.Element()[0].ElementVersion()[indexElem].ChangeValue(false);
        }
    }
};
fp.saveStatementNew = function(index){
    var indexcomment = 0;
    var recordPostComment = ko.utils.arrayFilter(fp.recordPostComment(), function (each, indexa) {
        indexcomment = indexa;
        return each.index == index;
    });
    var objFormula = [], postParam = {
        _id : "",
        title : "",
        statementid : fp.tempStatementId(),
        element : []
    }, elementVer = [], mappingVer = {};
    indexElem = index - 2;
    if (index == 1 && fp.dataFormula.Element()[0].ChangeValue() == false){
        objFormula = $('#version1').ecLookupDD("get");
        if (objFormula.length > 0){
            postParam = {
                _id : objFormula[0]._id,
                comment: recordPostComment[0].data,
                title : objFormula[0].title,
                statementid : objFormula[0].statementid,
                element : ko.mapping.toJS(fp.dataFormula.Element())
            };
        } else {
            postParam = {
                _id : "",
                comment: recordPostComment[0].data,
                title : $(".table-formula-data>thead td[indexid="+1+"]").find(".eclookup-txt>input").val(),
                statementid : fp.tempStatementId(),
                element : ko.mapping.toJS(fp.dataFormula.Element())
            };
        }
        if (postParam.title != ''){
            app.ajaxPost("/statementversion/savestatementversion", postParam, function(res){
                if(!app.isFine(res)){
                    return;
                }
                if (!res.data) {
                    res.data = [];
                }
                swal({title: "Selector successfully save", type: "success"});
                fp.refreshAll(1);
            });
        }else{
            swal({title: "Field version can't empty", type: "warning"});
        }
    } else if (index > 1 && fp.dataFormula.Element()[0].ElementVersion()[indexElem].ChangeValue()== false){
        elementVer = [];
        var aa = (parseInt(index)-2);
        objFormula = $('#version'+index).ecLookupDD("get");
        mappingVer = ko.mapping.toJS(fp.dataFormula);
        for(var a in mappingVer.Element){
            elementVer.push(mappingVer.Element[a].ElementVersion[aa]);
        };
        if (objFormula.length > 0){
            postParam = {
                _id : objFormula[0]._id,
                title : objFormula[0].title,
                comment: recordPostComment[0].data,
                statementid : objFormula[0].statementid,
                element: elementVer
            };
        } else {
            postParam = {
                _id : "",
                comment: recordPostComment[0].data,
                title : $(".table-formula-data>thead td[indexid="+index+"]").find(".eclookup-txt>input").val(),
                statementid : fp.tempStatementId(),
                element: elementVer
            };
        }
        if (postParam.title != ''){
            app.ajaxPost("/statementversion/savestatementversion", postParam, function(res){
                if(!app.isFine(res)){
                    return;
                }
                if (!res.data) {
                    res.data = [];
                }
                swal({title: "Selector successfully save", type: "success"});
                fp.refreshAll(index);
            });
        } else {
            swal({title: "Field version can't empty", type: "warning"});
        }
    } else {
        swal({title: "You must simulate before save", type: "warning"});
    }
};
fp.selectKoefisien = function(event){
    fp.modeFormula("");
	$('#formula-editor').ecLookupDD("addLookup",{id:moment().format("hhmmDDYYYYx"), value: event, title: event, koefisien:false});
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
    fp.recordCondition([]);
    fp.addParameter();
    fp.addCondition();
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
        typesearch: "number",
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
        typesearch: "number",
    });
};
fp.addCondition = function(){
    fp.recordCondition.push({param1:'',param2:'',condition:'==',result1:'',result2:''});
    $('#condition1'+(fp.recordCondition().length-1)).ecLookupDD({
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
    $('#condition2'+(fp.recordCondition().length-1)).ecLookupDD({
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
    $('#result1'+(fp.recordCondition().length-1)).ecLookupDD({
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
    $('#result2'+(fp.recordCondition().length-1)).ecLookupDD({
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
}
fp.addKostantaFormula = function(){
    var resultFormula = "", boolsuccess = false;
    if (fp.modeFormula() == "SUM")
        resultFormula += "fn:SUM";
    else if (fp.modeFormula() == "AVG")
        resultFormula += "fn:AVG";
    else
        resultFormula += "fn:IF";

    if (fp.modeFormula() != "IF"){
        var objFormula1 = [], objFormula2 = [], index1 = 0, index2 = 0, boolyo = false, separatorcond = ",", textval1 = "", textval2 = "";
        resultFormula += "(";
        for (var i in fp.recordKoefisien()){
            objFormula1 = $('#koefisien1'+i).ecLookupDD("get");
            objFormula2 = $('#koefisien2'+i).ecLookupDD("get");
            textval1 = $('#koefisien1'+i).ecLookupDD("gettext");
            // textval2 = $('#koefisien2'+i).ecLookupDD("gettext");
            if (objFormula2.length > 0){
                index2 = parseInt(objFormula2[0].value.substring(0,objFormula2.length));
                if (index1 > index2){
                    alert("Value from must lower than to");
                    boolsuccess = false;
                    break;
                }
            }
            if (objFormula1.length == 0 && textval1 == ""){
                alert("Value from can't empty");
                boolsuccess = false;
                break;
            } else {
                if(i > 0)
                    separatorcond = ",";
                else
                    separatorcond = "";
                if (objFormula1.length > 0 && objFormula2.length>0){
                    index1 = parseInt(objFormula1[0].value.substring(0,objFormula1.length));
                    resultFormula += separatorcond+objFormula1[0].value+".."+objFormula2[0].value;
                } else if (objFormula1.length>0 && objFormula2.length==0) 
                    resultFormula += separatorcond+objFormula1[0].value;
                else if (objFormula1.length == 0 && textval1 != ""){
                    resultFormula += separatorcond+textval1;
                }
                // resultFormula += separatorcond+objFormula2[0].value;
                boolsuccess = true;
            }
        }
        resultFormula += ")";
    } else {
        var objFormula1 = [], objFormula2 = [], index1 = 0, index2 = 0, boolyo = true;
        boolsuccess = true;
        for (var i in fp.recordCondition()){
            objFormula1 = $('#condition1'+i).ecLookupDD("get");
            objFormula2 = $('#condition2'+i).ecLookupDD("get");
            objFormula3 = $('#result1'+i).ecLookupDD("get");
            objFormula4 = $('#result2'+i).ecLookupDD("get");
            if (objFormula1.length == 0){
                alert("Value To can't be empty");
                boolsuccess = false;
            }
            if (objFormula2.length == 0){
                alert("Value To can't be empty");
                boolsuccess = false;
            }
            if (objFormula3.length == 0){
                alert("Result To can't be empty");
                boolsuccess = false;
            }
            if (objFormula4.length == 0){
                alert("Result To can't be empty");
                boolsuccess = false;
            }
            if (boolsuccess){
                resultFormula += "("+objFormula1[0].value+fp.recordCondition()[i].condition+objFormula2[0].value+","+objFormula3[0].value+","+objFormula4[0].value+")";
                boolsuccess = true;
            }
        }
    }
    if (boolsuccess){
        $('#formula-editor').ecLookupDD("addLookup",{id:moment().format("hhmmDDYYYYx"), value:resultFormula, title: resultFormula , koefisien:true});
        fp.backFormulaEditor();
    }
}
fp.removeKoefisien = function(data){
    fp.recordKoefisien.remove(data)
};
fp.clearFormula = function(){
	$('#formula-editor').ecLookupDD("clear");
};
fp.getDataStatement = function(){
    app.ajaxPost("/statementversion/getstatementversion", {statementid: fp.tempStatementId(), mode: "new"}, function(res){
        if(!app.isFine(res)){
            return;
        }
        if (!res.data.data) {
            res.data.data = [];
        }
        for(var i in res.data.data.Element){
            res.data.data.Element[i] = $.extend({}, fp.templateFormula, res.data.data.Element[i] || {});
        }
        // fp.tempStatementId(res.data.data.statementid);
        ko.mapping.fromJS(res.data.data, fp.dataFormula);
        fp.getListSugest();
        fp.recordAllComment.push({
            index: 1,
            data: [],
        });
        fp.recordPostComment.push({
            index: 1,
            data: [],
        });
        app.mode("edit");
        fp.refreshHeightTable();
    });
};
fp.getListSugest = function(){
    app.ajaxPost("/statementversion/getsvbysid", {statementid: fp.tempStatementId()}, function(res){
        if(!app.isFine(res)){
            return;
        }
        if (!res.data) {
            res.data = [];
        }
        fp.recordSugest(res.data);
        $('#version1').ecLookupDD({
            dataSource:{
                data:fp.recordSugest(),
            },
            placeholder: "Search Version",
            inputType: "ddl",
            idField: "_id", 
            idText: "title", 
            displayFields: "title", 
            inputSearch: "title",
            boolClickSearch: true,
        });
    });
}
fp.removeColumnFormula = function(index){
    var aa = (parseInt(index)-2);
    fp.recordAllComment.remove( function (item) { return item.index == index; } ); 
    fp.recordPostComment.remove( function (item) { return item.index == index; } ); 
    var dataStatement = $.extend(true, {}, ko.mapping.toJS(fp.dataFormula));
    for (var i in dataStatement.Element){
        dataStatement.Element[i] = $.extend({}, dataStatement.Element[i], ko.mapping.toJS(fp.dataFormula.Element()[i]) || {});
        dataStatement.Element[i].ElementVersion.splice(aa,1);
    }
    ko.mapping.fromJS(dataStatement, fp.dataFormula);
    $(".table-formula-data>thead>tr.searchsv td[indexid="+index+"]").remove();
    fp.refreshHeightTable();
};
fp.selectSimulate = function(index){
    var indexcomment = 0;
    var recordPostComment = ko.utils.arrayFilter(fp.recordPostComment(), function (each, indexa) {
        indexcomment = indexa;
        return each.index == index;
    });
    if (index == 1){
        var objFormula = [], postParam = {
            mode: "simulate",
            _id : "",
            title : "",
            statementid : fp.tempStatementId(),
            element : []
        }, elementVer = [], mappingVer = {};
        objFormula = $('#version1').ecLookupDD("get");
        if (objFormula.length > 0){
            postParam = {
                mode: "simulate",
                _id : objFormula[0]._id,
                comment: recordPostComment[0].data,
                title : objFormula[0].title,
                statementid : objFormula[0].statementid,
                element : ko.mapping.toJS(fp.dataFormula.Element())
            };
        } else {
            postParam = {
                mode: "simulate",
                comment: recordPostComment[0].data,
                _id : "",
                title : $(".table-formula-data>thead td[indexid="+1+"]").find(".eclookup-txt>input").val(),
                statementid : fp.tempStatementId(),
                element : ko.mapping.toJS(fp.dataFormula.Element())
            };
        }
        app.ajaxPost("/statementversion/getstatementversion", postParam, function(res){
            if(!app.isFine(res)){
                return;
            }
            if (!res.data) {
                res.data = [];
            }
            for(var i in fp.recordPostComment()[indexcomment].data){
                fp.recordPostComment()[indexcomment].data[i]._id = res.data.comment[i]._id
            }
            fp.refreshSimulateByIndex(index,res.data.data);
        });
    } else {
        if (fp.dataFormula.Element()[0].ElementVersion().length > 0){
            elementVer = [];
            var aa = (parseInt(index)-2);
            objFormula = $('#version'+index).ecLookupDD("get");
            mappingVer = ko.mapping.toJS(fp.dataFormula);
            for(var a in mappingVer.Element){
                elementVer.push(mappingVer.Element[a].ElementVersion[aa]);
            };
            if (objFormula.length > 0){
                postParam = {
                    mode: "simulate",
                    comment: recordPostComment[0].data,
                    _id : objFormula[0]._id,
                    title : objFormula[0].title,
                    statementid : objFormula[0].statementid,
                    element: elementVer
                };
            } else {
                postParam = {
                    mode: "simulate",
                    comment: recordPostComment[0].data,
                    _id : "",
                    title : $(".table-formula-data>thead td[indexid="+index+"]").find(".eclookup-txt>input").val(),
                    statementid : fp.tempStatementId(),
                    element: elementVer
                };
            }
            app.ajaxPost("/statementversion/getstatementversion", postParam, function(res){
                if(!app.isFine(res)){
                    return;
                }
                if (!res.data) {
                    res.data = [];
                }
                console.log(indexcomment);
                for(var ad in fp.recordPostComment()[indexcomment].data){
                    fp.recordPostComment()[indexcomment].data[ad]._id = res.data.comment[ad]._id
                }
                fp.refreshSimulateByIndex(index,res.data.data);
            });
        }
    }
};
fp.addColumn = function(){
     app.ajaxPost("/statementversion/getstatementversion", {statementid: fp.tempStatementId(), mode: "new"}, function(res){
        if(!app.isFine(res)){
            return;
        }
        if (!res.data.data) {
            res.data.data = [];
        }
        var datayo = ko.mapping.toJS(fp.dataFormula);
        for(var i in res.data.data.Element){
            res.data.data.Element[i] = $.extend({}, fp.templateFormula, res.data.data.Element[i] || {});
        }
        var dataStatement = $.extend(true, {}, datayo), elemVer = {};
        for (var i in dataStatement.Element){
            elemVer = $.extend(true, {}, res.data.data.Element[i]);
            delete elemVer["ElementVersion"];
            dataStatement.Element[i].ElementVersion.push(elemVer);
        }
        ko.mapping.fromJS(dataStatement, fp.dataFormula);
        var index = parseInt($(".table-formula-data>thead>tr.searchsv input.searchversion:last").attr("indexcolumn")) + 1;
        // $(".table-formula-data>thead>tr.searchsv").append("<td indexid='"+index+"'><div class='searchversion'><input class='searchversion' id='version"+index+"' indexcolumn='"+index+"' /></div><div class='searchversion'><ul class='icon-tableheader'><li onClick='fp.selectSimulate("+index+")' data-toggle='tooltip' data-placement='top' title='Simulate'><span class='glyphicon glyphicon-refresh'></span></li><li onClick='fp.saveStatementNew("+index+")' data-toggle='tooltip' data-placement='top' title='Save'><span class='glyphicon glyphicon-floppy-disk'></span></li> <li data-toggle='tooltip' data-placement='top' title='Excel'><span class='fa fa-file-excel-o'></span></li> <li data-toggle='tooltip' data-placement='top' title='Pdf'><span class='fa fa-file-pdf-o'></span></li> <li onClick='fp.removeColumnFormula("+index+")' data-toggle='tooltip' data-placement='top' title='Remove'><span class='glyphicon glyphicon-remove'></span></li></ul></div></td>");
        $(".table-formula-data>thead>tr.searchsv").append("<td indexid='"+index+"'><div class='searchversion2'><ul class='icon-tableheader'><li onClick='fp.selectSimulate("+index+")' data-toggle='tooltip' data-placement='top' title='Simulate'><span class='glyphicon glyphicon-refresh'></span></li><li onClick='fp.saveStatementNew("+index+")' data-toggle='tooltip' data-placement='top' title='Save'><span class='glyphicon glyphicon-floppy-disk'></span></li> <li data-toggle='tooltip' data-placement='top' title='Excel'><span class='fa fa-file-excel-o'></span></li> <li data-toggle='tooltip' data-placement='top' title='Pdf'><span class='fa fa-file-pdf-o'></span></li> <li onClick='fp.removeColumnFormula("+index+")' data-toggle='tooltip' data-placement='top' title='Remove'><span class='glyphicon glyphicon-remove'></span></li></ul></div><div class='searchversion'><input class='searchversion' id='version"+index+"' indexcolumn='"+index+"' /></div><div class='searchversion headerright'><input id='rundate"+index+"'/></div></td>");
        $('[data-toggle="tooltip"]').tooltip()
        $('#version'+index).ecLookupDD({
            dataSource:{
                data:fp.recordSugest(),
            },
            placeholder: "Search Version",
            inputType: "ddl",
            idField: "_id", 
            idText: "title", 
            displayFields: "title", 
            inputSearch: "title",
            boolClickSearch: true,
        });
        $('#rundate'+index).kendoDatePicker({
            format: "dd MMM yyyy",
        });
        fp.recordAllComment.push({
            index: index,
            data: [],
        });
        fp.recordPostComment.push({
            index: index,
            data: [],
        });
        fp.refreshHeightTable();
    });
};
fp.refreshHeightTable = function(){
    var height1 = 0, height2 = 0, heightSelect = 0, plusheight = 6;
    if (fp.boolHeightTable() == 1)
        plusheight = 0;
    if (fp.dataFormula.Element()[0].ElementVersion().length>0)
        plusheight = 0;
    $(".table-formula-data").css("width",(fp.dataFormula.Element()[0].ElementVersion().length+1)*400);
    for(var i in fp.dataFormula.Element()){
        height1 = $(".table-formula-head tr").eq(i).height();
        height2 = $(".table-formula-data tr").eq(i).height();
        if(height1>height2)
            heightSelect = height1;
        else
            heightSelect = height2;
        if (i == 0 && plusheight != 0)
            plusheight = 6;
        else
            plusheight = 0;
        $(".table-formula-head tr").eq(i).css('height',heightSelect+plusheight);
        $(".table-formula-data tr").eq(i).css('height',heightSelect+plusheight);
    }
    fp.boolHeightTable(1);
};
// fp.showComment = function(index,sveid,formulatxt,title1,title2){
//     fp.formulaTitle(formulatxt);
//     fp.modeFormula("");
//     if(title2 != "")
//         fp.titlePopUp(title2);
//     else if (title1 != "")
//         fp.titlePopUp(title1);
//     else
//         fp.titlePopUp("Comment");
//     $("#comment-popup").modal("show");
//     app.ajaxPost("/statementversion/getcomment", {sveid: sveid}, function(res){
//         if(!app.isFine(res)){
//             return;
//         }
//         if (!res.data) {
//             res.data = [];
//         }
//         fp.recordComment(res.data);
//         fp.configComment.sveid(sveid);
//     });
// };
fp.showComment = function(index, indexColoumn, idcomment,title1,title2, formulatxt){
    fp.selectColumn({index:index,indexcol:indexColoumn});
    var commenttemp = [], rescomment = [];
    for (var key in idcomment){
        rescomment = ko.utils.arrayFilter(fp.recordAllComment()[(indexColoumn-1)].data, function (each) {
            return each._id == idcomment[key];
        });
        if (rescomment.length > 0){
            commenttemp.push($.extend({}, fp.templateComment, rescomment[0] || {}));
        }
    }
    var commentpush = ko.utils.arrayFilter(fp.recordAllComment()[(indexColoumn-1)].data, function (each) {
        return each._id == idcomment[key];
    });
    for (var i in fp.recordPostComment()[(indexColoumn-1)].data){
        if (fp.recordPostComment()[(indexColoumn-1)].data[i].index == (index+1))
            commenttemp.push($.extend({}, fp.templateComment, fp.recordPostComment()[(indexColoumn-1)].data[i] || {}));
    }
    fp.recordComment(commenttemp);
    fp.formulaTitle(formulatxt);
    fp.modeFormula("");
    if(title2 != "")
        fp.titlePopUp(title2);
    else if (title1 != "")
        fp.titlePopUp(title1);
    else
        fp.titlePopUp("Comment");
    $("#comment-popup").modal("show");
};
fp.saveComment = function(){
    var dataPost = ko.mapping.toJS(fp.configComment);
    if (dataPost._id == ''){
        fp.recordComment.push({
            _id: "", 
            name: dataPost.name,  
            text: dataPost.text,
            type: "add",
            index: (fp.selectColumn().index+1),
            idtemp: (fp.selectColumn().index+1),
        });
    } else {
        for (var i in fp.recordComment()){
            if (dataPost._id == fp.recordComment()[i]._id){
                fp.recordComment()[i] = {
                    _id: dataPost._id, 
                    name: dataPost.name,  
                    text: dataPost.text,
                    type: "update",
                    index: (fp.selectColumn().index+1),
                    idtemp: '',
                }
            }
        }
    }
    var rescomment = ko.utils.arrayFilter(fp.recordComment(), function (each) {
        return each.type != "old";
    }), indexselect = 0;
    var tempComment = ko.utils.arrayFilter(fp.recordPostComment(), function (each, index) {
        indexselect = index;
        return each.index == fp.selectColumn().indexcol;
    });
    if (tempComment.length > 0)
        fp.recordPostComment()[indexselect].data = rescomment;
    
    fp.clearComment();
};
fp.updateDataComment = function(status,data){
    
};
fp.clearComment = function(){
    ko.mapping.fromJS(fp.templateComment ,fp.configComment);
};
fp.removeComment = function(id){
    for (var i in fp.recordComment()){
        if (id == fp.recordComment()[i]._id){
            fp.recordComment()[i].type = "delete";
            fp.recordComment()[i].index = fp.selectColumn().index;
        }
    }
    // fp.recordPostComment(fp.recordComment());
};
fp.selectComment = function(data){
    ko.mapping.fromJS(data ,fp.configComment);
};
// fp.saveComment = function(){
//     var dataPost = ko.mapping.toJS(fp.configComment);
//     app.ajaxPost("/statementversion/savecomment", dataPost, function(res){
//         if(!app.isFine(res)){
//             return;
//         }
//         if (!res.data) {
//             res.data = [];
//         }
//         fp.recordComment.push({
//             _id: dataPost._id,
//             name: dataPost.name,
//             sveid: dataPost.sveid,
//             text: dataPost.text,
//             time: "",
//         })
//         ko.mapping.fromJS(fp.templateComment,fp.configComment);
//     });
// };
fp.hoverHeadFormula = function(data, event){
    var $el = $(event.target).closest("tr.rightfreeze");
    $el.addClass("selected-tableformula");
    $(".table-formula-data>tbody tr.datafor").eq($el.index()).addClass("selected-tableformula");
};
fp.blurHeadFormula = function(data, event){
    var $el = $(event.target).closest("tr.rightfreeze");
    $el.removeClass("selected-tableformula");
    $(".table-formula-data>tbody tr.datafor").eq($el.index()).removeClass("selected-tableformula");
};
fp.hoverDataFormula = function(data, event){
    var $el = $(event.target).closest("tr.datafor");
    $el.addClass("selected-tableformula");
    $(".table-formula-head>tbody tr.rightfreeze").eq($el.index()).addClass("selected-tableformula");

    var $el2 = $(event.target).closest("td");
    $el2.find(".nominal-txt").show();
    $el2.find(".nominal-label").hide();
};
fp.blurDataFormula = function(data, event){
    var $el = $(event.target).closest("tr.datafor");
    $el.removeClass("selected-tableformula");
    $(".table-formula-head>tbody tr.rightfreeze").eq($el.index()).removeClass("selected-tableformula");

    var $el2 = $(event.target).closest("td");
    $el2.find(".nominal-txt").hide();
    $el2.find(".nominal-label").show();
};

ko.bindingHandlers.tooltip = {
    init: function(element, valueAccessor) {
        var local = ko.utils.unwrapObservable(valueAccessor()),
            options = {};

        ko.utils.extend(options, ko.bindingHandlers.tooltip.options);
        ko.utils.extend(options, local);

        $(element).tooltip(options);

        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            $(element).tooltip("destroy");
        });
    },
    options: {
        placement: "right",
        container: 'body'
    }
};
ko.bindingHandlers.numeric = {
    init: function (element, valueAccessor) {
        $(element).on("keydown", function (event) {
            if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
                (event.keyCode == 65 && event.ctrlKey === true) ||
                (event.keyCode == 188 || event.keyCode == 190 || event.keyCode == 110) ||
                (event.keyCode >= 35 && event.keyCode <= 39)) {
                return;
            }
            else {
                if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                    event.preventDefault();
                }
            }
        });
    }
};

$(function (){
    kendo.culture("de-DE");
    // fp.getDataStatement();
    $("#kostanta").bind("keyup", function(e) {
        if (e.keyCode == 13){
            $('#formula-editor').ecLookupDD("addLookup",{id: moment().format("hhmmDDYYYYx"), value: fp.konstanta().toString(), title: fp.konstanta().toString(), koefisien:true});
            fp.konstanta(0);
        }
    });
    $(".table-formula-data").bind("keyup",".efs-number", function(e) {
        var index = $(e.target).closest("td").attr("indexid");
        fp.changeValueVariable(index, true);
    });
	$('#formula-editor').ecLookupDD({
		dataSource:{
			data:[],
		}, 
		placeholder: "Area Formula",
		areaDisable: true,
		inputType: 'multiple', 
		inputSearch: "value", 
		idField: "id", 
		idText: "title", 
		displayFields: "title", 
        hoverRemove: true,
        displayTemplate: function(){
            return "<span>#*title#</span>";
        },
	});
    $("#rundate1").kendoDatePicker({
        format: "dd MMM yyyy",
    });
});