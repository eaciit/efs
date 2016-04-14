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
fp.recordCondition = ko.observableArray([]);
fp.recordSugest = ko.observableArray([]);

fp.saveImage = function(){
    var idstatement = "";
    if (fp.selectColumn().indexcol == 1){
        objFormula = $('#version1').ecLookupDD("get");
        if (objFormula.length > 0){
            idstatement = objFormula[0]._id;
        }
    } else {
        objFormula = $('#version'+fp.selectColumn().indexcol).ecLookupDD("get");
        if (objFormula.length > 0){
            idstatement = objFormula[0]._id;
        }
    }
    if (idstatement != ""){
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

        app.ajaxPost("/statement/saveimagesv", formData, function (res) {
            if (!app.isFine(res)) {
                return;
            }
            // console.log(res.data)
        });
    }
};
fp.selectListAkun = function(index, data){
    if (fp.modeFormula() == ""){
    	$('#formula-editor').ecLookupDD("addLookup",{id:'@'+index, value: "@"+(index+1), koefisien:true});
    } else if (fp.modeFormula() == "SUM" || fp.modeFormula() == "AVG") {
        var $areaselect = $("#tablekoefisien>tbody .eclookup-selected").parent().find(".areakoefisien"), idselect = $areaselect.attr("id");
        if($areaselect.length>0)
            $('#'+idselect).ecLookupDD("addLookup",{id:'@'+index, value: "@"+(index+1), koefisien:true});
    } else if (fp.modeFormula() == "IF"){
        var $areaselect = $("#tableif>tbody .eclookup-selected").parent().find(".areakoefisien"), idselect = $areaselect.attr("id");
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
    console.log("data",ko.mapping.toJS(data));
    // if (data.Type == 50){
        viewModel.fileData().clear();
        fp.modeFormula("");
    	$("#formula-popup").modal("show");
        fp.selectColumn({index:index,indexcol:indexColoumn});
        var datatojs = ko.mapping.toJS(data);
        viewModel.fileData().dataURL("/image/sv/"+datatojs.ImageName);
        for(var i in datatojs.Formula){
            if (datatojs.Formula[i] == "+" || datatojs.Formula[i] == "-" || datatojs.Formula[i] == "*" || datatojs.Formula[i] == "/")
                $('#formula-editor').ecLookupDD("addLookup",{id:datatojs.Formula[i], value: datatojs.Formula[i], koefisien:false});
            else
                $('#formula-editor').ecLookupDD("addLookup",{id:datatojs.Formula[i], value: datatojs.Formula[i], koefisien:true});
        }
    // }
};
fp.saveFormulaEditor = function(){
    var objFormula = $('#formula-editor').ecLookupDD("get"), resultFormula = "", resultFormulaArr = [];
    for (var i in objFormula){
        resultFormula += objFormula[i].value;
        resultFormulaArr.push(objFormula[i].value);
    }
    if (fp.selectColumn().indexcol == 1){
        fp.dataFormula.Element()[fp.selectColumn().index].Formula(resultFormulaArr);
    } else {
        // console.log(fp.selectColumn().index);
        // console.log(fp.selectColumn().indexcol-2);
        // console.log(fp.dataFormula.Element()[fp.selectColumn().index].ElementVersion()[(fp.selectColumn().indexcol-2)].Formula());
        fp.dataFormula.Element()[fp.selectColumn().index].ElementVersion()[(fp.selectColumn().indexcol-2)].Formula(resultFormulaArr);
    }
    $('#formula-editor').ecLookupDD("clear");
    fp.backFormulaEditor();
    $("#formula-popup").modal("hide");
};
fp.refreshAll = function(){
    var objFormula = [], postParam = {
        _id : "",
        statementid : "V7v6vdVLkDYavp7InulgLLJfY7cL9NcS",
    };
    objFormula = $('#version1').ecLookupDD("get");
    if (objFormula.length > 0){
        postParam = {
            _id : objFormula[0]._id,
            statementid : objFormula[0].statementid,
            mode: "find"
        };
        app.ajaxPost("/statement/getstatementversion", postParam, function(res){
            if(!app.isFine(res)){
                return;
            }
            if (!res.data) {
                res.data = [];
            }
            var dataStatement = $.extend(true, {}, fp.templatestatement,ko.mapping.toJS(fp.dataFormula)), elemVer = {};
            for(var i in res.data.Element){
                dataStatement.Element[i] = $.extend({}, dataStatement.Element[i], res.data.Element[i] || {});
            }
            ko.mapping.fromJS(dataStatement, fp.dataFormula);
        });
    }
    if (fp.dataFormula.Element()[0].ElementVersion().length > 0){
        for (var i in fp.dataFormula.Element()[0].ElementVersion()){
            var aa = (parseInt(i)+2);
            objFormula = $('#version'+aa).ecLookupDD("get");
            if (objFormula.length > 0){
                postParam = {
                    _id : objFormula[0]._id,
                    statementid : objFormula[0].statementid,
                    mode: "find"
                };
                app.ajaxPost("/statement/getstatementversion", postParam, function(res){
                    if(!app.isFine(res)){
                        return;
                    }
                    if (!res.data) {
                        res.data = [];
                    }
                    var dataStatement = $.extend(true, {}, ko.mapping.toJS(fp.dataFormula)), elemVer = {}, indexVer = i+2, indexyo = 0;
                    for (var i in dataStatement.Element){
                        dataStatement.Element[i] = $.extend({}, dataStatement.Element[i], ko.mapping.toJS(fp.dataFormula.Element()[i]) || {});
                        indexyo = parseInt(indexVer) - 2;
                        dataStatement.Element[i].ElementVersion[indexyo] = res.data.Element[i];
                    }
                    ko.mapping.fromJS(dataStatement, fp.dataFormula);
                });
            }
        }
    }
}
fp.refreshByIndex = function(index,data){
    if (index == 1){
        // var objFormula = [], postParam = {
        //     _id : "",
        //     statementid : "V7v6vdVLkDYavp7InulgLLJfY7cL9NcS",
        // };
        // objFormula = $('#version1').ecLookupDD("get");
        // if (objFormula.length > 0){
        //     postParam = {
        //         _id : objFormula[0]._id,
        //         statementid : objFormula[0].statementid,
        //         mode: "find"
        //     };
        //     app.ajaxPost("/statement/getstatementversion", postParam, function(res){
        //         if(!app.isFine(res)){
        //             return;
        //         }
        //         if (!res.data) {
        //             res.data = [];
        //         }
        //         var dataStatement = $.extend(true, {}, fp.templatestatement,ko.mapping.toJS(fp.dataFormula)), elemVer = {};
        //         for(var i in res.data.Element){
        //             dataStatement.Element[i] = $.extend({}, dataStatement.Element[i], res.data.Element[i] || {});
        //         }
        //         ko.mapping.fromJS(dataStatement, fp.dataFormula);
        //     });
        // }
        var dataStatement = $.extend(true, {}, fp.templatestatement,ko.mapping.toJS(fp.dataFormula)), elemVer = {};
        for(var i in data.Element){
            dataStatement.Element[i] = $.extend({}, dataStatement.Element[i], data.Element[i] || {});
        }
        ko.mapping.fromJS(dataStatement, fp.dataFormula);
    } else {
        if (fp.dataFormula.Element()[0].ElementVersion().length > 0){
            var aa = (parseInt(index)-2);
            objFormula = $('#version'+aa).ecLookupDD("get");
            // if (objFormula.length > 0){
            //     postParam = {
            //         _id : objFormula[0]._id,
            //         statementid : objFormula[0].statementid,
            //         mode: "find"
            //     };
            //     app.ajaxPost("/statement/getstatementversion", postParam, function(res){
            //         if(!app.isFine(res)){
            //             return;
            //         }
            //         if (!res.data) {
            //             res.data = [];
            //         }
            //         var dataStatement = $.extend(true, {}, ko.mapping.toJS(fp.dataFormula)), elemVer = {}, indexVer = i+2, indexyo = 0;
            //         for (var i in dataStatement.Element){
            //             dataStatement.Element[i] = $.extend({}, dataStatement.Element[i], ko.mapping.toJS(fp.dataFormula.Element()[i]) || {});
            //             indexyo = parseInt(indexVer) - 2;
            //             dataStatement.Element[i].ElementVersion[indexyo] = res.data.Element[i];
            //         }
            //         ko.mapping.fromJS(dataStatement, fp.dataFormula);
            //     });
            // } else {
                var dataStatement = $.extend(true, {}, ko.mapping.toJS(fp.dataFormula)), elemVer = {}, indexVer = i+2, indexyo = 0;
                for (var i in dataStatement.Element){
                    dataStatement.Element[i] = $.extend({}, dataStatement.Element[i], ko.mapping.toJS(fp.dataFormula.Element()[i]) || {});
                    indexyo = parseInt(indexVer) - 2;
                    dataStatement.Element[i].ElementVersion[indexyo] = data.Element[i];
                }
                ko.mapping.fromJS(dataStatement, fp.dataFormula);
            // }
        }
    }
}
fp.saveStatement = function(){
    var objFormula = [], postParam = {
        _id : "",
        title : "",
        statementid : "V7v6vdVLkDYavp7InulgLLJfY7cL9NcS",
        element : []
    }, elementVer = [], mappingVer = {};
    objFormula = $('#version1').ecLookupDD("get");
    if (objFormula.length > 0){
        postParam = {
            _id : objFormula[0]._id,
            title : objFormula[0].title,
            statementid : objFormula[0].statementid,
            element : ko.mapping.toJS(fp.dataFormula.Element())
        };
    } else {
        postParam = {
            _id : "",
            title : $("#tableFormula>thead td[indexid="+1+"]").find(".eclookup-txt>input").val(),
            statementid : "V7v6vdVLkDYavp7InulgLLJfY7cL9NcS",
            element : ko.mapping.toJS(fp.dataFormula.Element())
        };
    }
    app.ajaxPost("/statement/savestatementversion", postParam, function(res){
        if(!app.isFine(res)){
            return;
        }
        if (!res.data) {
            res.data = [];
        }
        fp.refreshAll();
    });
    if (fp.dataFormula.Element()[0].ElementVersion().length > 0){
        for (var i in fp.dataFormula.Element()[0].ElementVersion()){
            elementVer = [];
            var aa = (parseInt(i)+2);
            objFormula = $('#version'+aa).ecLookupDD("get");
            mappingVer = ko.mapping.toJS(fp.dataFormula);
            for(var a in mappingVer.Element){
                elementVer.push(mappingVer.Element[a].ElementVersion[i]);
            };
            if (objFormula.length > 0){
                postParam = {
                    _id : objFormula[0]._id,
                    title : objFormula[0].title,
                    statementid : objFormula[0].statementid,
                    element: elementVer
                };
            } else {
                postParam = {
                    _id : "",
                    title : $("#tableFormula>thead td[indexid="+(i+2)+"]").find(".eclookup-txt>input").val(),
                    statementid : "V7v6vdVLkDYavp7InulgLLJfY7cL9NcS",
                    element: elementVer
                };
            }
            app.ajaxPost("/statement/savestatementversion", postParam, function(res){
                if(!app.isFine(res)){
                    return;
                }
                if (!res.data) {
                    res.data = [];
                }
                fp.refreshAll();
            });
        }
    }
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
        var objFormula1 = [], objFormula2 = [], index1 = 0, index2 = 0, boolyo = false;
        for (var i in fp.recordKoefisien()){
            objFormula1 = $('#koefisien1'+i).ecLookupDD("get");
            objFormula2 = $('#koefisien2'+i).ecLookupDD("get");
            if (objFormula1.length > 0){
                index1 = parseInt(objFormula1[0].value.substring(0,objFormula1.length));
            } else {
                alert("Value From can't be empty");
            }
            if (objFormula2.length > 0){
                index2 = parseInt(objFormula2[0].value.substring(0,objFormula2.length));
            } else {
                alert("Value To can't be empty");
            }
            if (index1 > index2){
                alert("Value from must lower than to");
            } else {
                resultFormula += "("+objFormula1[0].value+".."+objFormula2[0].value+")";
                boolsuccess = true;
            }
        }
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
                resultFormula += "("+objFormula1[0].value+fp.recordCondition()[i].condition+objFormula2[0].value+","+objFormula3[0].value+","+objFormula4[0].value;
                boolsuccess = true;
            }
        }
    }
    // $('#formula-editor').ecLookupDD("addLookup",{id:, value: , koefisien:true});
    if (boolsuccess){
        $('#formula-editor').ecLookupDD("addLookup",{id:resultFormula, value:resultFormula , koefisien:true});
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
    app.ajaxPost("/statement/getstatementversion", {statementid: "bid1EWFRZwL-at1uyFvzJYUjPu3yuh3j", mode: "new"}, function(res){
        if(!app.isFine(res)){
            return;
        }
        if (!res.data) {
            res.data = [];
        }
        for(var i in res.data.Element){
            res.data.Element[i] = $.extend({}, fp.templateFormula, res.data.Element[i] || {});
        }
        ko.mapping.fromJS(res.data, fp.dataFormula);
        fp.getListSugest();
    });
    // for(var i in dataexample.Element){
    //     dataexample.Element[i] = $.extend({}, fp.templateFormula, dataexample.Element[i] || {});
    // }
    // ko.mapping.fromJS(dataexample, fp.dataFormula);
};
fp.getListSugest = function(){
    app.ajaxPost("/statement/getsvbysid", {statementid: "bid1EWFRZwL-at1uyFvzJYUjPu3yuh3j"}, function(res){
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
        });
    });
}
fp.removeColumnFormula = function(index){
    var aa = (parseInt(index)-2);

};
fp.selectSimulate = function(index){
    if (index == 1){
        var objFormula = [], postParam = {
            mode: "simulate",
            _id : "",
            title : "",
            statementid : "bid1EWFRZwL-at1uyFvzJYUjPu3yuh3j",
            element : []
        }, elementVer = [], mappingVer = {};
        objFormula = $('#version1').ecLookupDD("get");
        if (objFormula.length > 0){
            postParam = {
                mode: "simulate",
                _id : objFormula[0]._id,
                title : objFormula[0].title,
                statementid : objFormula[0].statementid,
                element : ko.mapping.toJS(fp.dataFormula.Element())
            };
        } else {
            postParam = {
                mode: "simulate",
                _id : "",
                title : $("#tableFormula>thead td[indexid="+1+"]").find(".eclookup-txt>input").val(),
                statementid : "bid1EWFRZwL-at1uyFvzJYUjPu3yuh3j",
                element : ko.mapping.toJS(fp.dataFormula.Element())
            };
        }
        app.ajaxPost("/statement/getstatementversion", postParam, function(res){
            if(!app.isFine(res)){
                return;
            }
            if (!res.data) {
                res.data = [];
            }
            fp.refreshByIndex(index);
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
                    _id : objFormula[0]._id,
                    title : objFormula[0].title,
                    statementid : objFormula[0].statementid,
                    element: elementVer
                };
            } else {
                postParam = {
                    mode: "simulate",
                    _id : "",
                    title : $("#tableFormula>thead td[indexid="+index+"]").find(".eclookup-txt>input").val(),
                    statementid : "bid1EWFRZwL-at1uyFvzJYUjPu3yuh3j",
                    element: elementVer
                };
            }
            app.ajaxPost("/statement/getstatementversion", postParam, function(res){
                if(!app.isFine(res)){
                    return;
                }
                if (!res.data) {
                    res.data = [];
                }
                fp.refreshByIndex(index);
            });
        }
    }
};
fp.addColumn = function(){
    var dataStatement = $.extend(true, {}, ko.mapping.toJS(fp.dataFormula)), elemVer = {};
    for (var i in dataStatement.Element){
        elemVer = $.extend(true, {}, fp.templateFormula);
        delete elemVer["ElementVersion"];
        dataStatement.Element[i].ElementVersion.push(elemVer);
    }
    ko.mapping.fromJS(dataStatement, fp.dataFormula);
    var index = $("#tableFormula>thead>tr.searchsv input.searchversion").length + 1;
    $("#tableFormula>thead>tr.searchsv").append("<td indexid='"+index+"'><div class='searchversion'><button class=\"btn btn-sm btn-success btn-simulate\" onClick=\"fp.selectSimulate("+index+")\">Simulate</button></div><div class='searchversion'><input class='searchversion' id='version"+index+"' indexcolumn='"+index+"' /></div><div class='row-remove'><span class='glyphicon glyphicon-remove' onClick='fp.removeColumnFormula("+index+")'></span></td>");
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
});