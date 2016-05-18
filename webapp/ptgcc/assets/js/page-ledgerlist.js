app.section('ledgerlist');
viewModel.LedgerList = {}; var ll = viewModel.LedgerList;

ll.templateLedgerList = {
	_id: "",
    title: "",
    type: 1,
    group: [],
    periode: moment().format(),
    opening: 0,
    date: new Date(),
    in: 0,
    out: 0,
    balance: 0,
}
ll.templateFilter = {
	startdate: moment().format(),
	enddate: moment().format(),
}
ll.dataType = ko.observableArray([
	{text: "Group", value: 1},
	{text: "Account", value: 0},
]);
ll.searchField = ko.observable('');
ll.modeApp = ko.observable(true);
ll.configLedgerList = ko.mapping.fromJS(ll.templateLedgerList);
ll.configFilter = ko.mapping.fromJS(ll.templateFilter);
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
	{ field: "type", title: "Type", template: function(d){
		if (d.type == 1)
			return ["<span>Group</span>"].join(" ");
		else
			return ["<span>Account</span>"].join(" ");
	} },
	{ field: "group", title: "Group", template: function (d) {
		var html = [];
		for (var i = 0; i < d.group.length; i++) {
			html.push('<span>' + d.group[i] + '</span>');
		}
		return html.join(', ');
	} },
	// { field: "period", title: "Period" },
	{ field: "opening", title: "Opening" },
	{ field: "in", title: "In" },
	{ field: "out", title: "Out" },
	{ field: "balance", title: "Balance" },
]);

ll.getMonthDateRange = function() {
    var startDate = moment([parseInt(moment().format('YYYY')), parseInt(moment().format('MM')) - 1]).startOf('day');
    var endDate = moment(startDate).endOf('month').startOf('day');
    ll.configFilter.startdate(startDate.toDate());
    ll.configFilter.enddate(endDate.toDate());
}
ll.getLedgerList = function(){
	app.ajaxPost("/account/getaccount", { search: ll.searchField(), startdate: moment(ll.configFilter.startdate()).add(1, 'days'), enddate: moment(ll.configFilter.enddate()).add(1, 'days') }, function (res) {
		if (!app.isFine(res)) {
			return;
		}

		ll.ledgerListData(res.data);
	});
};
ll.addLedgerList = function() {
	app.mode("edit");
	ll.modeApp(true);
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
		ll.modeApp(false);
		app.resetValidation(".form-add-efs");
		ko.mapping.fromJS(res.data, ll.configLedgerList);
		for (var i in res.data.group){
			$('#grouptype').ecLookupDD('addLookup', {_id: res.data.group[i]});	
		}
	});
};
ll.backToFront = function(){
	app.mode("");
	ll.modeApp(true);
	ll.getLedgerList();
	ll.tempCheckIdLedger([]);
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
	ll.getMonthDateRange();
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