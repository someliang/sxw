/**
 * Created with JetBrains WebStorm.
 * User: lonso
 * Date: 1/14/14
 * Email: lonso@foxmail.com
 * God Bless !.
 */

app.controller('translationController', function($scope,  $http){
});

//translation
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/translation/list', {
            controller : translationVList,
            templateUrl: '/translation/list'
        })
        .when('/translation/new', {
            controller : translationVNew,
            templateUrl: '/translation/new'
        })
}]);

function translationVList ($http){
    var jqgridConfig = {};
    jqgridConfig.id = 'translationList';
    jqgridConfig.pager = 'translationPager';
    jqgridConfig.url = '/translations';
    jqgridConfig.colNames =  ['ID', '标识编码','父ID', '名称', '优先级'];
    jqgridConfig.colModel = [
        {name: 'id', index: 'id', width: 25},
        {name: 'code', index: 'code', editable: true, editrules: {required: true}, width: 30},
        {name: 'category', index: 'category', editable: true, width: 45, editoptions: {
            dataInit : function (elem) {
                $(elem ).autocomplete({
                    source: function( request, response ) {
                        $http({
                            method: 'get',
                            url: '/getCategory',
                            params: {name_startsWith: request.term},
                            headers: { 'Content-Type': 'application/json' }  // set the headers so angular passing info as form data (not request payload)
                        }).success(function(data) {
                                response( $.map( data.rows, function( item ) {
                                    return {
                                        label: item.name,
                                        value: item.name,
                                        name: item.categoryName,
                                        id:item.id
                                    }
                                }));
                            });
                    },
                    minLength: 1,
                    select: function( event, ui ) {
                    },
                    open: function() {
                        $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
                    },
                    close: function() {
                        $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
                    }
                });
            }
        }

        },
        {name: 'name', index: 'name', editable: true, editrules: {required: true}, width: 45},
        {name: 'priority', index: 'priority',  editrules: {integer: true}, editable: true, width: 45}
    ];
    jqgridConfig.caption = '基础信息列表';
    jqgridConfig.editUrl = '/translation';
    jqGridInit(jqgridConfig);
    var navigatorConfig = {};
    navigatorConfig.edit = true;
    navigatorConfig.add = true;
    navigatorConfig.del = true;
    navigatorConfig.serach = true;
    navigatorConfig.view = true;
    navigatorConfig.refresh = true;
    navigationFunction('translationList', 'translationPager', navigatorConfig);

}

function translationVNew($scope, $http){
    $scope.translation={};
    $( "#categoryName" ).autocomplete({
        source: function( request, response ) {
            $http({
                method: 'get',
                url: '/getCategory',
                params: {name_startsWith: request.term},
                headers: { 'Content-Type': 'application/json' }  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data) {
                    response( $.map( data.rows, function( item ) {
                        return {
                            label: item.name,
                            value: item.name,
                            name: item.categoryName,
                            id:item.id
                        }
                    }));
                });
        },
        minLength: 1,
        select: function( event, ui ) {
            $scope.translation.categoryId = ui.item.id;
        },
        open: function() {
            $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
        },
        close: function() {
            $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
        }
    });
    $scope.create = function(){
        var categoryName = $("#categoryName").val();
        if (!$scope.translation.code ){
            messageDialog('请填写正确的标识编码.');
        } else if (!$scope.translation.name){
            messageDialog('请填写正确的描述信息.');
        } else {
            if ($scope.translation.priority) {
                if (validateNumber($scope.translation.priority)) {
                    messageDialog('优先级必须是正确的整数哦.');
                    return;
                }
            }
            $scope.translation.categoryName = categoryName;
            $http({
                method  : 'POST',
                url     : '/translation',
                data    : $scope.translation,  // pass in data as strings
                headers : { 'Content-Type': 'application/json' }  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data) {
                    if (data.isSuccess) {
                        messageDialog('添加成功');
                    } else if(data.errorMessage) {
                        messageDialog(data.errorMessage);
                    } else {
                        messageDialog('添加失败,请填写正确的内容!!');
                    }
                });
        }
    };
}










