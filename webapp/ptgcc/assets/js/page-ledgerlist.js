app.section('ledgerlist');
viewModel.LedgerList = {}; var ll = viewModel.LedgerList;

ll.templateLedgerList = {
	_id: "",
    title: "",
    type: 1,
    group: [],
}
ll.dataType = ko.observableArray([
	{text: "Group", value: 1},
	{text: "Account", value: 0},
]);
ll.searchField = ko.observable('');
ll.configLedgerList = ko.mapping.fromJS(ll.templateLedgerList);
ll.ledgerListData = ko.observableArray([]);
ll.dataGroup = ko.observableArray([]);
ll.tempCheckIdLedger = ko.observableArray([]);
ll.ledgerListColumns = ko.observableArray([
	{headerTemplate: "<center><input type='checkbox' class='ledgercheckall' onclick=\"ll.checkDeleteData(this, 'ledgerall')\"/></center>", width: 50, attributes: { style: "text-align: center;" }, template: function (d) {
		return [
			"<input type='checkbox' class='ledgercheck' idcheck='"+d._id+"' onclick=\"ll.checkDeleteData(this, 'ledger')\" />"
		].join(" ");
	}},
	{ field: "_id", title: "ID" },
	{ field: "title", title: "Title" },
	{ field: "type", title: "Type" },
	{ field: "group", title: "Group" },
]);

ll.getLedgerList = function(){
	app.ajaxPost("/account/getaccount", { search: ll.searchField() }, function (res) {
		if (!app.isFine(res)) {
			return;
		}

		ll.ledgerListData(res.data);
	});
};
ll.addLedgerList = function() {
	app.mode("edit");
	ko.mapping.fromJS(ll.templateLedgerList, ll.configLedgerList);
};
ll.removeLedgerList = function(){
	if (ll.tempCheckIdLedger().length === 0) {
		swal({
			title: "",
			text: 'You havent choose any ledger list to delete',
			type: "warning",
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "OK",
			closeOnConfirm: true
		});
	}else{
		swal({
		    title: "Are you sure?",
		    text: 'Efs(s) '+ll.tempCheckIdLedger().toString()+' will be deleted',
		    type: "warning",
		    showCancelButton: true,
		    confirmButtonColor: "#DD6B55",
		    confirmButtonText: "Delete",
		    closeOnConfirm: true
		}, function() {
			setTimeout(function () {
				app.ajaxPost("/account/removeaccount", { _id: ll.tempCheckIdLedger() }, function (res) {
					if (!app.isFine(res)) {
						return;
					}
					ll.backToFront();
					swal({ title: "Ledger List(s) successfully deleted", type: "success" });
				});
			}, 1000);
		});
	} 
};
ll.selectGridLedgerList = function(){
	app.wrapGridSelect(".grid-efs", ".btn", function (d) {
		ll.editLedger(d._id);
		ll.tempCheckIdLedger.push(d._id);
	});
};
ll.editLedger = function(_id){
	ko.mapping.fromJS(ll.templateLedgerList, ll.configLedgerList);
	app.ajaxPost("/account/editaccount", { _id: _id }, function (res) {
		if (!app.isFine(res)) {
			return;
		}

		app.mode("edit");	
		app.resetValidation(".form-add-efs");
		ko.mapping.fromJS(res.data, ll.configLedgerList);	
	});
};
ll.backToFront = function(){
	app.mode("");
	ll.getLedgerList();
	$('#grouptype').ecLookupDD('clear');
};
ll.saveLedgerList = function(){
	if (!app.isFormValid(".form-add-efs")) {
		return;
	}
	var param = ko.mapping.toJS(ll.configLedgerList), grouptype = $('#grouptype').ecLookupDD('get'), groupid = [];
	for (var i in grouptype){
		groupid.push(grouptype[i]._id);
	}
	param.group = groupid;
	param.type = parseInt(param.type);
	app.ajaxPost("/account/saveaccount", param, function (res) {
        if (!app.isFine(res)) {
            return;
        }
		ll.backToFront();
    });
};
ll.checkDeleteData = function(elem, e){
	if (e === 'ledger'){
		if ($(elem).prop('checked') === true){
			ll.tempCheckIdLedger.push($(elem).attr('idcheck'));
		} else {
			ll.tempCheckIdLedger.remove( function (item) { return item === $(elem).attr('idcheck'); } );
		}
	} if (e === 'ledgerall'){
		if ($(elem).prop('checked') === true){
			$('.ledgercheck').each(function(index) {
				$(this).prop("checked", true);
				ll.tempCheckIdLedger.push($(this).attr('idcheck'));
			});
		} else {
			var idtemp = '';
			$('.ledgercheck').each(function(index) {
				$(this).prop("checked", false);
				idtemp = $(this).attr('idcheck');
				ll.tempCheckIdLedger.remove( function (item) { return item === idtemp; } );
			});
		}
	}
};

$(function (){
	ll.getLedgerList();
	$('#grouptype').ecLookupDD({
		dataSource:{
			url: "/account/getallgroup",
			call: 'post',
			callData: {},
			resultData: function(a){
				return a.data;
			}
		}, 
		inputType: 'multiple', 
		inputSearch: "_id", 
		idField: "_id", 
		idText: "_id", 
		displayFields: "_id", 
		statementversion: false,
	});
});