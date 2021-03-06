app.section('main');

viewModel.layout = {}; var ly = viewModel.layout;
ly.account  = ko.observable(false);
ly.session  = ko.observable('');
ly.username = ko.observable('');

ly.varMenu = [{"id":"formula", "title":"EFS", "childrens":[], "link":"/web/index"},
			{"id":"simulation", "title":"EFS Designer", "childrens":[], "link":"/web/efsdesigner"},
			{"id":"ledger", "title":"Ledger", "childrens":[
				{"id":"accounts", "title":"Accounts", "childrens":[], "link":"/web/accounts"},
				{"id":"transaction", "title":"Transaction", "childrens":[], "link":"/web/transaction"},
			], "link":"#"},];
ly.element = function(data){
	// console.log(data.length);
	$parent = $('#nav-ul');
	$navbar = $('<ul class="nav navbar-nav"></ul>');
	$navbar.appendTo($parent);
	if(data.length == 0){
		$liparent = $("<li class='dropdown' id='liparent'><a>&nbsp;</a></li>");
		$liparent.appendTo($navbar);
	}else{
		$.each(data, function(i, items){
			if(items.childrens.length != 0){
				$liparent = $('<li class="dropdown" id="liparent"><a href="#" class="dropdown-toggle" data-toggle="dropdown">'+items.title+' <span class="caret"></span></a></li>');
				$liparent.appendTo($navbar);
				$ulchild = $('<ul class="dropdown-menu"></ul>');
				$ulchild.appendTo($liparent);
				$.each(items.childrens, function(e, childs){
					$lichild =  $('<li><a href="'+childs.link+'">'+childs.title+'</a></li>');
					$lichild.appendTo($ulchild);
				});
			}else{
				$liparent = $('<li id="liparent"><a href="'+items.link+'">'+items.title+'</a></li>');
				$liparent.appendTo($navbar);
			}

		});
	}

};
ly.getFileTransaction = function(){
	app.ajaxPost("/ledgertransfile/getltfonprocess", { }, function (res) {
		if (!app.isFine(res)) {
			return;
		}
		var tempFile = new Array();
		for (var i in res.data){
			tempFile.push({
				id: res.data[i]._id,
				text: res.data[i].filename + "<br/>" + res.data[i].account.toString(),
			});
		}
		console.log(tempFile);
		$('.content-notif').ecNotif('addMultiple',{notif:false,data:tempFile});
	});
};

ly.getLogout = function(){
	//alert('masuk');
	app.ajaxPost("/login/logout", {logout: true}, function(res){
		if(!app.isFine(res)){
			return;
		}
		ly.account(false);
		window.location = "/web/login"
	});
}

ly.getLoadMenu = function(){ 
	// app.ajaxPost("/login/getsession",{}, function(res){
	// 	if(!app.isFine(res)){
	// 		return;
	// 	}
		
	// 	ly.session(res.data.sessionid);
	// 	if(ly.session() !== '' ){
	// 		app.ajaxPost("/login/getusername", {}, function(res){
	// 			if(!app.isFine(res)){
	// 				return;
	// 			}

	// 			ly.username(" Hi' "+res.data.username);

	// 		});
	// 	}
	// });
	
	// app.ajaxPost("/login/getaccessmenu", {}, function(res){
	// 	if(!app.isFine(res)){
	// 		return;
	// 	}

	// 	ly.element(ly.varMenu);

	// }, function () {
	// 	ly.element([]);
	// });
	ly.element(ly.varMenu);
}


$(function (){
	ly.getFileTransaction();
	ly.getLoadMenu();
});