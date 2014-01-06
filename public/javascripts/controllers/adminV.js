/**
 * God bless.
 * User: lonso
 * Email: lonso@foxmail.com
 * Date: 13-12-31
 * Time: 下午12:32
 */
app.controller('adminController', function ($scope, $http) {
});



app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/admin/user/new', {
            controller: userVNew,
            templateUrl: '/admin/user/new'
        })
        .when('/admin/user/list', {
            controller: userVList,
            templateUrl: '/admin/user/list'
        })


}]);

function userVNew($scope, $http) {
    $scope.user = {};
    $scope.create = function(){
        if (!$scope.user.username) {
            messageDialog('请输入用户名.')
        } else if (!$scope.user.password) {
            messageDialog('请输入密码.')
        } else if (!$scope.user.confirmPassword) {
            messageDialog('请输入确认密码.')
        } else if($scope.user.password.length <6 || $scope.user.confirmPassword.length <6) {
            messageDialog('密码长度不能小于6位.')
        } else if (!($scope.user.password === $scope.user.confirmPassword)) {
            messageDialog('两次输入密码不一致.')
        } else {
           $http({
               method: 'POST',
               url: '/admin/user',
               data: $scope.user,
               headers: { 'Content-Type': 'application/json' }
           }).success(function(data){
                if (data.isSuccess) {
                   messageDialog('添加用户成功')
                } else {
                   if (data.errorMessage) {
                       messageDialog(data.errorMessage);
                   } else {
                       messageDialog('添加用户失败');
                   }
                }
           }).error(function(data){
                messageDialog('添加用户失败');
           });
        }
    }
}

function userVList(){
    var jqgridConfig = {};
    jqgridConfig.id = 'userList';
    jqgridConfig.pager = 'userPager';
    jqgridConfig.url = '/admin/users';
    jqgridConfig.colNames =  ['ID', '用户名', '密码', '确认密码', '是否是超级管理员'];
    jqgridConfig.colModel = [
        {name: 'id', index: 'id', width: 25},
        {name: 'username', index: 'username', editable: true, editoptions: { readonly: 'readonly' }, editrules: {required: true}, width: 30},
        {name: 'password', index: 'password', editable: true, edittype:'password', editrules: {required: true, edithidden: true}, hidden: true, width: 30},
        {name: 'confirmPassword', index: 'confirmPassword', editable: true, edittype:'password', editrules: {edithidden: true}, hidden: true},
        {name: 'is_admin', index: 'is_admin',  editable: true, edittype: 'checkbox',  editoptions: { value:"true:false" }, width: 30}

    ];
    jqgridConfig.caption = '用户列表';
    jqgridConfig.editUrl = '/admin/user';
    jqGridInit(jqgridConfig);
    var navigatorConfig = {};
    navigatorConfig.edit = true;
    navigatorConfig.add = true;
    navigatorConfig.del = true;
    navigatorConfig.serach = true;
    navigatorConfig.view = true;
    navigatorConfig.refresh = true;
    navigationFunction('userList', 'userPager', navigatorConfig);
}

