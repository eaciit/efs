fp.templateEfs = {
    _id: "",
    logo: "/res/images/logoeaciittrans.png",
    title: "",
    description: ""
}
function createGalery(arrayData) {
    var pgNum = Math.ceil(arrayData.length / 8), b = [];
    for (var i = 1; i <= pgNum; i++) {
        var take = i * 7;
        var skip = (i - 1) * 8;
        var MainMenues = [];
        for (var j = skip; j <= take; j++) {
            if (typeof arrayData[j] !== "undefined")
                MainMenues.push(arrayData[j]);
        }

        b.push({ PageNumber: i, Contents: MainMenues });
    }
    fp.PageNumber(b);

    var $o = $('div.grid-efs'), arrayGal = fp.PageNumber(), $ihItem, $aGal, $divImg, $img, $info, $conInfo, $colGal, $subTitleGal, $slides;
    $slides = jQuery('<div />');
    $slides.attr('id', 'slides');
    $slides.css("width", "100%");
    $slides.appendTo($o);
    for (key in arrayGal) {
        $cvnIns = jQuery('<div />');
        $cvnIns.addClass('cvnIns');
        $cvnIns.appendTo($slides);

        for (page in arrayGal[key].Contents) {
            $colGal = jQuery('<div />');
            $colGal.addClass('col-sm-3');
            $colGal.css({ 'margin-bottom': '30px' });
            $colGal.appendTo($cvnIns);

            $ihItem = jQuery('<div />');
            $ihItem.addClass('ih-item square effect6 colored bottom_to_top');
            $ihItem.attr({"onclick":"fp.selectEfs('"+arrayGal[key].Contents[page]._id+"')"});
            $ihItem.appendTo($colGal);

            $aGal = jQuery('<a />');
            $aGal.attr({ 'idclient': arrayGal[key].Contents[page]._id });
            $aGal.css('cursor', 'pointer');
            //$aGal.attr();
            $aGal.appendTo($ihItem);

            $divImg = jQuery('<div />');
            $divImg.addClass('img');
            $divImg.appendTo($aGal);

            $img = jQuery('<img />');
            $img.attr({'src': arrayGal[key].Contents[page].logo, 'alt' : 'img'});
            $img.appendTo($divImg);

            $info = jQuery('<div />');
            $info.addClass('info');
            $info.appendTo($aGal);

            $conInfo = jQuery('<div />');
            $conInfo.addClass('boxinfo');
            $conInfo.css({ 'min-height': '60px', 'display': 'table' });
            $conInfo.appendTo($info);

            $titleGal = jQuery('<span />');
            $titleGal.css({ 'display': 'table-row', 'vertical-align': 'middle', 'font-weight' : 'bold' });
            $titleGal.html(arrayGal[key].Contents[page].title);
            $titleGal.appendTo($conInfo);

            $subTitleGal = jQuery('<span />');
            $subTitleGal.css({ 'display': 'table-row', 'vertical-align': 'middle' });
            $subTitleGal.html(arrayGal[key].Contents[page].description);
            $subTitleGal.appendTo($conInfo);
        }
    }

    if (arrayGal.length < 2) {
        $cvnIns = jQuery('<div />');
        $cvnIns.addClass('cvnIns');
        $cvnIns.html('&nbsp;');
        $cvnIns.appendTo($slides);
    }

    $('#slides').slidesjs({
        width: 940,
        height: 528
    });
    setTimeout(function () {
        $(window).trigger('resize');
        $(".slidesjs-previous").addClass("glyphicon glyphicon-arrow-left").html("");
        $(".slidesjs-next").addClass("glyphicon glyphicon-arrow-right").html("");
        if (fp.PageNumber().length < 2) {
            $(".slidesjs-previous").hide();
            $(".slidesjs-next").hide();
        }
    }, 20);
}
fp.selectEfs = function(id){
    fp.tempStatementId(id);
    fp.getDataStatement();
};
fp.backToGrid = function(){
    app.mode("");
};
fp.showAllEfs = function(){
    app.ajaxPost("/statement/getstatement", { search: "" }, function (res) {
        if (!app.isFine(res)) {
            return;
        }
        for (var i in res.data){
            res.data[i] = $.extend({}, fp.templateEfs, res.data[i] || {});
            res.data[i].description = "Element : "+res.data[i].elements.length;
        }
        $('div.grid-efs').empty();
        createGalery(res.data);
    });
};
$(function (){
    fp.showAllEfs();
});