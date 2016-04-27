app.section('efsdesigner');
viewModel.EfsDesigner = {}; var ed = viewModel.EfsDesigner;

ed.templateStatement = {
	Index: 0,
	Title1: "",
	Title2:"",
	Type:0,
	DataValue: [],
    DataValueText: "",
    DataValueTemp: [],
	Show: true,
	Showformula: true,
	Bold: false,
	NegateValue: true,
	NegateDisplay: true,
	Column: 1,
	Formula: [],
	FormulaText: [],
	TransactionReadType: 0,
	TimeReadType: 0
};
ed.templateEfs = {
	_id: "",
	title: "",
	enable: true,
	elements: [],
};
ed.templateFormula = {
    StatementElement: {
    	Index:0,
        Title1:"",
        Title2:"",
        Type:1,
        DataValue:[],
        DataValueText:"",
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
};
ed.dataType = ko.observableArray([
	{ key: 0, text: "None" },
	{ key: 1, text: "CoA" },
	{ key: 2, text: "Group" },
	{ key: 3, text: "From To" },
	{ key: 10, text: "Parm Number" },
	{ key: 11, text: "Parm Date" },
	{ key: 12, text: "Parm String" },
	{ key: 50, text: "Formula" },
]);
ed.dataColumn = ko.observableArray([
	{ key: 0, text: "All" },
	{ key: 1, text: "1" },
	{ key: 2, text: "2" },
]);
ed.dataTransReadType = ko.observableArray([
	{ key: 0, text: "Read Opening" },
	{ key: 1, text: "Read Balance" },
	{ key: 2, text: "Read In" },
	{ key: 3, text: "Read Out" },
	{ key: 4, text: "Read Movement" },
]);
ed.dataTimeReadType = ko.observableArray([
	{ key: 0, text: "mtd" },
	{ key: 1, text: "qtd" },
	{ key: 2, text: "ytd" },
	{ key: 3, text: "Last Month" },
	{ key: 4, text: "Last Quarter" },
	{ key: 5, text: "Last Year" },
]);
ed.dataDataValue = ko.observableArray([]);
ed.templatestatement = {
    _id: "",
    Title: "",
    StatementID: "",
    Element: [],
};

ed.efsData = ko.observableArray([]);
ed.configFormula = ko.mapping.fromJS(ed.templateFormula);
ed.configEfs = ko.mapping.fromJS(ed.templateEfs);
ed.searchField = ko.observable('');
ed.tempCheckIdEfs = ko.observableArray([]);
ed.tempCheckIdStatement = ko.observableArray([]);
ed.tempStatementId = ko.observable("bid1EWFRZwL-at1uyFvzJYUjPu3yuh3j");
ed.dataFormula = ko.mapping.fromJS(ed.templatestatement);
ed.lastParam = ko.observable("");
ed.modeFormula = ko.observable("");
ed.titlePopUp = ko.observable("");
ed.selectColumn = ko.observable({});
ed.recordCondition = ko.observableArray([]);
ed.recordKoefisien = ko.observableArray([]);
ed.konstanta = ko.observable(0);
ed.efsColumns = ko.observableArray([
	{headerTemplate: "<center><input type='checkbox' class='efscheckall' onclick=\"ed.checkDeleteData(this, 'efsall')\"/></center>", width: 50, attributes: { style: "text-align: center;" }, template: function (d) {
		return [
			"<input type='checkbox' class='efscheck' idcheck='"+d._id+"' onclick=\"ed.checkDeleteData(this, 'efs')\" />"
		].join(" ");
	}},
	{ field: "_id", title: "ID" },
	{ field: "title", title: "Title" },
]);
ed.statementColumns = ko.observableArray([
	{ width: 15, editable: false, headerTemplate: "<center><input type='checkbox' class='efscheckall' onclick=\"ed.checkDeleteData(this, 'statementall')\"/></center>", attributes: { style: "text-align: center;" }, template: function (d) {
		return [
			"<input type='checkbox' class='statementcheck' idcheck='"+d.Index+"' onclick=\"ed.checkDeleteData(this, 'statement')\">"
		].join(" ");
	}},
	{ width: 15, field: "Index", title: "No", editable: false },
	{ width: 60, field: "Title1", title: "Title 1", editable: true},
	{ width: 60, field: "Title2", title: "Title 2", editable: true},
	{ width: 35, field: "Type", editable: true, title: "Type", template: "#= ed.dataDDOption(Type, 'Type') #",
		editor: function(container, options) {
            var input = $('<input id="datatypeId" name="datatype" data-bind="value:' + options.field + '">');
            input.appendTo(container);
            input.kendoDropDownList({
                dataTextField: "text",
                dataValueField: "key",
                dataSource: ed.dataType(),
                select: function(e){ var dataItem = this.dataItem(e.item), Index = container.parent().index(); ed.selectDDStatement(Index, dataItem, "Type") },
            }).appendTo(container);
        }},
    // { width: 40, field: "DataValueText", title: "Data Value", editable: true},
    { width: 40, field: "DataValueText", title: "Data Value", values: ed.dataDataValue(), editable: true, template: "#= ed.dataDDOption(DataValueTemp, 'DataValue') #", 
        editor: function(container, options){
            var input = $('<input id="datavalueId" name="datavaluecolumn" data-bind="value:DataValueTemp">');
            input.appendTo(container);
            input.kendoMultiSelect({
                animation: false,
                dataTextField: "text",
                dataValueField: "value",
                dataSource: ed.dataDataValue(),
                dataBound: ed.filtermultiselect,
                select: ed.onSelectmulti,
            }).appendTo(container);
        }},
    { width: 20, title: "Show", editable: true, template: "<center><input type='checkbox' #=Show ? \"checked='checked'\" : ''# class='showfield' data-field='Show' onchange='ed.changeCheckboxOnGrid(this)' /></center>", headerTemplate: "<center><input type='checkbox' id='selectallshowfield' onclick=\"ed.checkAll(this, 'ShowField')\" />&nbsp;&nbsp;Show</center>"},
    { width: 35, title: "Show Formula", editable: true, template: "<center><input type='checkbox' #=Showformula ? \"checked='checked'\" : ''# class='showfield' data-field='ShowFormula' onchange='ed.changeCheckboxOnGrid(this)' /></center>", headerTemplate: "<center><input type='checkbox' id='selectallshowformula' onclick=\"ed.checkAll(this, 'ShowFormula')\" />&nbsp;&nbsp;Show Formula</center>"},
    { width: 20, title: "Bold", editable: true, template: "<center><input type='checkbox' #=Bold ? \"checked='checked'\" : ''# class='bold' data-field='Bold' onchange='ed.changeCheckboxOnGrid(this)' /></center>", headerTemplate: "<center><input type='checkbox' id='selectallshowformula' onclick=\"ed.checkAll(this, 'Bold')\" />&nbsp;&nbsp;Bold</center>"},
    { width: 20, field: "Column", editable: true, title: "Column", template: "#= ed.dataDDOption(Column, 'Column') #",
		editor: function(container, options) {
            var input = $('<input id="datacolumnId" name="datacolumn" data-bind="value:' + options.field + '">');
            input.appendTo(container);
            input.kendoDropDownList({
                dataTextField: "text",
                dataValueField: "key",
                dataSource: ed.dataColumn()
            }).appendTo(container);
        }},
    { width: 40, field: "TransactionReadType", title: "Trans.Read Type", editable: true, template: "#= ed.dataDDOption(TransactionReadType, 'TransactionReadType') #",
		editor: function(container, options) {
            var input = $('<input id="dataTransReadId" name="datatransread" data-bind="value:' + options.field + '">');
            input.appendTo(container);
            input.kendoDropDownList({
                dataTextField: "text",
                dataValueField: "key",
                dataSource: ed.dataTransReadType()
            }).appendTo(container);
        }},
    { width: 40, field: "TimeReadType", title: "Time Read Type", editable: true, template: "#= ed.dataDDOption(TimeReadType, 'TimeReadType') #",
		editor: function(container, options) {
            var input = $('<input id="dataTimeReadId" name="datatimeread" data-bind="value:' + options.field + '">');
            input.appendTo(container);
            input.kendoDropDownList({
                dataTextField: "text",
                dataValueField: "key",
                dataSource: ed.dataTimeReadType(),
            }).appendTo(container);
        }},
    { title: "Formula", width: 20, attributes: { style: "text-align: center; cursor: pointer;"}, template: function (d) {
        if (d.Type == 50){
    		return [
    			"<button class='btn btn-sm btn-default btn-text-success tooltipster btn-formula' indexstatement='"+d.Index+"' title='"+d.FormulaText.join('')+"'><span class='fa fa-calculator'></span></button>",
    			// "<div onclick='ed.showFormulaEditor("+d.Index+", "+d+")'>"+d.FormulaText.join('')+"</div>",
    		].join(" ");
        } else {
            return "";
        }
	} },
]);
var newItem = "";
ed.filtermultiselect = function(e){
    if ((newItem || this._prev) && newItem !== this._prev) {
        var ds = this.dataSource,
            datas = ds.data(),
            lastItem = datas[datas.length - 1];

        newItem = this._prev;

        if (datas.length > 0){
            if (/\(Add New\)$/i.test(lastItem.text)) {
                ds.remove(lastItem);
                ed.dataDataValue.remove(function (item) { return item.text == lastItem.text; });
            }
        }
        var newEntryFound = _.findWhere(datas, { text: newItem }) != null;
        if (newItem.length > 0 && !newEntryFound) {
            ds.add({ text: newItem + " (Add New)" , value: newItem});
            ed.dataDataValue.push({ text: newItem  + " (Add New)", value: newItem });
            this.open();
        }
        // if (datas.length > 0){
        //     if (/\(Add New\)$/i.test(lastItem)) {
        //         ds.remove(lastItem);
        //     }
        // }

        // var newEntryFound = _.find(datas, function(e){ return e == newItem; });
        // if (newItem.length > 0 && newEntryFound == undefined) {
        //     ds.data().push(newItem + " (Add New)");
        //     this.open();
        // }
    }
};
ed.onSelectmulti = function(e) {
  var dataItem = this.dataSource.view()[e.item.index()],
      datas = this.dataSource.data(),
      lastData = datas[datas.length - 1];
  // if (parseInt(dataItem) > 0) {
  //   this.dataSource.remove(lastData);            
  // } else {
  //   dataItem = dataItem.replace(" (Add New)", "");
  // }
  dataItem.text = dataItem.text.replace(" (Add New)", "");
  ed.dataDataValue()[datas.length - 1].text = ed.dataDataValue()[datas.length - 1].text.replace(" (Add New)", "");
};
ed.selectDDStatement = function(Index,dataItem, type){
    ed.refreshStatement("select",Index, {value: dataItem.key, field: type});
    ed.setDataSource("select", dataItem.key);
    $('#grid-statement').data('kendoGrid').dataSource.read();
    $('#grid-statement').data('kendoGrid').refresh();
};
ed.gridStatementDataBound = function (e) {
	$("#grid-statement .btn-formula").on("click", function (d) {
		d.preventDefault();
		var index = parseInt($(this).attr("indexstatement"));
		ed.showFormulaEditor(index,ko.mapping.toJS(ed.configEfs.elements()[index-1]));
	});

	app.gridBoundTooltipster('#grid-statement')();
};
ed.showFormulaEditor = function(index,data){
	ed.modeFormula("");
    if(data.Title2 != "")
        ed.titlePopUp(data.StatementElement.Title2);
    else if (data.Title1 != "")
        ed.titlePopUp(data.StatementElement.Title1);
    else
        ed.titlePopUp("Formula");
	$("#formula-popup").modal("show");
    ed.selectColumn({index:index});
    var datatojs = data;
    $('#formula-editor').ecLookupDD("clear");
    for(var i in datatojs.Formula){
        if (datatojs.Formula[i] == "+" || datatojs.Formula[i] == "-" || datatojs.Formula[i] == "*" || datatojs.Formula[i] == "/")
            $('#formula-editor').ecLookupDD("addLookup",{id:moment().format("hhmmDDYYYYx"), value: datatojs.Formula[i], title:datatojs.FormulaText[i], koefisien:false});
        else
            $('#formula-editor').ecLookupDD("addLookup",{id:moment().format("hhmmDDYYYYx"), value: datatojs.Formula[i], title: datatojs.FormulaText[i], koefisien:true});
    }
};
ed.selectKoefisien = function(event){
	ed.modeFormula("");
	$('#formula-editor').ecLookupDD("addLookup",{id:moment().format("hhmmDDYYYYx"), value: event, title: event, koefisien:false});
    ed.lastParamSelect();
    $("#konstanta").focus();
};
ed.selectKoefisienGroup = function(event){
	ed.backFormulaEditor();
    ed.modeFormula(event);
};
ed.removeKoefisien = function(data){
    fp.recordKoefisien.remove(data);
};
ed.clearFormula = function(){
    $('#formula-editor').ecLookupDD("clear");
};
ed.backFormulaEditor = function(){
    ed.recordKoefisien([]);
    ed.recordCondition([]);
    ed.addParameter();
    ed.addCondition();
    ed.modeFormula("");
};
ed.addParameter = function(){
	ed.recordKoefisien.push({valueform:"",valueto:""});
    $('#koefisien1'+(ed.recordKoefisien().length-1)).ecLookupDD({
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
    $('#koefisien2'+(ed.recordKoefisien().length-1)).ecLookupDD({
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
ed.addKostantaFormula = function(){
	var resultFormula = "", boolsuccess = false;
    if (ed.modeFormula() == "SUM")
        resultFormula += "fn:SUM";
    else if (ed.modeFormula() == "AVG")
        resultFormula += "fn:AVG";
    else
        resultFormula += "fn:IF";

    if (ed.modeFormula() != "IF"){
        var objFormula1 = [], objFormula2 = [], index1 = 0, index2 = 0, boolyo = false, separatorcond = ",", textval1 = "", textval2 = "";
        resultFormula += "(";
        for (var i in ed.recordKoefisien()){
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
        for (var i in ed.recordCondition()){
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
                resultFormula += "("+objFormula1[0].value+ed.recordCondition()[i].condition+objFormula2[0].value+","+objFormula3[0].value+","+objFormula4[0].value+")";
                boolsuccess = true;
            }
        }
    }
    if (boolsuccess){
        $('#formula-editor').ecLookupDD("addLookup",{id:moment().format("hhmmDDYYYYx"), value:resultFormula, title: resultFormula , koefisien:true});
        ed.backFormulaEditor();
    }
};
ed.addCondition = function(){
    ed.recordCondition.push({param1:'',param2:'',condition:'==',result1:'',result2:''});
    $('#condition1'+(ed.recordCondition().length-1)).ecLookupDD({
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
    $('#condition2'+(ed.recordCondition().length-1)).ecLookupDD({
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
    $('#result1'+(ed.recordCondition().length-1)).ecLookupDD({
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
    $('#result2'+(ed.recordCondition().length-1)).ecLookupDD({
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
ed.saveFormulaEditor = function(){
    var objFormula = $('#formula-editor').ecLookupDD("get"), resultFormula = "", resultFormulaArr = [];
    ed.refreshStatement("all", 0, {});
    ed.configEfs.elements()[ed.selectColumn().index-1].FormulaText([]);
    for (var i in objFormula){
        resultFormulaArr.push(objFormula[i].value);
        ed.configEfs.elements()[ed.selectColumn().index-1].FormulaText.push(objFormula[i].title);
    }
    ed.configEfs.elements()[ed.selectColumn().index-1].Formula(resultFormulaArr)
    $('#formula-editor').ecLookupDD("clear");
    ed.backFormulaEditor();
    $('#grid-statement').data('kendoGrid').dataSource.read();
    $('#grid-statement').data('kendoGrid').refresh();
    $("#formula-popup").modal("hide");
};
ed.refreshStatement = function(type, index, data){
    var grids = $("#grid-statement").data("kendoGrid"), statement = grids.dataSource.data();
    var dataStatement = $.extend(true, {}, ko.mapping.toJS(ed.configEfs));
    dataStatement.elements = JSON.parse(kendo.stringify(statement));
    if (type == "select")
        dataStatement.elements[index][data.field] = data.value;
    ko.mapping.fromJS(dataStatement, ed.configEfs);
}
ed.checkAll = function(ele, field) {
    var state = $(ele).is(':checked');    
    var grid = $('#grid-statement').data('kendoGrid');
    $.each(grid.dataSource.view(), function () {
        if (this[field] != state) 
            this.dirty=true;
        this[field] = state;
    });
    grid.refresh();
};
ed.checkDeleteData = function(elem, e){
	if (e === 'efs'){
		if ($(elem).prop('checked') === true){
			ed.tempCheckIdEfs.push($(elem).attr('idcheck'));
		} else {
			ed.tempCheckIdEfs.remove( function (item) { return item === $(elem).attr('idcheck'); } );
		}
	} if (e === 'efsall'){
		if ($(elem).prop('checked') === true){
			$('.efscheck').each(function(index) {
				$(this).prop("checked", true);
				ed.tempCheckIdEfs.push($(this).attr('idcheck'));
			});
		} else {
			var idtemp = '';
			$('.efscheck').each(function(index) {
				$(this).prop("checked", false);
				idtemp = $(this).attr('idcheck');
				ed.tempCheckIdEfs.remove( function (item) { return item === idtemp; } );
			});
		}
	}
	if (e === 'statement'){
		if ($(elem).prop('checked') === true){
			ed.tempCheckIdStatement.push($(elem).attr('idcheck'));
		} else {
			ed.tempCheckIdStatement.remove( function (item) { return item === $(elem).attr('idcheck'); } );
		}
	} if (e === 'statementall'){
		if ($(elem).prop('checked') === true){
			$('.statementcheck').each(function(index) {
				$(this).prop("checked", true);
				ed.tempCheckIdStatement.push($(this).attr('idcheck'));
			});
		} else {
			var idtemp = '';
			$('.statementcheck').each(function(index) {
				$(this).prop("checked", false);
				idtemp = $(this).attr('idcheck');
				ed.tempCheckIdStatement.remove( function (item) { return item === idtemp; } );
			});
		}
	}
};
ed.getDataStatement = function(){
    app.ajaxPost("/statementversion/getstatementversion", {statementid: ed.tempStatementId(), mode: "new"}, function(res){
        if(!app.isFine(res)){
            return;
        }
        if (!res.data) {
            res.data = [];
        }
        for(var i in res.data.data.Element){
            res.data.data.Element[i] = $.extend({}, ed.templateFormula, res.data.data.Element[i] || {});
        }
        ko.mapping.fromJS(res.data.data, ed.dataFormula);
        // ed.dataFormula(res.data.data.Element);
    });
};
ed.selectListAkun = function(index, data){
	var titleshow = "";
    if(data.StatementElement.Title2()!="")
        titleshow = data.StatementElement.Title2();
    else if (data.StatementElement.Title2() == "" && data.StatementElement.Title1() != "")
        titleshow = data.StatementElement.Title1();
    else
        titleshow = "@"+(index+1);
    if (ed.modeFormula() == ""){
    	$('#formula-editor').ecLookupDD("addLookup",{id:moment().format("hhmmDDYYYYx"), value: "@"+(index+1), title: titleshow, koefisien:true});
    } else if (ed.modeFormula() == "SUM" || ed.modeFormula() == "AVG") {
        var $areaselect = $("#tablekoefisien>tbody .eclookup-selected").parent().find(".areakoefisien"), idselect = $areaselect.attr("id");
        if($areaselect.length>0)
            $('#'+idselect).ecLookupDD("addLookup",{id:moment().format("hhmmDDYYYYx"), value: "@"+(index+1),title: "@"+(index+1), koefisien:true});
    } else if (ed.modeFormula() == "IF"){
        var $areaselect = $("#tableif>tbody .eclookup-selected").parent().find(".areakoefisien"), idselect = $areaselect.attr("id");
        if($areaselect.length>0)
            $('#'+idselect).ecLookupDD("addLookup",{id:moment().format("hhmmDDYYYYx"), value: "@"+(index+1), title:"@"+(index+1), koefisien:true});
    }
    ed.lastParamSelect();
};
ed.lastParamSelect = function(){
    var objFormula = $('#formula-editor').ecLookupDD("get");
    if (objFormula.length>0)
        ed.lastParam(objFormula[objFormula.length-1].koefisien);
    else
        ed.lastParam("");
};
ed.changeCheckboxOnGrid = function (o) {
	var $grid = $("#grid-statement").data("kendoGrid");
	var field = $(o).attr("data-field");
	var uid = $(o).closest("tr").attr("data-uid");
	var value = $(o).is(":checked");

	var rowData = $grid.dataSource.getByUid(uid);
	rowData.set(field, value);

	var data = $grid.dataSource.data();
	var plainData = JSON.parse(kendo.stringify(data));
	db.databrowserData(plainData);
	db.headerCheckedAll();

	return true;
};
ed.dataDDOption = function (opt, typedd) {
	var dataarr = [];
	if (typedd == 'Type')
		dataarr = ed.dataType();
	else if (typedd == 'Column')
		dataarr = ed.dataColumn();
	else if (typedd == 'TransactionReadType')
		dataarr = ed.dataTransReadType();
	else if (typedd == 'TimeReadType')
		dataarr = ed.dataTimeReadType();
    if (typedd != "DataValue"){
    	var type = ko.utils.arrayFilter(dataarr, function (each) {
            return each.key == opt;
    	});
        if (type.length > 0)
            return type[0].text;
    } else if (typedd == "DataValue" && opt.length > 0){
        var result = [];
        for (var i=0; i < opt.length; i++){
            result.push(opt[i].text);
            // result.push(opt[i]);
        }
        return result.join(', ');
    } else if (typedd == "DataValue" && opt.length == 0){
        return "";
    }
};
ed.selectAll = function(){
	$(".grid-efs .select-row").each(function (i, d) {
		$(d).prop("checked", o.checked);
	});
};
ed.selectEfs = function(){

};
ed.addEfs = function(){
	app.mode("edit");
	ko.mapping.fromJS(ed.templateEfs, ed.configEfs);
	ed.addStatement();
    ed.setDataSource('all','');
};
ed.backToFront = function(){
	app.mode("");
	ed.getStatement();
};
ed.saveEfs = function(){
	if (!app.isFormValid(".form-add-efs")) {
		return;
	}
	var grids = $("#grid-statement").data("kendoGrid"), statement = grids.dataSource.data(), arrayValue = [];
	var param = ko.mapping.toJS(ed.configEfs);
	param.elements = JSON.parse(kendo.stringify(statement));
    for (i = 0; i < param.elements.length; i++){
        arrayValue = [];
        for (a = 0; a < param.elements[i].DataValueTemp.length; a++){
            arrayValue.push(param.elements[i].DataValueTemp[a].text);
        }
        param.elements[i].DataValue = arrayValue;
    }
	app.ajaxPost("/statement/savestatement", param, function (res) {
        if (!app.isFine(res)) {
            return;
        }
		ed.backToFront();
    });
};
ed.selectGridEfs = function(){
	app.wrapGridSelect(".grid-efs", ".btn", function (d) {
		ed.editEfs(d._id);
		ed.tempCheckIdEfs.push(d._id);
	});
};
ed.editEfs = function(_id){
	// app.miniloader(true);
	// app.showfilter(false);
	ko.mapping.fromJS(ed.templateEfs, ed.configEfs);
	app.ajaxPost("/statement/editstatement", { _id: _id }, function (res) {
		if (!app.isFine(res)) {
			return;
		}

		app.mode("edit");	
		app.resetValidation(".form-add-efs");
        var dataValue = [], dataDataValue = [];
        for(i = 0; i < res.data.elements.length; i++){
            res.data.elements[i] = $.extend({}, ed.templateStatement, res.data.elements[i] || {});
            dataValue = [];
            for(a = 0; a < res.data.elements[i].DataValue.length; a++){
                dataDataValue = ko.utils.arrayFilter(ed.dataDataValue(), function (each) {
                    return each.value == res.data.elements[i].DataValue[a];
                });
                if (dataDataValue.length == 0){
                    ed.dataDataValue.push({
                        text: res.data.elements[i].DataValue[a],
                        value: res.data.elements[i].DataValue[a],
                    });
                }
                dataValue.push({
                    text: res.data.elements[i].DataValue[a],
                    value: res.data.elements[i].DataValue[a],
                });
            }
            res.data.elements[i].DataValueTemp = dataValue;
        }
		ko.mapping.fromJS(res.data, ed.configEfs);	
        ed.setDataSource('all','');
	});
}
ed.removeEfs = function(){
	if (ed.tempCheckIdEfs().length === 0) {
		swal({
			title: "",
			text: 'You havent choose any datasource to delete',
			type: "warning",
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "OK",
			closeOnConfirm: true
		});
	}else{
		swal({
		    title: "Are you sure?",
		    text: 'Efs(s) '+ed.tempCheckIdEfs().toString()+' will be deleted',
		    type: "warning",
		    showCancelButton: true,
		    confirmButtonColor: "#DD6B55",
		    confirmButtonText: "Delete",
		    closeOnConfirm: true
		}, function() {
			setTimeout(function () {
				app.ajaxPost("/statement/removestatement", { _id: ed.tempCheckIdEfs() }, function (res) {
					if (!app.isFine(res)) {
						return;
					}
					ed.backToFront();
					swal({ title: "Efs(s) successfully deleted", type: "success" });
				});
			}, 1000);
		});
	} 
}
ed.addStatement = function(){
    var grids = $("#grid-statement").data("kendoGrid"), statement = grids.dataSource.data();
    var param = ko.mapping.toJS(ed.configEfs);
    param.elements = JSON.parse(kendo.stringify(statement));

	var dataStatement = $.extend(true, {}, param), confStatement = ed.templateStatement;
	confStatement.Index = dataStatement.elements.length+1;
	dataStatement.elements.push(confStatement);
	ko.mapping.fromJS(dataStatement, ed.configEfs);
};
Array.prototype.removeArray = function(name, value){
   var array = $.map(this, function(v,i){
      return v[name] === value ? null : v;
   });
   this.length = 0;
   this.push.apply(this, array);
}
ed.removeStatement = function(){
    var grids = $("#grid-statement").data("kendoGrid"), statement = grids.dataSource.data();
    var param = ko.mapping.toJS(ed.configEfs);
    param.elements = JSON.parse(kendo.stringify(statement));
    $("#grid-statement .statementcheck:checked").each(function() {
        param.elements.removeArray("Index", parseInt($(this).attr("idcheck")));
    });
    for (var i in param.elements){
        param.elements[i].Index = parseInt(i) + 1;
    }
    ko.mapping.fromJS(param, ed.configEfs);

};
ed.getStatement = function(){
	app.ajaxPost("/statement/getstatement", { search: ed.searchField() }, function (res) {
		if (!app.isFine(res)) {
			return;
		}

		ed.efsData(res.data);
	});
};
ed.changeValueVariable = function(index,valueChange){
    indexElem = index - 2;
    if (valueChange == true){
        if (index == 1 && ed.dataFormula.Element()[0].ChangeValue() == false){
            ed.dataFormula.Element()[0].ChangeValue(true);
        } else if (index > 1 && ed.dataFormula.Element()[0].ElementVersion()[indexElem].ChangeValue() == false) {
            ed.dataFormula.Element()[0].ElementVersion()[indexElem].ChangeValue(true);
        }
    }
    if (valueChange == false){
        if (index == 1 && ed.dataFormula.Element()[0].ChangeValue() == true){
            ed.dataFormula.Element()[0].ChangeValue(false);
        } else if (index > 1 && ed.dataFormula.Element()[0].ElementVersion()[indexElem].ChangeValue() == true) {
            index = index - 2;
            ed.dataFormula.Element()[0].ElementVersion()[indexElem].ChangeValue(false);
        }
    }
};
ed.setDataSource = function(choose, valuetype){
    var fieldsDs = {
            Index: { editable: false }, 
            DataValueText: { editable: false }, 
            TransactionReadType: { editable: false }, 
            TimeReadType: { editable: false }, 
        }
    console.log(valuetype);
    if (valuetype == 1 || valuetype == 2){
        fieldsDs = {
            Index: { editable: false }, 
        }
    }
    console.log(fieldsDs);
    var ds = new kendo.data.DataSource({
        batch: true,
        schema: { 
            model: { 
                id: 'Index', 
                fields: fieldsDs
            } 
        },
        data: ko.mapping.toJS(ed.configEfs.elements())
    });

    $("#grid-statement").data("kendoGrid").setDataSource(ds);
};
$(function (){
	ed.getStatement();
	ed.getDataStatement();
    $("#kostanta").bind("keyup", function(e) {
        if (e.keyCode == 13){
            $('#formula-editor').ecLookupDD("addLookup",{id: moment().format("hhmmDDYYYYx"), value: ed.konstanta().toString(), title: ed.konstanta().toString(), koefisien:true});
            ed.konstanta(0);
        }
    });
    $(".table-formula-data").bind("keyup",".efs-number", function(e) {
        var index = $(e.target).closest("td").attr("indexid");
        ed.changeValueVariable(index, true);
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
});