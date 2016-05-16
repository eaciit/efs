$(function() {
    $('body').on('click touchstart', '.notif-list-toggle', function(){
        $(this).closest('.notif').find('.notif-list').toggleClass('toggled');
        $('.notif .status').removeClass('ijo');
    });

    $('body').on('click touchstart', '.notif .header-notif .btn', function(e){
        e.preventDefault();
        // $('.notif .notif-list').removeClass('toggled');
        $(this).closest('.notif').toggleClass('toggled');
        $('.notif .status').removeClass('ijo');
    });

    $(document).on('mouseup touchstart', function (e) {
        var container = $('.notif, .notif .notif-list');
        if (container.has(e.target).length === 0) {
            container.removeClass('toggled');
        }
    });

});

var methodsNotif = {
    data_notiv: [],
    add: function(item){
        var $o = this, $divmedia, $iconnotiv, $divtext;
        $divmedia = jQuery('<div />');
        $divmedia.addClass('media');
        $divmedia.attr('idnotiv',item.id);
        $divmedia.appendTo($o);

        $iconnotiv = jQuery('<i />');
        $iconnotiv.addClass('pull-left glyphicon glyphicon-info-sign');
        // $iconnotiv.css({'color':'#D1F026','font-size':'25px'});
        $iconnotiv.appendTo($divmedia);

        $divtext = jQuery('<div />');
        $divtext.addClass('media-body');
        $divtext.html(item.text);
        $divtext.appendTo($divmedia);

        methodsNotif.data_notiv.push(item);
        if (item.notif)
            $('.notif .status').addClass('ijo');
    },
    addMultiple: function(item){
        var $o = this, $divmedia, $iconnotiv, $divtext;
        for(var key in item.data){
            $divmedia = jQuery('<div />');
            $divmedia.addClass('media');
            $divmedia.attr('idnotiv',item.data[key].id);
            $divmedia.appendTo($o);

            $iconnotiv = jQuery('<i />');
            $iconnotiv.addClass('pull-left glyphicon glyphicon-info-sign');
            // $iconnotiv.css({'color':'#D1F026','font-size':'25px'});
            $iconnotiv.appendTo($divmedia);

            $divtext = jQuery('<div />');
            $divtext.addClass('media-body');
            $divtext.html(item.data[key].text);
            $divtext.appendTo($divmedia);

            methodsNotif.data_notiv.push(item.data[key]);
        }
        if (item.notif)
            $('.notif .status').addClass('ijo');
    },
    remove: function(item){
        var $o = this;
        if(item.key == 'id'){
            var data = $.grep(methodsNotif.data_notiv, function(e){ 
                return e.id != item.value;
            });
            methodsNotif.data_notiv = data;
            $o.find('div.media[idnotiv='+ item.value +']').remove('');
        } else {
            var data = $.grep(methodsNotif.data_notiv, function(e){ 
                return e.text != item.value;
            });
            methodsNotif.data_notiv = data;
            $o.find('div.media').remove(":contains('"+ item.value +"')");
        }
    },
    clear: function(item){
        var $o = this;
        $o.empty();
        methodsNotif.data_notiv = [];
    },
    get: function(){
        return methodsNotif.data_notiv;
    }
}

$.fn.ecNotif = function (method) {
    if (method == 'get')
        return methodsNotif[method].apply(this, Array.prototype.slice.call(arguments, 1));
    else
        methodsNotif[method].apply(this, Array.prototype.slice.call(arguments, 1));
}
