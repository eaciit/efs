app.section('transaction');
viewModel.Transaction = {}; var tr = viewModel.Transaction;
tr.templateTransaction = {
	_id: "",
    company: "",
    account: "",
    profitcenter: "",
    costcenter: "",
    date: moment().format(),
    amount: 0,
}

tr.transactionData = ko.observableArray([]);
tr.configTransaction = ko.mapping.fromJS(tr.templateTransaction);
tr.transactionColumns = ko.observableArray([
	{ field: "company", title: "Company" },
	{ field: "account", title: "Account" },
	{ field: "profitcenter", title: "Profit Center" },
	{ field: "costcenter", title: "Cost Center" },
	{ field: "date", title: "Date", template: "<span>#=moment(date).format('DD MMM YYYY')#</span>"},
	{ field: "amount", title: "Amount", template: "<span>#=kendo.toString(amount,'n2')#</span>"},
]);

tr.getTransaction = function(){
	tr.transactionData([
		{
			_id: "1",
    		company: "1000",
		    account: "acc002",
		    profitcenter: "",
		    costcenter: "",
		    date: moment().format(),
		    amount: 100000,
		},
		{
			_id: "2",
    		company: "1000",
		    account: "acc002",
		    profitcenter: "",
		    costcenter: "",
		    date: moment().format(),
		    amount: -10000,
		},
		{
			_id: "3",
    		company: "1000",
		    account: "acc003",
		    profitcenter: "",
		    costcenter: "",
		    date: moment().format(),
		    amount: 200000,
		},
	])
};
tr.addTransaction = function(){
	app.mode("edit");
	ko.mapping.fromJS(tr.templateTransaction, tr.configTransaction);
};
tr.removeTransaction = function(){

};
tr.selectGridTransaction = function(){

};
tr.backToFront = function(){
	app.mode("");
	ko.mapping.fromJS(tr.templateTransaction, tr.configTransaction);
};
tr.saveTransaction = function(){

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
		inputType: 'multiple', 
		inputSearch: "_id", 
		idField: "_id", 
		idText: "_id", 
		displayFields: "_id", 
		statementversion: false,
	});
});