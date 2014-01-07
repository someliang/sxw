/**
 * Created with JetBrains WebStorm.
 * User: lonso
 * Date: 1/7/14
 * Email: lonso@foxmail.com
 * God Bless !.
 */

app.controller('schoolController', function ($scope, $http) {
});

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/school/new', {
            controller: schoolVNew,
            templateUrl: '/school/new'
        })
        .when('/school/list', {
            controller: schoolVList,
            templateUrl: '/school/list'
        })
}]);

function getProvinces($http, cb){
    $http({
        method: 'GET',
        url: '/getProvinces',
        'Content-Type': 'application/json'
    }).success(function(data){
            if (data.isSuccess) {
                cb(data.items);
            } else if (data.errorMessage) {
                messageDialog(data.errorMessage)
            } else {
                messageDialog('获取省份信息出错了,请重新尝试.')
            }
        }).error(function(){
            messageDialog('获取省份信息出错了,请重新尝试.')
        })
}

function getSchoolCategories($http, cb){
    $http({
        method: 'GET',
        url: '/getSchoolCategories',
        'Content-Type': 'application/json'
    }).success(function(data){
            if (data.isSuccess) {
                cb(data.items);
            } else if (data.errorMessage) {
                messageDialog(data.errorMessage)
            } else {
                messageDialog('获取学校类别信息出错了,请重新尝试.')
            }
        }).error(function(){
            messageDialog('获取学校类别信息出错了,请重新尝试.')
        })
}

function getSchoolCharacters($http, cb){
    $http({
        method: 'GET',
        url: '/getSchoolCharacters',
        'Content-Type': 'application/json'
    }).success(function(data){
            if (data.isSuccess) {
                cb(data.items);
            } else if (data.errorMessage) {
                messageDialog(data.errorMessage)
            } else {
                messageDialog('获取特征信息出错了,请重新尝试.')
            }
        }).error(function(){
            messageDialog('获取特征信息出错了,请重新尝试.')
        })
}

function schoolVNew($scope, $http, $upload){
    initFileInput('#badge', true);
    var ue = new UE.ui.Editor();
    ue.render('description');
    $scope.school = {};
    $scope.school.characterIds = '';
    $('div.formCoverDiv a.remove').on('click', function(){
        $scope.school.badge = '';
    });
    $scope.onFileSelect = function($files) {
        for (var i = 0; i < $files.length; i++) {
            $scope.school.badge = $files[i];
        }
    };

    getProvinces($http, function(items){
        $scope.provinces = items;

    });
    getSchoolCategories($http, function(items){
        $scope.categories = items;
    });
    getSchoolCharacters($http, function(items){
        $scope.characters = items;
    });
    $scope.create = function(){
        if (!$scope.school.name) {
            messageDialog('学校名称必填.');
        } else if (!$scope.school.province) {
            messageDialog('学校所在省份必填.');
        } else if (!$scope.school.category) {
            messageDialog('学校类别必填.');
        } else if (!$scope.school.summary) {
            messageDialog('学校简介必填.')
        } else if(!$scope.school.badge) {
            messageDialog('校徽图片必选.')
        } else if(!ue.getContent()) {
            messageDialog('学校详情必填.')
        } else {
            $scope.school.description = ue.getContent();
            $("div.schoolCharacter input.character:checked").each(function(){
                $scope.school.characterIds += $(this).val() + ',';
            });
            $scope.upload = $upload.upload({
                url: '/school',
                method: 'POST',
                data: $scope.school,
                file: $scope.school.badge
            }).success(function(data) {
                    $scope.school.characterIds = '';
                    if (data.isSuccess) {
                        messageDialog('添加成功');
                    } else if(data.errorMessage) {
                        messageDialog(data.errorMessage);
                    } else {
                        messageDialog('添加失败,请填写正确的内容!!');
                    }
                })
                .error(function(){
                    messageDialog('添加失败,出错了..Oops..!!');
                });
        }
    }


}

function schoolVList(){

}
