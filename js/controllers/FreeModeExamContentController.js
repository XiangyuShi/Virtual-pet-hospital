/**
 * Created by Nova on 2016/7/10.
 */
var FreeModeExamContentController = function ($scope, $http, $location, $uibModal,$sce) {
    $scope.plugin = new petPlugin();
    $scope.loadmask = $scope.plugin.CreateMask({
        style: 'z-index:9999;',
        id: 'test_Mask',
        loadingImage: true
    });
    //获取知识点ID，知识点名称，模块ID方便update，科室ID，题目ID，答案ID，跳转的页面
    $scope.freeExamId = $location.search().freeExamId;
    $scope.freeExamName = $location.search().freeExamName;
    $scope.freeModuleId = $location.search().freeModuleId;
    $scope.departmentId = $location.search().departmentId;
    $scope.contentNormalDocId = $location.search().contentNormalDocId;
    $scope.answerNormalDocId = $location.search().answerNormalDocId;
    $scope.tid = $location.search().tid;
    //显示题目
    $scope.loadDataContent = function () {
        $scope.loadmask.show();
        $http({
            url: constVar.baseUrl + '/API/NormalDocs/' + $scope.contentNormalDocId + '/Tree?rd=' + Math.random(),
            method: "GET",
            headers: {"Authorization": "admin"},
            dataType: "json"
        }).success(function (d) {
            if (d.meta.code == '200') {
                if (d.data != null) {
                    //要显示的内容，文字、图片、视频
                    $scope.textsContent = d.data.texts;
                    $scope.pictureGroupsContent = d.data.picture_groups;
                    $scope.videoGroupsContent = d.data.video_groups;
                }
                $scope.loadmask.hide();
            }
            else {
                swal({
                    title: "发生错误!",
                    text: d.meta.code + "," + d.meta.msg,
                    type: "error"
                });
            }
        });
    };
    //controller 依赖 $scope, $sce
    $scope.trustSrc = function(url){
        return $sce.trustAsResourceUrl(url);
    }
    //显示答案
    $scope.loadDataAnswer = function () {
        $scope.loadmask.show();
        $http({
            url: constVar.baseUrl + '/API/NormalDocs/' + $scope.answerNormalDocId + '/Tree?rd=' + Math.random(),
            method: "GET",
            headers: {"Authorization": "admin"},
            dataType: "json"
        }).success(function (d) {
            if (d.meta.code == '200') {
                if (d.data != null) {
                    //要显示的内容，文字、图片、视频
                    $scope.textsAnswer = d.data.texts;
                    $scope.pictureGroupsAnswer = d.data.picture_groups;
                    $scope.videoGroupsAnswer = d.data.video_groups;
                }
                $scope.loadmask.hide();
            }
            else {
                swal({
                    title: "发生错误!",
                    text: d.meta.code + "," + d.meta.msg,
                    type: "error"
                });
            }
        });
    };

    $scope.loadDataContent();
    $scope.loadDataAnswer();

    $scope.back = function () {
        $location.search({
            departmentId: $scope.departmentId,
            tid: $scope.tid
        });
        $location.path('/freemodecontent');
    };

    $scope.editContent = function () {
        $location.search({
            //知识点ID，知识点名称，模块ID方便update，科室ID，题目ID，答案ID，跳转的页面
            freeExamId: $scope.freeExamId,
            freeExamName: $scope.freeExamName,
            freeModuleId: $scope.freeModuleId,
            departmentId: $scope.departmentId,
            contentNormalDocId: $scope.contentNormalDocId,
            answerNormalDocId: $scope.answerNormalDocId,
            normalDocId: $scope.contentNormalDocId,
            page: "freeModeExamContent",
            tid: $scope.tid
        });
        $location.path('/operate');
    };
    $scope.editAnswer = function () {
        $location.search({
            freeExamId: $scope.freeExamId,
            freeExamName: $scope.freeExamName,
            freeModuleId: $scope.freeModuleId,
            departmentId: $scope.departmentId,
            contentNormalDocId: $scope.contentNormalDocId,
            answerNormalDocId: $scope.answerNormalDocId,
            normalDocId: $scope.answerNormalDocId,
            page: "freeModeExamContent",
            tid: $scope.tid
        });
        $location.path('/operate');
    };
    //修改后保存知识点标题
    $scope.save = function (isValid) {
        if (!isValid) {
            return;
        }
        $scope.loadmask.show();
        var url = constVar.baseUrl + '/API/FreeExam/' + $scope.freeExamId + '?rd=' + Math.random();
        var data = {
            name: $scope.freeExamName,
            moduleId: $scope.freeModuleId,
            sequence: ""
        };
        $http({
            url: url,
            method: "POST",
            headers: {"Authorization": "admin"},
            dataType: "json",
            data: data
        }).success(function (d) {
            $scope.loadmask.hide();
            if (d.meta.code == '200') {
                swal({
                    title: "保存成功!",
                    text: "该知识点被成功保存",
                    type: "success"
                });
                $scope.back();
            } else {
                swal({
                    title: "修改失败!",
                    text: d.meta.code + "," + d.meta.msg,
                    type: "error"
                });
            }
        }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    }


};