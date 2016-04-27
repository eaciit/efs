app.section('ledgerlist');
viewModel.LedgerList = {}; var ll = viewModel.LedgerList;

ll.templateLedgerList = {
	_id: "",
    title: "",
    type: "Group",
    group: [],
}
ll.dataType = ko.observableArray([
	{text: "Group", value: "Group"},
	{text: "Account", value: "Account"},
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
	app.ajaxPost("/ledgerlist/getledgerlist", { search: ll.searchField() }, function (res) {
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
		    text: 'Efs(s) '+ed.tempCheckIdLedger().toString()+' will be deleted',
		    type: "warning",
		    showCancelButton: true,
		    confirmButtonColor: "#DD6B55",
		    confirmButtonText: "Delete",
		    closeOnConfirm: true
		}, function() {
			setTimeout(function () {
				app.ajaxPost("/ledgerlist/removeledgerlist", { _id: ed.tempCheckIdLedger() }, function (res) {
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

};
ll.backToFront = function(){
	app.mode("");
	ll.getLedgerList();
};
ll.saveLedgerList = function(){

};
ll.checkDeleteData = function(e){
	if (e === 'ledger'){
		if ($(elem).prop('checked') === true){
			ll.tempCheckIdLedger.push($(elem).attr('idcheck'));
		} else {
			ll.tempCheckIdLedger.remove( function (item) { return item === $(elem).attr('idcheck'); } );
		}
	} if (e === 'ledgerall'){
		if ($(elem).prop('checked') === true){
			$('.efscheck').each(function(index) {
				$(this).prop("checked", true);
				ll.tempCheckIdLedger.push($(this).attr('idcheck'));
			});
		} else {
			var idtemp = '';
			$('.efscheck').each(function(index) {
				$(this).prop("checked", false);
				idtemp = $(this).attr('idcheck');
				ll.tempCheckIdLedger.remove( function (item) { return item === idtemp; } );
			});
		}
	}
};

$(function (){
	ll.getLedgerList();
});