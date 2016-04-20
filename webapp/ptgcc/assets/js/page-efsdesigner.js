app.section('efsdesigner');
viewModel.EfsDesigner = {}; var ed = viewModel.EfsDesigner;

ed.templateStatement = {
	Index: 0,
	Title1: "",
	Title2:"",
	Type:0,
	DataValue: [],
	Show: true,
	Showformula: true,
	Bold: false,
	NegateValue: true,
	NegateDisplay: true,
	Column: 1,
};
ed.templateEfs = {
	_id: "",
	Title: "",
	Statement: [],
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

ed.pageData = ko.observableArray([]);
ed.configEfs = ko.mapping.fromJS(ed.templateEfs);
ed.efsColumns = ko.observableArray([
	{title: "<center><input type='checkbox' onchange='ed.selectAll(this);'></center>", width: 50, attributes: { style: "text-align: center;" }, template: function (d) {
		return [
			"<input type='checkbox' class='select-row' value=" + d._id + ">"
		].join(" ");
	}},
	{ field: "ID", title: "ID" },
	{ field: "Title", title: "Title" },
]);
ed.statementColumns = ko.observableArray([
	{ width: 15, editable: false, title: "<center><input type='checkbox' onchange='ed.selectAllStatement(this);'></center>", attributes: { style: "text-align: center;" }, template: function (d) {
		return [
			"<input type='checkbox' class='select-rowstatement' value=" + d.index + ">"
		].join(" ");
	}},
	{ width: 15, field: "index", title: "No", editable: false },
	{ width: 100, field: "Title1", title: "Title 1"},
	{ width: 100, field: "Title2", title: "Title 2"},
	{ width: 50, field: "Type", title: "Type", template: "#= ed.dataDDOption(Type, 'Type') #",
		editor: function(container, options) {
            var input = $('<input id="datatypeId" name="datatype" data-bind="value:' + options.field + '">');
            input.appendTo(container);
            input.kendoDropDownList({
                dataTextField: "text",
                dataValueField: "key",
                dataSource: ed.dataType() // bind it to the models array
            }).appendTo(container);
        }},
    // { width: 100, field: "DataValue", title: "Data Value"},
    { width: 20, title: "Show", template: "<center><input type='checkbox' #=Show ? \"checked='checked'\" : ''# class='showfield' data-field='Show' onchange='db.changeCheckboxOnGrid(this)' /></center>", headerTemplate: "<center><input type='checkbox' id='selectallshowfield' onclick=\"ed.checkAll(this, 'ShowField')\" />&nbsp;&nbsp;Show</center>"},
    { width: 35, title: "Show Formula", template: "<center><input type='checkbox' #=Showformula ? \"checked='checked'\" : ''# class='showfield' data-field='ShowFormula' onchange='db.changeCheckboxOnGrid(this)' /></center>", headerTemplate: "<center><input type='checkbox' id='selectallshowformula' onclick=\"ed.checkAll(this, 'ShowFormula')\" />&nbsp;&nbsp;Show Formula</center>"},
    { width: 20, title: "Bold", template: "<center><input type='checkbox' #=Bold ? \"checked='checked'\" : ''# class='bold' data-field='Bold' onchange='db.changeCheckboxOnGrid(this)' /></center>", headerTemplate: "<center><input type='checkbox' id='selectallshowformula' onclick=\"ed.checkAll(this, 'Bold')\" />&nbsp;&nbsp;Bold</center>"},
    { width: 50, field: "Column", title: "Column", template: "#= ed.dataDDOption(Column, 'Column') #",
		editor: function(container, options) {
            var input = $('<input id="datacolumnId" name="datacolumn" data-bind="value:' + options.field + '">');
            input.appendTo(container);
            input.kendoDropDownList({
                dataTextField: "text",
                dataValueField: "key",
                dataSource: ed.dataColumn() // bind it to the models array
            }).appendTo(container);
        }},
]);

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
}
ed.dataDDOption = function (opt, typedd) {
	var dataarr = [];
	if (typedd == 'Type')
		dataarr = ed.dataType();
	else if (typedd == 'Column')
		dataarr = ed.dataColumn();
	var type = ko.utils.arrayFilter(dataarr, function (each) {
        return each.key == opt;
	});
	if (type.length > 0)
		return type[0].text;
}
ed.selectAll = function(){

};
ed.selectEfs = function(){

};
ed.addEfs = function(){
	app.mode("edit");
	ko.mapping.fromJS(ed.templateEfs, ed.configEfs);
	ed.addStatement();
};
ed.backToFront = function(){
	app.mode("");
};
ed.saveEfs = function(){
	ed.backToFront();
};
ed.addStatement = function(){
	var dataStatement = $.extend(true, {}, ko.mapping.toJS(ed.configEfs)), confStatement = ed.templateStatement;
	confStatement.index = dataStatement.Statement.length+1;
	dataStatement.Statement.push(confStatement);
	ko.mapping.fromJS(dataStatement, ed.configEfs);
};
ed.removeStatement = function(){

}

$(function (){

});