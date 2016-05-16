app.section('transaction');
viewModel.Transaction = {}; var tr = viewModel.Transaction;
tr.templateTransaction = {
	_id: "",
    company: "",
    account: "",
    profitcenter: "",
    costcenter: "",
    transdate: moment().format(),
    amount: 0,
    journalno: "",
}

tr.transactionData = ko.observableArray([]);
tr.configTransaction = ko.mapping.fromJS(tr.templateTransaction);
tr.searchField = ko.observable("");
tr.tempCheckIdTransaction = ko.observableArray([]);
tr.transactionColumns = ko.observableArray([
	{headerTemplate: "<center><input type='checkbox' class='transactioncheckall' onclick=\"tr.checkDeleteData(this, 'transactionall')\"/></center>", width: 50, attributes: { style: "text-align: center;" }, template: function (d) {
		return [
			"<input type='checkbox' class='transactioncheck' idcheck='"+d._id+"' onclick=\"tr.checkDeleteData(this, 'transaction')\" />"
		].join(" ");
	}},
	{ field: "journalno", title: "JournalNo" },
	{ field: "company", title: "Company" },
	{ field: "account", title: "Account" },
	{ field: "profitcenter", title: "Profit Center" },
	{ field: "costcenter", title: "Cost Center" },
	{ field: "transdate", title: "Date", template: "<span>#=moment(transdate).format('DD MMM YYYY')#</span>"},
	{ field: "amount", title: "Amount", template: "<span>#=kendo.toString(amount,'n2')#</span>"},
]);

tr.checkDeleteData = function(elem, e){
	if (e === 'transaction'){
		if ($(elem).prop('checked') === true){
			tr.tempCheckIdTransaction.push($(elem).attr('idcheck'));
		} else {
			tr.tempCheckIdTransaction.remove( function (item) { return item === $(elem).attr('idcheck'); } );
		}
	} if (e === 'transactionall'){
		if ($(elem).prop('checked') === true){
			$('.transactioncheck').each(function(index) {
				$(this).prop("checked", true);
				tr.tempCheckIdTransaction.push($(this).attr('idcheck'));
			});
		} else {
			var idtemp = '';
			$('.transactioncheck').each(function(index) {
				$(this).prop("checked", false);
				idtemp = $(this).attr('idcheck');
				tr.tempCheckIdTransaction.remove( function (item) { return item === idtemp; } );
			});
		}
	}
};
tr.getTransaction = function(){
	app.ajaxPost("/ledgertransaction/getledgertransaction", { search: tr.searchField() }, function (res) {
		if (!app.isFine(res)) {
			return;
		}
		tr.transactionData(res.data);
	});
};
tr.addTransaction = function(){
	app.mode("edit");
	ko.mapping.fromJS(tr.templateTransaction, tr.configTransaction);
};
tr.removeTransaction = function(){
	if (tr.tempCheckIdTransaction().length === 0) {
		swal({
			title: "",
			text: 'You havent choose any transaction list to delete',
			type: "warning",
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "OK",
			closeOnConfirm: true
		});
	}else{
		swal({
		    title: "Are you sure?",
		    text: 'Efs(s) '+tr.tempCheckIdTransaction().toString()+' will be deleted',
		    type: "warning",
		    showCancelButton: true,
		    confirmButtonColor: "#DD6B55",
		    confirmButtonText: "Delete",
		    closeOnConfirm: true
		}, function() {
			setTimeout(function () {
				app.ajaxPost("/ledgertransaction/removeledgertransaction", { _id: tr.tempCheckIdTransaction() }, function (res) {
					if (!app.isFine(res)) {
						return;
					}
					tr.backToFront();
					swal({ title: "Transaction List(s) successfully deleted", type: "success" });
				});
			}, 1000);
		});
	} 
};
tr.selectGridTransaction = function(){
	app.wrapGridSelect(".grid-transaction", ".btn", function (d) {
		tr.editTransaction(d._id);
		tr.tempCheckIdTransaction.push(d._id);
	});
};
tr.editTransaction = function(_id){
	ko.mapping.fromJS(tr.templateTransaction, tr.configTransaction);
	app.ajaxPost("/ledgertransaction/editledgertransaction", { _id: _id }, function (res) {
		if (!app.isFine(res)) {
			return;
		}
		app.mode("edit");	
		app.resetValidation(".form-add-efs");
		ko.mapping.fromJS(res.data, tr.configTransaction);
		$('#accounttype').ecLookupDD("clear");
		$('#accounttype').ecLookupDD("addLookup",{_id:res.data.account});
	});
};
tr.backToFront = function(){
	app.mode("");
	ko.mapping.fromJS(tr.templateTransaction, tr.configTransaction);
	$('#accounttype').ecLookupDD("clear");
	tr.getTransaction();
};
tr.saveTransaction = function(){
	if (!app.isFormValid(".form-add-efs")) {
		return;
	}
	var param = ko.mapping.toJS(tr.configTransaction), accounttype = $('#accounttype').ecLookupDD('get');
	if (accounttype.length > 0){
		param.account = accounttype[0]._id;
	}
	param.amount = parseFloat(param.Amount);
	app.ajaxPost("/ledgertransaction/saveledgertransaction", param, function (res) {
        if (!app.isFine(res)) {
            return;
        }
		tr.backToFront();
    });
};

// Upload
tr.templateUpload = {
	_id: "",
	filename: "",
	physicalname: "",
	desc: "",
	date: moment().format(),
	account: [],
	process: 0,
	status: "",
}
tr.uploadData = ko.observableArray([]);
tr.configUpload = ko.mapping.fromJS(tr.templateUpload);
tr.uploadColumns = ko.observableArray([
	{headerTemplate: "<center><input type='checkbox' class='uploadcheckall' onclick=\"tr.checkDeleteData(this, 'uploadall')\"/></center>", width: 50, attributes: { style: "text-align: center;" }, template: function (d) {
		return [
			"<input type='checkbox' class='uploadcheck' idcheck='"+d._id+"' onclick=\"tr.checkDeleteData(this, 'upload')\" />"
		].join(" ");
	}},
	{ field: "filename", title: "Filename" },
	{ field: "desc", title: "Description" },
	{ field: "date", title: "Date", template: "<span>#=moment(date).format('DD MMM YYYY')#</span>"},
	{ field: "account", title: "Account", template: function (d) {
		var html = [];
		for (var i = 0; i < d.account.length; i++) {
			html.push('<span>' + d.account[i] + '</span>');
		}
		return html.join(', ');
	} },
	{ field: "process", title: "Process", template: "<span>#=process#%</span>" },
	{ title: "Action", width: 20, attributes: { style: "text-align: center; cursor: pointer;"}, template: function (d) {
        return [
			"<button class='btn btn-sm btn-default btn-text-success tooltipster'><span class='glyphicon glyphicon-play'></span></button>",
		].join(" ");
	} },
]);
tr.selectGridUpload = function(){

};
tr.getUpload = function(){
	app.ajaxPost("/ledgertransfile/getledgertransfile", { }, function (res) {
		if (!app.isFine(res)) {
			return;
		}
		tr.uploadData(res.data);
	});
};
tr.saveTransFile = function(){
	if (!app.isFormValid(".form-add-transupload")) {
		return;
	}
	// var param = ko.mapping.toJS(tr.configUpload);
    var formData = new FormData();
    formData.append("desc", tr.configUpload.desc());
    formData.append("filename", tr.configUpload.filename());
    
    var attach = $(".form-add-transupload").find("#panel-data");
    if (attach.val() !== "") {
        formData.append("userfile", attach[0].files[0]);   
    }
    app.ajaxPost("/ledgertransfile/saveledgertransfile", formData, function (res) {
        if (!app.isFine(res)) {
            return;
        }
        tr.getUpload();
    });
};
tr.uploadView = function(){
	tr.getUpload();
	app.mode("upload");
	app.section("uploadtransaction");
};
tr.backTransaction = function(){
	app.mode("");
	app.section("transaction");
};


ko.bindingHandlers.numeric = {
    init: function (element, valueAccessor) {
        $(element).on("keydown", function (event) {
            if (event.keyCode == 189 || event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
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
	tr.getTransaction();
	$('#accounttype').ecLookupDD({
		dataSource:{
			url: "/account/getallgroup",
			call: 'post',
			callData: {},
			resultData: function(a){
				return a.data;
			}
		}, 
		inputType: 'ddl', 
		inputSearch: "_id", 
		idField: "_id", 
		idText: "_id", 
		displayFields: "_id", 
		statementversion: false,
	});
});