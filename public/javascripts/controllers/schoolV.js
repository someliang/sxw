/**
 * Created with JetBrains WebStorm.
 * User: lonso
 * Date: 1/7/14
 * Email: lonso@foxmail.com
 * God Bless !.
 */

app.controller('schoolController', function ($scope, $http) {
});


var item = '';
var major = '';
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
        .when('/school/update', {
            controller: schoolVUpdate,
            templateUrl: '/school/update'
        })
        .when('/school/major/new', {
            controller: majorVNew,
            templateUrl: '/school/major/new'
        })
        .when('/school/major/update', {
            controller: majorVUpdate,
            templateUrl: '/school/major/update'
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

function getVintages($http, cb){
    $http({
        method: 'GET',
        url: '/getVintages',
        'Content-Type': 'application/json'
    }).success(function(data){
            if (data.isSuccess) {
                cb(data.items);
            } else if (data.errorMessage) {
                messageDialog(data.errorMessage)
            } else {
                messageDialog('获取年份信息出错了,请重新尝试.')
            }
        }).error(function(){
            messageDialog('获取年份信息出错了,请重新尝试.')
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

function getMajorCharacters($http, cb){
    $http({
        method: 'GET',
        url: '/getMajorCharacters',
        'Content-Type': 'application/json'
    }).success(function(data){
            if (data.isSuccess) {
                cb(data.items);
            } else if (data.errorMessage) {
                messageDialog(data.errorMessage)
            } else {
                messageDialog('获取专业特征信息出错了,请重新尝试.')
            }
        }).error(function(){
            messageDialog('获取专业特征信息出错了,请重新尝试.')
        })
}

function getMajorCategories($http, cb){
    $http({
        method: 'GET',
        url: '/getMajorCategories',
        'Content-Type': 'application/json'
    }).success(function(data){
            if (data.isSuccess) {
                cb(data.items);
            } else if (data.errorMessage) {
                messageDialog(data.errorMessage)
            } else {
                messageDialog('获取专业类别出错了,请重新尝试.')
            }
        }).error(function(){
            messageDialog('获取专业类别出错了,请重新尝试.')
        })
}

function getGrades($http, cb){
    $http({
        method: 'GET',
        url: '/getGrades',
        'Content-Type': 'application/json'
    }).success(function(data){
            if (data.isSuccess) {
                cb(data.items);
            } else if (data.errorMessage) {
                messageDialog(data.errorMessage)
            } else {
                messageDialog('获取录取批次类别出错了,请重新尝试.')
            }
        }).error(function(){
            messageDialog('获取录取批次别出错了,请重新尝试.')
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

    getVintages($http, function(items){
        $scope.vintages = items;
    });

    getGrades($http, function(items){
        $scope.grades = items;
    });

    getMajorCharacters($http, function(items){
        $scope.recruitCharacters = items;
    });

    getSchoolCategories($http, function(items){
        $scope.categories = items;
    });
    getSchoolCharacters($http, function(items){
        $scope.characters = items;
    });

    $scope.detailForms = [];
    $scope.addDetail = function(){
        $scope.detailForms.push({});
    };
    $scope.deleteDetail = function(index){
        $scope.detailForms.splice(index, 1);
    };
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
            $('div.schoolCharacter input.character:checked').each(function(){
                $scope.school.characterIds += $(this).val() + ',';
            });
            if ($scope.school.priority && !parseInt($scope.school.priority)){
                messageDialog('推荐值必须是整数.')
            } else {
                var details = [];
                var flag = true;
                $('tr.detail').each(function(){
                    var vintageIndex = $(this).find('select.vintage').val();
                    var locationIndex = $(this).find('select.location').val();
                    var gradeIndex = $(this).find('select.grade').val();
                    var shift = $(this).find('input.shift').val();
                    var admission = $(this).find('input.admission').val();
                    var average = $(this).find('input.average').val();
                    var scienceIndex = $(this).find('select.recruitCharacter').val();
                    var vintage = '';
                    if (vintageIndex) {
                        vintage = $scope.vintages[vintageIndex].name ;
                    }
                    var location = '' ;
                    if(locationIndex) {
                        location = $scope.provinces[locationIndex].id;
                    }
                    var science = '';
                    if (scienceIndex) {
                        science = $scope.recruitCharacters[scienceIndex].id;
                    }

                    var grade = '';
                    if (gradeIndex) {
                        grade = $scope.grades[gradeIndex].id
                    }

                    if (!vintage && !location && !grade && !shift && !admission && !average) {
                        return true;
                    } else {
                        if (!science){
                            flag = false;
                            messageDialog('必须选择招生所对应的类别(即文/理/艺).');
                        } else if (!vintage) {
                            flag = false;
                            messageDialog('招生年份必填.');
                        } else if (!location){
                            flag = false;
                            messageDialog('招生地区必填.');
                        } else if(!grade) {
                            flag = false;
                            messageDialog('招生批次必填.');
                        } else if(!shift) {
                            flag = false;
                            messageDialog('调档线必填.');
                        } else if (shift && !parseInt(shift)){
                            flag = false;
                            messageDialog('调档线必须是整数.');
                        } else if(!admission)  {
                            flag = false;
                            messageDialog('实录线必填.');
                        } else if (admission && !parseInt(admission)){
                            flag = false;
                            messageDialog('实录线必须是整数.');
                        } else if (!average) {
                            flag = false;
                            messageDialog('平均线必填.');
                        } else if (average && !parseInt(average)){
                            flag = false;
                            messageDialog('平均线必须是整数.');
                        } else {
                            var detail =  {};
                            detail.vintage = vintage;
                            detail.location = location;
                            detail.grade = grade;
                            detail.shift = shift;
                            detail.admission = admission;
                            detail.average = average;
                            detail.science = science;
                            details.push(detail);
                        }
                    }
                });
                if (flag) {
                    $scope.school.details = details;
                    $scope.upload = $upload.upload({
                        url: '/school',
                        method: 'POST',
                        data: $scope.school,
                        file: $scope.school.badge
                    }).success(function(data) {
                            $scope.school.characterIds = '';
                            if (data.isSuccess) {
                                item = data.item;
                                location.href = '#/school/major/new';
                            } else if(data.errorMessage) {
                                messageDialog(data.errorMessage);
                            } else {
                                messageDialog('添加失败,请填写正确的内容!!');
                            }
                        })
                        .error(function(){
                            messageDialog('添加失败,出错了..Oops..!!');
                        });
                } else {
                    return false;
                }
            }
        }
    }
}

function schoolVList($scope, $http){
    var jqgridConfig = {};
    jqgridConfig.id = 'schoolList';
    jqgridConfig.pager = 'schoolPager';
    jqgridConfig.url = '/schools';
    jqgridConfig.colNames =  ['ID', '学校名称', '学校所属省份', '学校类别', '推荐值', '校徽', '学校简介'];
    jqgridConfig.colModel = [
        {name: 'id', index: 'id', width: 25},
        {name: 'name', index: 'name', editable: true, editrules: {required: true}, width: 30},
        {name: 'province', index: 'province', editable: true, editrules: {required: true}, width: 30},
        {name: 'category', index: 'category', editable: true, editrules: {required: true}, width: 30},
        {name: 'priority', index: 'priority', editable: true, editrules: {required: true}, width: 30},
        {name: 'badge', index: 'badge', search: false, formatter: imageFormat, editable: true, width: 42},
        {name: 'summary', index: 'summary', editable: true, editrules: {required: true}, width: 30}
    ];
    jqgridConfig.caption = '学校列表';
    jqgridConfig.editUrl = '/school';
    jqGridInit(jqgridConfig);
    var navigatorConfig = {};
    navigatorConfig.edit = false;
    navigatorConfig.add = false;
    navigatorConfig.del = true;
    navigatorConfig.serach = true;
    navigatorConfig.view = true;
    navigatorConfig.refresh = true;
    navigationFunction('schoolList', 'schoolPager', navigatorConfig);



    $scope.update = function() {
        var rs = $('#schoolList').jqGrid('getGridParam','selarrrow');
        if (rs.length <1) {
            messageDialog('亲,至少要选择一个吧!');
            return;
        } else if (rs.length !== 1) {
            messageDialog('亲,不要太贪心哦,一次只能修改一个!');
            return;
        } else {
            $http({
                method  : 'get',
                url     : '/school',
                params : { id: rs},
                headers : { 'Content-Type': 'application/json' }  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data){
                    if (!data.isSuccess) {
                        messageDialog('Oops....出错了,请重新尝试');
                        return;
                    } else {
                        item = data.item;
                        location.href = '#/school/update';
                    }
                }).error(function(data) {
                    messageDialog('Oops....出错了,请重新尝试');
                    return;
                });
        }
    }
}

function schoolVUpdate($scope, $http, $upload){
    var ue = new UE.ui.Editor();
    ue.render('description');
    if (!item) {
        messageDialog('亲,你还没选择要修改的内容呢!!');
        return;
    } else {
        $scope.school = item;
        $scope.imagePath = item.badge;
    }
    ue.addListener('ready', function () {
        ue.setContent(item.description);
    });
    initFileInput('#badge', true);
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

    var jqgridConfig = {};
    jqgridConfig.id = 'schoolDetailList';
    jqgridConfig.pager = 'schoolDetailPager';
    jqgridConfig.url = '/schoolDetails/' + item.id;
    jqgridConfig.colNames = ['ID', '招生年份', '招生地区', '招生批次', '调档线', '实录线', '平均线', '文理科'];
    jqgridConfig.colModel = [
        {name: 'id', index: 'id', hidden: true, width: 25},
        {name: 'vintage', index: 'vintage', edittype: 'select', formatter: 'date',
            formatoptions: { newformat: 'Y-m-d'},
            editable: true,
            editrules: {required: true}, width: 30,
            editoptions: {
                dataUrl: '/getVintageSelectStyle'
            }
        },
        {name: 'location', index: 'location', edittype: 'select', editable: true, editrules: {required: true}, width: 30,
            editoptions: {
                dataUrl: '/getLocationSelectStyle'
            }
        },
        {name: 'grade', index: 'grade', edittype: 'select', editable: true, editrules: {required: true}, width: 30,
            editoptions: {
                dataUrl: '/getGradeSelectStyle'
            }
        },
        {name: 'shift', index: 'shift', editable: true, editrules: {required: true}, width: 30},
        {name: 'admission', index: 'admission', editable: true, editrules: {required: true}, width: 30},
        {name: 'average', index: 'average', editable: true, editrules: {required: true}, width: 30},
        {name: 'science', index: 'science', editable: true, edittype: 'checkbox', editoptions: { value:"文科:理科" },
            formatter: scienceFormat, editrules: {required: true}, width: 30}
    ];
    jqgridConfig.caption = '历年学校招生情况列表';
    jqgridConfig.editUrl = '/schoolDetail/' + item.id;
    jqGridInit(jqgridConfig);
    var navigatorConfig = {};
    navigatorConfig.edit = true;
    navigatorConfig.add = true;
    navigatorConfig.del = true;
    navigatorConfig.serach = true;
    navigatorConfig.view = true;
    navigatorConfig.refresh = true;
    navigationFunction('schoolDetailList', 'schoolDetailPager', navigatorConfig);



    var jqgridMajorConfig = {};
    jqgridMajorConfig.id = 'majorDetailList';
    jqgridMajorConfig.pager = 'majorDetailPager';
    jqgridMajorConfig.url = '/majorDetails/'+item.id;
    jqgridMajorConfig.colNames =  ['ID', '专业名', '招生年份', '招生地区', '招生批次', '调档线', '实录线', '平均线'];
    jqgridMajorConfig.colModel = [
        {name: 'id', index: 'id', width: 25},
        {name: 'name', index: 'name', editable: true, editrules: {required: true}, width: 30},
        {name: 'vintage', index: 'vintage', formatter: 'date', formatoptions: { newformat: 'Y-m-d'}, editable: true, editrules: {required: true}, width: 30},
        {name: 'location', index: 'location', editable: true, editrules: {required: true}, width: 30},
        {name: 'grade', index: 'grade', editable: true, editrules: {required: true}, width: 30},
        {name: 'shift', index: 'shift', editable: true, editrules: {required: true}, width: 30},
        {name: 'admission', index: 'admission', editable: true, editrules: {required: true}, width: 30},
        {name: 'average', index: 'average', editable: true, editrules: {required: true}, width: 30}
    ];
    jqgridMajorConfig.caption = '历年专业招生情况列表';
    jqgridMajorConfig.editUrl = '/majorDetail';
    jqGridInit(jqgridMajorConfig);
    var navigatorMajorConfig = {};
    navigatorMajorConfig.edit = false;
    navigatorMajorConfig.add = false;
    navigatorMajorConfig.del = true;
    navigatorMajorConfig.serach = true;
    navigatorMajorConfig.view = true;
    navigatorMajorConfig.refresh = true;
    navigationFunction('majorDetailList', 'majorDetailPager', navigatorMajorConfig);


    $("#majorDetailList").jqGrid()
        .navButtonAdd('#majorDetailPager', {
            buttonicon: "ui-icon icon-pencil blue",
            caption: '',
            position: "first",
            title: "编辑所选记录",
            onClickButton: function () {
                var rs = $("#majorDetailList").jqGrid('getGridParam', 'selarrrow');
                if (rs.length === 1) {
                    $http({
                        method: 'GET',
                        url: '/school/major',
                        params: {id: rs},
                        'Content-Type': 'application/json'
                    }).success(function (data) {
                            if (data.isSuccess) {
                                major = data.item;
                                location.href = '#/school/major/update';
                            } else {
                                messageDialog('获取专业招生详情出错了,请重新试试.');
                            }
                        })
                        .error(function(){
                            messageDialog('获取专业招生详情出错了,请重新试试.');
                        })
                } else {
                    messageDialog('亲,必须并且只能操作一个哦!');
                    return false;
                }
            }
        });

    $("#majorDetailList").jqGrid()
        .navButtonAdd('#majorDetailPager', {
            buttonicon : "ui-icon icon-plus-sign purple",
            caption: '',
            position : "first",
            title : "添加新记录",
            onClickButton : function() {
                location.href = '#/school/major/new';
            }
        });




    $scope.save = function(){
        if (!$scope.school.name) {
            messageDialog('学校名称必填.');
        } else if (!$scope.school.province) {
            messageDialog('学校所在省份必填.');
        } else if (!$scope.school.category) {
            messageDialog('学校类别必填.');
        } else if (!$scope.school.summary) {
            messageDialog('学校简介必填.')
        } else if(!ue.getContent()) {
            messageDialog('学校详情必填.')
        } else {
            $scope.school.description = ue.getContent();
            $('div.schoolCharacter input.character:checked').each(function(){
                $scope.school.characterIds += $(this).val() + ',';
            });
            $scope.upload = $upload.upload({
                url: '/school',
                method: 'PUT',
                data: $scope.school,
                file: $scope.school.badge
            }).success(function(data) {
                    $scope.school.characterIds = '';
                    if (data.isSuccess) {
                        messageDialog('更新成功');
                    } else if(data.errorMessage) {
                        messageDialog(data.errorMessage);
                    } else {
                        messageDialog('更新失败,请填写正确的内容!!');
                    }
                })
                .error(function(){
                    messageDialog('更新失败,出错了..Oops..!!');
                });
        }
    }
}


function majorVNew($scope, $http){
    if (!item) {
        messageDialog('亲,你还没选择要修改的内容呢!!');
        return;
    } else {
        $scope.major = {};
        $scope.major.school = item.name;
        $scope.major.schoolId = item.id;
    }
    var ue = new UE.ui.Editor();
    ue.render('description');

    getMajorCategories($http, function(items){
        $scope.categories = items;
    });

    getMajorCharacters($http, function(items){
        $scope.characters = items;
    });


    getProvinces($http, function(items){
        $scope.provinces = items;
    });

    getVintages($http, function(items){
        $scope.vintages = items;
    });

    getGrades($http, function(items){
        $scope.grades = items;
    });

    $scope.detailForms = [];
    $scope.addDetail = function(){
        $scope.detailForms.push({});
    };
    $scope.deleteDetail = function(index){
        $scope.detailForms.splice(index, 1);
    };


    $scope.create = function(){
        if (!$scope.major.name) {
            messageDialog('请输入专业名称.');
        } else if (!$scope.major.category) {
            messageDialog('请选择专业类别称.');
        } else {
            $scope.major.description = ue.getContent();
            if ($scope.major.priority && !parseInt($scope.major.priority)){
                messageDialog('推荐值必须是整数.')
            } else {
                var details = [];
                var flag = true;
                $('tr.detail').each(function(){
                    var vintageIndex = $(this).find('select.vintage').val();
                    var locationIndex = $(this).find('select.location').val();
                    var grade = $(this).find('select.grade').val();
                    var shift = $(this).find('input.shift').val();
                    var admission = $(this).find('input.admission').val();
                    var average = $(this).find('input.average').val();
                    var vintage = '';
                    if (vintageIndex) {
                        vintage = $scope.vintages[vintageIndex].name ;
                    }
                    var location = '' ;
                    if(locationIndex) {
                        location = $scope.provinces[locationIndex].id;
                    }

                    if (!vintage && !location && !grade && !shift && !admission && !average) {
                        return true;
                    } else {
                        if (!vintage) {
                            flag = false;
                            messageDialog('招生年份必填.');
                        } else if (!location){
                            flag = false;
                            messageDialog('招生地区必填.');
                        } else if(!grade) {
                            flag = false;
                            messageDialog('招生批次必填.');
                        } else if(!shift) {
                            flag = false;
                            messageDialog('调档线必填.');
                        } else if (shift && !parseInt(shift)){
                            flag = false;
                            messageDialog('调档线必须是整数.');
                        } else if(!admission)  {
                            flag = false;
                            messageDialog('实录线必填.');
                        } else if (admission && !parseInt(admission)){
                            flag = false;
                            messageDialog('实录线必须是整数.');
                        } else if (!average) {
                            flag = false;
                            messageDialog('平均线必填.');
                        } else if (average && !parseInt(average)){
                            flag = false;
                            messageDialog('平均线必须是整数.');
                        } else {
                            var detail =  {};
                            detail.vintage = vintage;
                            detail.location = location;
                            detail.grade = grade;
                            detail.shift = shift;
                            detail.admission = admission;
                            detail.average = average;
                            details.push(detail);
                        }
                    }
                });
                $scope.major.details = details;
                if (flag) {
                    $http({
                        method: 'POST',
                        url: '/school/major',
                        data: $scope.major,
                        'Content-Type': 'application/json'
                    }).success(function(data){
                            if (data.isSuccess) {
                                messageDialog('添加专业成功.');
                            } else if (data.errorMessage) {
                                messageDialog(data.errorMessage);
                            } else {
                                messageDialog('添加专业出错了,添加专业失败.');
                            }
                        }).error(function(){
                            messageDialog('添加专业出错了,添加专业失败.');
                        })
                } else {
                    return false;
                }
            }
        }
    }
}

function majorVUpdate ($scope, $http){
    if (!item || !major) {
        messageDialog('亲,你还没选择要修改的内容呢!!');
        return;
    } else {
        $scope.major = major;
        $scope.major.school = item.name;
        $scope.major.schoolId = item.id;
    }
    var ue = new UE.ui.Editor();
    ue.render('description');


    var jqgridMajorConfig = {};
    jqgridMajorConfig.id = 'majorDetailList';
    jqgridMajorConfig.pager = 'majorDetailPager';
    jqgridMajorConfig.url = '/major/majorDetails/'+major.id;
    jqgridMajorConfig.colNames =  ['ID', '专业名', '招生年份', '招生地区', '招生批次', '调档线', '实录线', '平均线'];
    jqgridMajorConfig.colModel = [
        {name: 'id', index: 'id', width: 25},
        {name: 'name', index: 'name', editable: true, editrules: {required: true}, width: 30},
        {name: 'vintage', index: 'vintage', formatter: 'date', formatoptions: { newformat: 'Y-m-d'}, editable: true, editrules: {required: true}, width: 30},
        {name: 'location', index: 'location', editable: true, editrules: {required: true}, width: 30},
        {name: 'grade', index: 'grade', editable: true, editrules: {required: true}, width: 30},
        {name: 'shift', index: 'shift', editable: true, editrules: {required: true}, width: 30},
        {name: 'admission', index: 'admission', editable: true, editrules: {required: true}, width: 30},
        {name: 'average', index: 'average', editable: true, editrules: {required: true}, width: 30}
    ];
    jqgridMajorConfig.caption = '历年专业招生情况列表';
    jqgridMajorConfig.editUrl = '/majorDetail';
    jqGridInit(jqgridMajorConfig);
    var navigatorMajorConfig = {};
    navigatorMajorConfig.edit = false;
    navigatorMajorConfig.add = false;
    navigatorMajorConfig.del = true;
    navigatorMajorConfig.serach = true;
    navigatorMajorConfig.view = true;
    navigatorMajorConfig.refresh = true;
    navigationFunction('majorDetailList', 'majorDetailPager', navigatorMajorConfig);
    getMajorCategories($http, function(items){
        $scope.categories = items;
    });

    getMajorCharacters($http, function(items){
        $scope.characters = items;
    });

}