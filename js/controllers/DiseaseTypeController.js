/**
 * Created by yichli on 5/11/16.
 */

var DiseaseTypeController = function ($scope, $http, $compile, $uibModal, $log, $q, $window, ngTreetableParams, $location) {

    $scope.plugin = new petPlugin();
    $scope.animationsEnabled = true;

    //$scope.parentOperate = '<button class="btn btn-success icon-margin-right10" ng-click="editType(node.type,node.size,node.name);open(500)">edit</button><button class="btn btn-warning">delete</button>';
    

    $scope.editType = function (node, size) {
        $scope.items = {
            id: node.id,
            name: node.name,
            parentId: node.parentId,
            parentName: node.parentName
        }

        if (node.type == '大类') {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'diseaseTypeEditContent.html',
                controller: ModalInstanceCtrl,
                size: size,
                resolve: {
                    items: function () {

                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function () {
                $scope.loadmask.show();
                $http(
                    {
                        url: constVar.baseUrl + 'API/DiseaseTypes/' + $scope.items.id + '?rd=' + Math.random(),
                        method: "PATCH",
                        data: {
                            name: $scope.items.name
                        },
                        contentType: 'application/json;charset=utf-8',
                        headers: {"Authorization": "admin"},
                        dataType: "json"
                    }).success(function (data) {
                    $scope.loadmask.hide();
                    if (data.meta.code == '200') {
                        //alert("修改成功!");
                        swal({
                            title: "修改成功 ",
                            type: "success",
                            timer: 3000
                        });
                        $scope.dynamic_params.options.initialState = 'expanded';
                        $scope.dynamic_params.refresh();
                    }
                }).error(function () {
                    $scope.loadmask.hide();
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
        else {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'diseaseTypeEditContent.html',
                controller: ModalInstanceCtrl,
                size: size,
                resolve: {
                    items: function () {

                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function () {
                $scope.loadmask.show();
                $http(
                    {
                        url: constVar.baseUrl + 'API/Diseases/' + $scope.items.id + '?rd=' + Math.random(),
                        method: "PATCH",
                        data: {
                            name: $scope.items.name,
                            disease_type_id: $scope.items.parentId
                        },
                        contentType: 'application/json;charset=utf-8',
                        headers: {"Authorization": "admin"},
                        dataType: "json"
                    }).success(function (data) {
                    $scope.loadmask.hide();
                    if (data.meta.code == '200') {
                        //alert("修改成功!");
                        swal({
                            title: "修改成功 ",
                            type: "success",
                            timer: 3000
                        });
                        $scope.dynamic_params.options.initialState = 'expanded';
                        $scope.dynamic_params.refresh();
                    }
                }).error(function () {
                    $scope.loadmask.hide();
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

    };

    $scope.newSumType = function (node, size) {
        $scope.items = {
            id: "",
            name: "",
            parentId: "",
            parentName: ""
        }

        if (node == '') {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'diseaseTypeNewContent.html',
                controller: ModalInstanceCtrl,
                size: size,
                resolve: {
                    items: function () {

                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function () {
                $scope.loadmask.show();
                $http(
                    {
                        url: constVar.baseUrl + 'API/DiseaseTypes?rd=' + Math.random(),
                        method: "Post",
                        data: {
                            name: $scope.items.detailTypeName
                        },
                        contentType: 'application/json;charset=utf-8',
                        headers: {"Authorization": "admin"},
                        dataType: "json"
                    }).success(function (data) {
                    $scope.loadmask.hide();
                    if (data.meta.code == '200') {
                        //alert("新增成功");
                        swal({
                            title: "新增成功 ",
                            type: "success",
                            timer: 3000
                        });
                        $scope.dynamic_params.refresh();
                    }
                }).error(function () {
                    $scope.loadmask.hide();
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });

        }
        else {
            $scope.items = {
                id: node.id,
                name: node.name,
                parentId: node.parentId,
                parentName: node.parentName
            }
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'diseaseTypeNewContent.html',
                controller: ModalInstanceCtrl,
                size: size,
                resolve: {
                    items: function () {

                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function () {

                $scope.loadmask.show();
                $http(
                    {
                        url: constVar.baseUrl + 'API/DiseaseTypes/' + $scope.items.id + '/Diseases?rd=' + Math.random(),
                        method: "Post",
                        data: {
                            name: $scope.items.detailTypeName
                        },
                        contentType: 'application/json;charset=utf-8',
                        headers: {"Authorization": "admin"},
                        dataType: "json"
                    }).success(function (data) {
                    $scope.loadmask.hide();
                    if (data.meta.code == '200') {
                        //alert("新增成功");
                        swal({
                            title: "新增成功 ",
                            type: "success",
                            timer: 3000
                        });
                        $scope.dynamic_params.refresh();
                    }
                }).error(function () {
                    $scope.loadmask.hide();
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });

        }
    };

    $scope.dynamic_params = new ngTreetableParams({
        getNodes: function (parent) {
            var deferred = $q.defer();
            $http(
                {
                    url: constVar.baseUrl + 'API/DiseaseTypes/Tree?rd=' + Math.random(),
                    method: "GET",
                    headers: {"Authorization": "admin"},
                    dataType: "json"
                }).success(function (data) {
                var temp = data['data'];
                $.each(data['data'], function (i, item) {
                    if (item.hasOwnProperty('diseases')) {
                        item.type = "大类";
                        $.each(item['diseases'], function (j, mitem) {
                            mitem.parentId = item['id'];
                            mitem.parentName = item['name'];
                        });
                    }
                });
                deferred.resolve(temp);

            });

            return parent ? parent.diseases : deferred.promise;
        },

        getTemplate: function (node) {
            return 'tree_node';
        },
        options: {
            //initialState: 'expanded',
            onNodeExpand: function () {
                console.log('A node was expanded!');
            }
        }
    });

    $scope.expanded_params = new ngTreetableParams({
        getNodes: function (parent) {
            return parent ? parent.children : $scope.data;
        },
        getTemplate: function (node) {
            return 'tree_node';
        },
        options: {
            initialState: 'expanded'
        }
    });


    $scope.deleteDisease = function (type, id, name) {
        if (type == "大类") {
            swal({
                title: "确定删除" + name + "大类吗?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            }, function () {
                $scope.loadmask.show();
                $http(
                    {
                        url: constVar.baseUrl + 'API/DiseaseTypes/' + id + '/Enforce?rd=' + Math.random(),
                        method: "DELETE",
                        contentType: 'application/json;charset=utf-8',
                        headers: {"Authorization": "admin"},
                        dataType: "json"
                    }).success(function (data) {
                    $scope.loadmask.hide();
                    if (data.meta.code == '200') {
                        //alert(name + "大类已被删除!");
                        swal({
                            title: name + "大类已被删除!",
                            type: "success",
                            timer: 2000
                        });
                        $scope.dynamic_params.refresh();
                    }
                }).error(function () {
                    $scope.loadmask.hide();
                });
            });
        } else {
            swal({
                title: "确定删除" + name + "病种吗?",
                text:"此病种下所有病例将全部删除",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            }, function () {
                $scope.loadmask.show();
                $http(
                    {
                        url: constVar.baseUrl + 'API/Diseases/' + id + '/Enforce?rd=' + Math.random(),
                        method: "DELETE",
                        contentType: 'application/json;charset=utf-8',
                        headers: {"Authorization": "admin"},
                        dataType: "json"
                    }).success(function (data) {
                    $scope.loadmask.hide();
                    if (data.meta.code == '200') {
                        //alert(name + "病种已被删除!");
                        swal({
                            title: name + "病种已被删除!",
                            type: "success",
                            timer: 2000
                        });
                        $scope.dynamic_params.refresh();
                    }
                }).error(function () {
                    $scope.loadmask.hide();
                });
            });

        }
    };

    $scope.editDetail = function (node) {
        $http(
            {
                url: constVar.baseUrl + 'API/Diseases/' + node.id + '?rd=' + Math.random(),
                method: "GET",
                contentType: 'application/json;charset=utf-8',
                headers: {"Authorization": "admin"},
                dataType: "json"
            }).success(function (d) {
            if (d.meta.code == '200') {
                $location.search({
                    normalDocId: d.data.normal_doc,
                    page: "diseaseType"
                });
                $location.path('/operate');
            }
        }).error(function () {

        });

    }


    //弹窗动画
    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };
    //网络请求loading动画
    $scope.loadmask = $scope.plugin.CreateMask({
        style: 'z-index:9999;',
        id: 'test_Mask',
        loadingImage: true
    });


    $scope.init = function () {

    }



}