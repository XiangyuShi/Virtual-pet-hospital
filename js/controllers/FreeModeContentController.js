/**
 * Created by Nova on 2016/7/9.
 */
var FreeModeContentController = function ($scope, $http, $location, $uibModal, alertService) {
    //获取到跳转的departmentId
    $scope.departmentId = $location.search().departmentId;
    $scope.tid = $location.search().tid || undefined;
    $scope.plugin = new petPlugin();
    $scope.loadmask = $scope.plugin.CreateMask({
        style: 'z-index:9999;',
        id: 'test_Mask',
        loadingImage: true
    });
    //搜索的关键字
    $scope.postData = {
        name: ''
    };
    $scope.pagging = {
        maxSize: 5,
        pageSize: '10',
        pageIndex: 1,
        pageTotal: 0
    };
    $scope.newOrEditState = 0;//0为新增，1为编辑
    $scope.changeTab = function (tab) {
        //tid模块id
        $scope.tid = tab.id;
        $scope.currentModuleName = tab.name;
        $scope.clear();
    };
    $scope.toogleSearchPanel = function (obj) {
        var c = $('#' + obj).attr('class');
        if (c == 'panel-collapse collapse') {
            $('#' + obj).prev().find('span:eq(0)').attr('class', 'glyphicon glyphicon-chevron-down');
        }
        else {
            $('#' + obj).prev().find('span:eq(0)').attr('class', 'glyphicon glyphicon-chevron-right');
        }
        $scope.isCollapsed = !$scope.isCollapsed;
    };
    $scope.initFreeModule = function () {
        $scope.loadmask.show();
        var url = constVar.baseUrl + 'API/FreeModule/' + $scope.departmentId + '?rd=' + Math.random();
        $http({
            url: url,
            method: "GET",
            headers: {"Authorization": "admin"},
            dataType: "json"
        }).success(function (d) {
            $scope.loadmask.hide();
            if (d.meta.code == '200') {
                $scope.tabs = d.data;
            } else {
                alertService.error(d.meta.code + ',' + d.meta.msg);
            }
        }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    };
    $scope.lockTab = function () {
        if ($scope.tid) {
            for (var i = 0; i < $scope.tabs.length; i++) {
                if ($scope.tabs[i].id == $scope.tid) {
                    $scope.active = i + 1;
                    break;
                }
            }
        }
        else {
            $scope.tid = $scope.tabs[0].id;
            $scope.active = 1;
        }
        $scope.loadData();
    }
    $scope.getCurrentDepartmentName = function () {
        var url = constVar.baseUrl + 'API/Management/Departments/' + $scope.departmentId + '?rd=' + Math.random();
        $http({
            url: url,
            method: "GET",
            headers: {"Authorization": "admin"},
            dataType: "json"
        }).success(function (d) {
            $scope.loadmask.hide();
            if (d.meta.code == '200') {
                $scope.departmentName = d.data.name;
            } else {
                alertService.error(d.meta.code + ',' + d.meta.msg);
            }
        }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    }
    $scope.initFreeModule();
    $scope.getCurrentDepartmentName();
    //每个模块下的知识点的分页
    $scope.loadData = function () {
        $scope.loadmask.show();
        var url = constVar.baseUrl + 'API/FreeExamPage/' + $scope.tid + '?rd=' + Math.random();
        var data = {
            pageSize: $scope.pagging.pageSize,
            pageIndex: $scope.pagging.pageIndex,
            name: $scope.postData.name
            //typeid: $scope.tid
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
                $scope.items = d.data;

                $scope.pagging.pageTotal = d.page.total;
                $scope.pagging.pageIndex = d.page.current;
                $scope.pagging.pageSize = String(d.page.pagesize);
            } else {
                alertService(d.meta.code + ',' + d.meta.msg);
            }
        }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    };
    $scope.clear = function () {
        $scope.postData.name = '';
        $scope.loadData();
    };
    $scope.newModule = function () {
        $scope.newOrEditState = 0;
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop: false,
            templateUrl: 'NewModule.html',
            controller: modalController,
            resolve: {
                pscope: function () {
                    return $scope;
                }
            }
        });
    };
    $scope.newFreeExam = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop: false,
            templateUrl: 'NewFreeExam.html',
            controller: modalNewFreeExamController,
            resolve: {
                pscope: function () {
                    return $scope;
                }
            }
        });
    };
    $scope.editModule = function () {
        $scope.newOrEditState = 1;
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop: false,
            templateUrl: 'NewModule.html',
            controller: modalController,
            resolve: {
                pscope: function () {
                    return $scope;
                }
            }
        });
    };
    $scope.deleteModule = function () {
        if (!$scope.tid || $scope.tid == '')
            return;
        swal({
            title: "确认删除该模块吗?",
            text: "你将会删除该模块不可恢复!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnConfirm: false
        }, function () {
            $scope.loadmask.show();
            var url = constVar.baseUrl + 'API/FreeModule/' + $scope.tid + '?rd=' + Math.random();
            $http({
                url: url,
                method: "DELETE",
                headers: {"Authorization": "admin"},
                dataType: "json"
            }).success(function (d) {
                $scope.loadmask.hide();
                if (d.meta.code == '200') {
                    swal({
                        title: "删除成功!",
                        text: "该模块已删除",
                        type: "success"
                    });
                    $scope.initFreeModule();
                } else {

                    swal({
                        title: "不能删除!",
                        text: "该模块下有知识点，请清空知识点在删除!",
                        type: "error"
                    });
                }
            }).error(function (data, header, config, status) {
                $scope.loadmask.hide();
            });
        });
    };

    $scope.editContent = function (item) {
        $location.search({
            //知识点ID，知识点名称，模块ID方便update，科室ID，题目ID，答案ID，跳转的页面
            freeExamId: item.id,
            freeExamName: item.name,
            freeModuleId: item.module.id,
            departmentId: $scope.departmentId,
            contentNormalDocId: item.content_norm_doc_id,
            answerNormalDocId: item.answer_norm_doc_id,
            page: "freeModeExamContent",
            tid: $scope.tid
        });
        $location.path('/freemodeexamcontent')
    };
    $scope.delNode = function (node) {
        if (!node.id || node.id == '')
            return;
        swal({
            title: "确认删除该知识点吗?",
            text: "你将会删除该知识点不可恢复!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnConfirm: false
        }, function () {
            $scope.loadmask.show();
            var url = constVar.baseUrl + 'API/FreeExam/' + node.id + '?rd=' + Math.random();
            $http({
                url: url,
                method: "DELETE",
                headers: {"Authorization": "admin"},
                dataType: "json"
            }).success(function (d) {
                $scope.loadmask.hide();
                if (d.meta.code == '200') {
                    swal({
                        title: "删除成功!",
                        text: "该知识点已删除",
                        type: "success"
                    });
                    $scope.loadData();
                } else {
                    alertService.error(d.meta.code + ',' + d.meta.msg);
                }
            }).error(function (data, header, config, status) {
                $scope.loadmask.hide();
            });
        });
    };
    $scope.back = function () {
        $location.search({});
        $location.path('/freemode');
    }
};

var modalController = function ($scope, $http, $uibModalInstance, pscope) {
    $scope.pscope = pscope;
    $scope.postDataModule = {
        name: (pscope.newOrEditState == 0 ? "" : pscope.currentModuleName),
        departmentId: pscope.departmentId,
        sequence: 100
    };
    $scope.plugin = new petPlugin();
    $scope.loadmask = $scope.plugin.CreateMask({
        style: 'z-index:9999;',
        id: 'test_Mask',
        loadingImage: true
    });
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.save = function (isValid) {
        if (!isValid) return;
        $scope.loadmask.show();
        var url = (pscope.newOrEditState == 0 ? constVar.baseUrl + 'API/FreeModule?rd=' + Math.random()
            : constVar.baseUrl + 'API/FreeModule/' + pscope.tid + '?rd=' + Math.random());
        $http({
            url: url,
            method: "POST",
            headers: {"Authorization": "admin"},
            dataType: "json",
            data: $scope.postDataModule
        }).success(function (d) {
            $scope.loadmask.hide();
            if (d.meta.code == '200') {
                $scope.cancel();
                //alert('保存成功');
                swal({
                    title: "保存成功!",
                    text: "",
                    type: "success"
                });
                pscope.initFreeModule();
                //pscope.loadData();
            } else {
                //alert(d.meta.code + ',' + d.meta.msg);
                swal({
                    title: "发生错误!",
                    text: d.meta.code + "," + d.meta.msg,
                    type: "error"
                });
            }
        }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    };
};
//新增知识点
var modalNewFreeExamController = function ($scope, $http, $uibModalInstance, pscope) {
    $scope.postDataFreeExam = {
        name: "",
        moduleId: pscope.tid,
        sequence: ""
    };
    $scope.plugin = new petPlugin();
    $scope.loadmask = $scope.plugin.CreateMask({
        style: 'z-index:9999;',
        id: 'test_Mask',
        loadingImage: true
    });
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.save = function (isValid) {
        if (!isValid) return;
        $scope.loadmask.show();
        var url = constVar.baseUrl + 'API/FreeExam?rd=' + Math.random();
        $http({
            url: url,
            method: "POST",
            headers: {"Authorization": "admin"},
            dataType: "json",
            data: $scope.postDataFreeExam
        }).success(function (d) {
            $scope.loadmask.hide();
            if (d.meta.code == '200') {
                $scope.cancel();

                //alert('保存成功');
                swal({
                    title: "保存成功!",
                    text: "",
                    type: "success"
                });
                pscope.loadData();
            } else {
                //alert(d.meta.code + ',' + d.meta.msg);
                swal({
                    title: "发生错误!",
                    text: d.meta.code + "," + d.meta.msg,
                    type: "error"
                });
            }
        }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    };
};