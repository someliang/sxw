/**
 * Created with JetBrains WebStorm.
 * User: lonso
 * Date: 13-12-11
 * Time: 下午4:56
 * To change this template use File | Settings | File Templates.
 */

var app = angular.module('cms', ['ngRoute', 'ngResource', 'angularFileUpload'], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
    _title: function (title) {
        var $title = this.options.title || '&nbsp;'
        if (("title_html" in this.options) && this.options.title_html == true)
            title.html($title);
        else title.text($title);
    }
}));

//MESSAGE DIALOG
function messageDialog(message) {
    var messageHtml =
        '<div class="dialog" id="dialog-publish">' +
            '  <p>' +
            '    <span class="ui-icon ui-icon-circle-check" style="float: left; margin: 0 7px 0 0;"></span>' + message +
            '  </p>' +
            '</div>';
    return $(messageHtml).dialog({
        resizable: false,
        title: "<div class='widget-header'><h4 class='smaller'><i class='icon-warning-sign red'></i>提示</h4></div>",
        title_html: true,
        width: 300,
        height: 160,
        modal: true,
        show: {
            effect: 'fade',
            duration: 300
        }, close: function (event, ui) {
            $(this).dialog("destroy");
        },
        buttons: [
            {
                text: "确定",
                "class": "btn btn-primary btn-xs",
                click: function () {
                    $(this).dialog("close");
                }
            }
        ]
    });
}

function completeMessage(response, listId, message) {
    if (response.responseJSON.isSuccess) {
        messageDialog(message);
    } else {
        if (response.responseJSON.errorMessage) {
            messageDialog(response.responseJSON.errorMessage);
        } else {
            messageDialog("出错了.Oops....！！");
        }
    }
    $('#' + listId).trigger("reloadGrid").setGridParam({datatype: 'json', page: 1}).trigger('reloadGrid');
}

function dateValidation(value){
    return /^(\d{4})[-\/](\d{2})[-\/](\d{2})$/.exec(value);
}


//GET SELECT INFO
function getCategory($http, cb){
    $http({
        method  : 'GET',
        url     : '/getCategory',
        headers : { 'Content-Type': 'application/json' }  // set the headers so angular passing info as form data (not request payload)
    }).success(function(data) {
            if (!data.isSuccess) {
                messageDialog('获取类别出错,请重新获取!!');
            }
            cb(data.rows);
        });
}

function getLinkCategory($http, cb){
    $http({
        method: 'GET',
        url: '/getLinkCategory',
        'Content-Type': 'application/json'
    }).
        success(function (data) {
            if (data.isSuccess) {
                cb(data.items);
            } else {
                messageDialog('获取链接类别出错了!!');
                return;
            }
        }).
        error(function () {
            messageDialog('获取链接类别出错了!!');
            return;
        });
}

function getCities($http, cb){
    $http({
        method  : 'GET',
        url     : '/cities',
        headers : { 'Content-Type': 'application/json' }  // set the headers so angular passing info as form data (not request payload)
    }).success(function(data) {
            if (!data.isSuccess) {
                messageDialog('获取类别出错,请重新获取!!');
            }
            cb(data.rows);
    });
}

//UI SETTING

function initDatepicker(domId, $scope){
    $( '#' + domId ).datepicker({
        showOtherMonths: true,
        selectOtherMonths: false,
        dateFormat: 'yy-mm-dd',
        beforeShow: function() {
            setTimeout(function(){
                $('#ui-datepicker-div').css("z-index", 9999);
            }, 0);
        },
        onSelect: function(value) {
            if (window.angular && angular.element)
                angular.element(this).controller("ngModel").$setViewValue(value);
        }
    })
}

function imageTypeCheck(files){
    var allowed_files = [];
    for(var i = 0 ; i < files.length; i++) {
        var file = files[i];
        if(typeof file === "string") {
            //IE8 and browsers that don't support File Object
            if(! (/\.(jpe?g|png|gif|bmp)$/i).test(file) ) return false;
        }
        else {
            var type = $.trim(file.type);
            if( ( type.length > 0 && ! (/^image\/(jpe?g|png|gif|bmp)$/i).test(type) )
                || ( type.length == 0 && ! (/\.(jpe?g|png|gif|bmp)$/i).test(file.name) )//for android's default browser which gives an empty string for file.type
                ) continue;//not an image so don't keep this file
        }

        allowed_files.push(file);
    }
    if(allowed_files.length == 0) return false;
    return allowed_files;
}

function initFileInput(domId, flag) {
    $(domId).ace_file_input({
        no_file:'No File ...',
        btn_choose:'选择',
        btn_change:'修改',
        droppable:false,
        thumbnail:false, //| true | large
        before_change: function(files) {
            if (flag) {
                return imageTypeCheck(files);
            } else {
                return files;
            }
        }
    });
}


function imageFormat(cellvalue, options, rowObject ){
    if (cellvalue) {
        return '<img  style="width: 200;height: 200px;" src='+cellvalue+' />';
    } else {
        return '';
    }
}

function booleanFormat(cellvalue, options, rowObject){
    if (cellvalue) {
        return '是';
    } else {
        return '否';
    }
}

function scienceFormat(cellvalue, options, rowObject){
    if (cellvalue) {
        return '文科';
    } else {
        return '理科';
    }
}

function dateFormat(cellvalue, options, rowObject) {
    return new Date (cellvalue).toLocaleDateString();
}

function contentFormat(cellvalue, options, rowObject) {
    return '<div style="height: 100px;">' + cellvalue + '</div>';
}

function validateNumber(value){
    return !(new RegExp("^[0-9]*$").test(value));
}

function validateNumberUrl(str_url) {
    var re = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|(www\\.)?){1}([0-9A-Za-z-\\.@:%_\‌​+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
    if (re.test(str_url)) {
        return (true);
    } else {
        return (false);
    }
}


//jQgrid COMMON SETTINGS


function styleCheckbox(table) {
    $(table).find('input:checkbox').addClass('ace')
        .wrap('<label />')
        .after('<span class="lbl align-top" />');


    $('.ui-jqgrid-labels th[id*="_cb"]:first-child')
        .find('input.cbox[type=checkbox]').addClass('ace')
        .wrap('<label />').after('<span class="lbl align-top" />');
}

function updateActionIcons(table) {
    var replacement =
    {
        'ui-icon-pencil': 'icon-pencil blue',
        'ui-icon-trash': 'icon-trash red',
        'ui-icon-disk': 'icon-ok green',
        'ui-icon-cancel': 'icon-remove red'
    };
    $(table).find('.ui-pg-div span.ui-icon').each(function () {
        var icon = $(this);
        var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
        if ($class in replacement) icon.attr('class', 'ui-icon ' + replacement[$class]);
    })
}
function updatePagerIcons(table) {
    var replacement =
    {
        'ui-icon-seek-first': 'icon-double-angle-left bigger-140',
        'ui-icon-seek-prev': 'icon-angle-left bigger-140',
        'ui-icon-seek-next': 'icon-angle-right bigger-140',
        'ui-icon-seek-end': 'icon-double-angle-right bigger-140'
    };
    $('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function () {
        var icon = $(this);
        var $class = $.trim(icon.attr('class').replace('ui-icon', ''));

        if ($class in replacement) icon.attr('class', 'ui-icon ' + replacement[$class]);
    })
}

function enableTooltips(table) {
    $('.navtable .ui-pg-button').tooltip({container: 'body'});
    $(table).find('.ui-pg-div').tooltip({container: 'body'});
}

function style_edit_form(form) {
    //enable datepicker on "sdate" field and switches for "stock" field
    form.find('input[name=sdate]').datepicker({format: 'yyyy-mm-dd', autoclose: true})
        .end().find('input[name=stock]')
        .addClass('ace ace-switch ace-switch-5').wrap('<label class="inline" />').after('<span class="lbl"></span>');

    //update buttons classes
    var buttons = form.next().find('.EditButton .fm-button');
    buttons.addClass('btn btn-sm').find('[class*="-icon"]').remove();//ui-icon, s-icon
    buttons.eq(0).addClass('btn-primary').prepend('<i class="icon-ok"></i>');
    buttons.eq(1).prepend('<i class="icon-remove"></i>');

    buttons = form.next().find('.navButton a');
    buttons.find('.ui-icon').remove();
    buttons.eq(0).append('<i class="icon-chevron-left"></i>');
    buttons.eq(1).append('<i class="icon-chevron-right"></i>');
}

function style_delete_form(form) {
    var buttons = form.next().find('.EditButton .fm-button');
    buttons.addClass('btn btn-sm').find('[class*="-icon"]').remove();//ui-icon, s-icon
    buttons.eq(0).addClass('btn-danger').prepend('<i class="icon-trash"></i>');
    buttons.eq(1).prepend('<i class="icon-remove"></i>')
}

function style_search_filters(form) {
    form.find('.delete-rule').val('X');
    form.find('.add-rule').addClass('btn btn-xs btn-primary');
    form.find('.add-group').addClass('btn btn-xs btn-success');
    form.find('.delete-group').addClass('btn btn-xs btn-danger');
}
function style_search_form(form) {
    var dialog = form.closest('.ui-jqdialog');
    var buttons = dialog.find('.EditTable');
    buttons.find('.EditButton a[id*="_reset"]').addClass('btn btn-sm btn-info').find('.ui-icon').attr('class', 'icon-retweet');
    buttons.find('.EditButton a[id*="_query"]').addClass('btn btn-sm btn-inverse').find('.ui-icon').attr('class', 'icon-comment-alt');
    buttons.find('.EditButton a[id*="_search"]').addClass('btn btn-sm btn-purple').find('.ui-icon').attr('class', 'icon-search');
}

function jqGridInit(config) {
    $("#" + config.id).jqGrid({
        url: config.url,
        datatype: "json",
        colNames: config.colNames,
        colModel: config.colModel,
        rowNum: 20,
        rownumbers: true,
        rowList: [20, 40, 60],
        pager: '#' + config.pager,
        sortname: 'id',
        height: "180%",
        viewrecords: true,
        sortorder: "desc",
        sortable: true,
        width: "970",
        forceFit: true,
        loadonce: true,
        multiselect: true,
        cellEdit: false,
        multikey: "id",
        caption: config.caption,
        autowidth: true,
        editurl: config.editUrl,
        loadComplete: function () {
            var table = this;
            setTimeout(function () {
                styleCheckbox(table);
                updateActionIcons(table);
                updatePagerIcons(table);
                enableTooltips(table);
            }, 0);
        }

    });
}

function navigationFunction(listId, listPager, config) {
    $('#' + listId).jqGrid('navGrid', '#' + listPager,
        { 	//navbar options
            edit: config.edit,
            editicon: 'icon-pencil blue',
            add: config.add ,
            addicon: 'icon-plus-sign purple',
            del: config.del,
            delicon: 'icon-trash red',
            search: config.serach,
            searchicon: 'icon-search orange',
            refresh: config.refresh,
            refreshicon: 'icon-refresh green',
            view: config.view,
            viewicon: 'icon-zoom-in grey'
        },
        {
            //edit record form
            mtype: 'PUT',
            closeAfterEdit: true,
            recreateForm: true,
            beforeShowForm: function (e) {
                var form = $(e[0]);
                form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />');
                style_edit_form(form);
            },
            afterComplete: function (response) {
                completeMessage(response, listId, '更新成功！！');
            }
        },
        {
            //new record form
            closeAfterAdd: true,
            recreateForm: true,
            viewPagerButtons: false,
            beforeShowForm: function (e) {
                var form = $(e[0]);
                form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />');
                style_edit_form(form);
            },
            afterComplete: function (response) {
                completeMessage(response, listId, '添加成功！！');
            }
        },
        {
            //delete record form
            recreateForm: true,
            mtype: 'DELETE',
            beforeShowForm: function (e) {
                var form = $(e[0]);
                if (form.data('styled')) return false;
                form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />');
                style_delete_form(form);
                form.data('styled', true);
            },
            afterComplete: function (response) {
                if(response.responseJSON.isNotAllown){
                    messageDialog("ID为:"+response.responseJSON.flagId + "的记录,有子类别存在,请确认后再删除.");
                    $('#' + listId).trigger("reloadGrid").setGridParam({datatype: 'json', page: 1}).trigger('reloadGrid');
                }else{
                    completeMessage(response, listId, '删除成功！！');
                }

            }
        },
        {
            //search form
            recreateForm: true,
            afterShowSearch: function (e) {
                var form = $(e[0]);
                form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />');
                style_search_form(form);
            },
            afterRedraw: function () {
                style_search_filters($(this));
            },
            multipleSearch: true
            /**
             multipleGroup:true,
             showQuery: true
             */
        },
        {
            //view record form
            recreateForm: true,
            width: '40%',
            beforeShowForm: function (e) {
                var form = $(e[0]);
                form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
            }
        }
    );
}



