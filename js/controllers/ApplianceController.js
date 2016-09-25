/**
 * Created by hnsxy on 2016/7/7 0007.
 */
var ApplianceController = function ($scope, $http, $compile, $uibModal, $log, $q, $window, ngTreetableParams, $location, alertService) {

    $scope.plugin = new petPlugin();
    $scope.animationsEnabled = true;
    $scope.isType = true;
    $scope.pagging = {
        maxSize: 5,
        pageSize: '10',
        pageIndex: 1,
        pageTotal: 0
    };
    $scope.appliance = {};
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

    //获取器械大类及小类列表(用不到，测试api)
    $scope.getTypeList = function () {
        var data = [];
        $http({
            url: constVar.baseUrl + 'API/ParentApplianceTypes?rd=' + Math.random(),
            method: "GET",
            headers: {"Authorization": "admin"},
            dataType: "json",
            async: false
        })
            .success(function (d) {
                if (d.meta.code == '200') {
                    data = d['data'];
                    $.each(data, function (i, item) {
                        item.hasOwnProperty('applianceType')
                        item.type = "大类";
                        $scope.getLittleTypeListById(item);//大类下对应的小类列表
                    });
                }
                else {
                    alertService.error(d.meta.code + ',' + d.meta.msg);
                }
                console.log("getTypeList");
                console.log(data);
            })
            .error(function () {
                $scope.loadmask.hide();
            })

    }
    //根据大类id获取小类列表(用不到，测试api)
    $scope.getLittleTypeListById = function (item) {
        var id = item.id;
        $http({
            url: constVar.baseUrl + 'API/ApplianceTypeList/' + id + '?rd=' + Math.random(),
            method: "GET",
            headers: {"Authorization": "admin"},
            dataType: "json"
        })
            .success(function (d) {
                if (d.meta.code == '200') {
                    var littleTypeList = [];
                    for (var i = 0; i < d.data.length; i++) {
                        var tmp = {};
                        tmp.id = d.data[i]['id'];
                        tmp.name = d.data[i]['name'];
                        tmp.parentId = d.data[i]['appliance_parent_id'];
                        tmp.type = '小类';
                        littleTypeList.push(tmp);
                    }
                    item.children = littleTypeList;
                }
                else {
                    alertService.error(d.meta.code + ',' + d.meta.msg);
                }
            })
            .error(function () {
                $scope.loadmask.hide();
            })
    }

    $scope.dynamic_params = new ngTreetableParams({
        getNodes: function (parent) {
            var deferred = $q.defer();
            $http(
                {
                    url: constVar.baseUrl + 'API/ParentApplianceTypes?rd=' + Math.random(),
                    method: "GET",
                    headers: {"Authorization": "admin"},
                    dataType: "json"
                }).success(function (data) {
                var temp = data['data'];
                $.each(data['data'], function (i, item) {
                    item.hasOwnProperty('applianceType');
                    item.type = "大类";
                    $http({
                        url: constVar.baseUrl + 'API/ApplianceTypeList/' + item.id + '?rd=' + Math.random(),
                        method: "GET",
                        headers: {"Authorization": "admin"},
                        dataType: "json"
                    })
                        .success(function (d) {
                            if (d.meta.code == '200') {
                                var littleTypeList = [];
                                for (var i = 0; i < d.data.length; i++) {
                                    var tmp = {};
                                    tmp.id = d.data[i]['id'];
                                    tmp.name = d.data[i]['name'];
                                    tmp.parentId = d.data[i]['parent_id'];
                                    tmp.sequence = d.data[i]['sequence'];
                                    tmp.type = '小类';
                                    littleTypeList.push(tmp);
                                }
                                item.children = littleTypeList;
                                $.each(item.children, function (j, mitem) {
                                    mitem.hasOwnProperty('applianceType')
                                    mitem.type = "小类";
                                    mitem.parentId = item['id'];
                                    mitem.parentName = item['name'];

                                });
                            }
                            else {
                                alertService.error(d.meta.code + ',' + d.meta.msg);
                            }
                        })
                        .error(function () {
                            $scope.loadmask.hide();
                        })

                });
                deferred.resolve(temp);

            });
            return parent ? parent.children : deferred.promise;
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

    //得到大类顺序信息，编辑大类信息时调用，修改顺序
    $scope.getParentSequence = function () {
        $scope.loadmask.show();
        $http(
            {
                url: constVar.baseUrl + 'API/ParentApplianceTypes?rd=' + Math.random(),
                method: "GET",
                contentType: 'application/json;charset=utf-8',
                headers: {"Authorization": "admin"},
                dataType: "json"
            }).success(function (data) {
            $scope.loadmask.hide();
            if (data.meta.code == '200') {
                $scope.tmps = data.data;
            }
            else {
                alertService.error(data.meta.code + ',' + data.meta.msg);
            }
        }).error(function () {
            $scope.loadmask.hide();
        });
    }

    //得到某个id下子类顺序信息，编辑小类信息时调用，修改顺序
    $scope.getChildrenSequence = function (id) {
        $scope.loadmask.show();
        $http(
            {
                url: constVar.baseUrl + 'API/ApplianceTypes/' + id + '/Appliances?rd=' + Math.random(),
                method: "GET",
                contentType: 'application/json;charset=utf-8',
                headers: {"Authorization": "admin"},
                dataType: "json"
            }).success(function (data) {
            $scope.loadmask.hide();
            if (data.meta.code == '200') {
                $scope.tmps = data.data;
            }
            else {
                alertService.error(data.meta.code + ',' + data.meta.msg);
            }
        }).error(function () {
            $scope.loadmask.hide();
        });
    }

    //修改器械类
    $scope.editType = function (node, size) {
        $scope.items = {
            id: node.id,
            name: node.name,
            parentId: node.parentId,
            parentName: node.parentName,
            sequence: node.sequence,
        }
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'applianceTypeEditContent.html',
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
                    url: constVar.baseUrl + 'API/ApplianceTypes/' + $scope.items.id + '?rd=' + Math.random(),
                    method: "PATCH",
                    data: {
                        name: $scope.items.name,
                        sequence: $scope.items.sequence
                    },
                    contentType: 'application/json;charset=utf-8',
                    headers: {"Authorization": "admin"},
                    dataType: "json"
                })
                .success(function (data) {
                    $scope.loadmask.hide();
                    if (data.meta.code == '200') {
                        swal({
                            title: "修改成功 ",
                            type: "success",
                            timer: 3000
                        });
                        $scope.dynamic_params.options.initialState = 'expanded';
                        $scope.dynamic_params.refresh();
                    }
                    else if (data.meta.code == '400.2') {
                        swal({
                            title: "名称不能重复 ",
                            type: "error",
                            timer: 3000
                        });
                    }
                    else {
                        alertService.error(data.meta.code + ',' + data.meta.msg);
                    }
                }).error(function () {
                $scope.loadmask.hide();
            });
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    //新增器械类
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
                templateUrl: 'applianceTypeNewContent.html',
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
                        url: constVar.baseUrl + 'API/ApplianceTypes?rd=' + Math.random(),
                        method: "Post",
                        data: {
                            name: $scope.items.detailTypeName,
                            applianceParentId: 0,
                            sequence: 0
                        },
                        contentType: 'application/json;charset=utf-8',
                        headers: {"Authorization": "admin"},
                        dataType: "json"
                    }).success(function (data) {
                    $scope.loadmask.hide();
                    if (data.meta.code == '200') {
                        swal({
                            title: "新增成功 ",
                            type: "success",
                            timer: 3000
                        });
                        $scope.dynamic_params.refresh();
                    }
                    else if (data.meta.code == '400.2') {
                        swal({
                            title: "名称不能重复 ",
                            type: "error",
                            timer: 3000
                        });
                    }
                    else {
                        alertService.error(data.meta.code + ',' + data.meta.msg);
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
                parentName: node.parentName,
                sequence: node.sequence
            }
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'applianceTypeNewContent.html',
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
                        url: constVar.baseUrl + 'API/ApplianceTypes?rd=' + Math.random(),
                        method: "Post",
                        data: {
                            name: $scope.items.detailTypeName,
                            applianceParentId: $scope.items.id,
                            sequence: 0
                        },
                        contentType: 'application/json;charset=utf-8',
                        headers: {"Authorization": "admin"},
                        dataType: "json"
                    }).success(function (data) {
                    $scope.loadmask.hide();
                    if (data.meta.code == '200') {
                        swal({
                            title: "新增成功 ",
                            type: "success",
                            timer: 3000
                        });
                        $scope.dynamic_params.refresh();
                    }
                    else if (data.meta.code == '400.2') {
                        swal({
                            title: "名称不能重复 ",
                            type: "error",
                            timer: 3000
                        });
                    }
                    else {
                        alertService.error(data.meta.code + ',' + data.meta.msg);
                    }
                }).error(function () {
                    $scope.loadmask.hide();
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
    };

    //器械大类排序
    $scope.sortParentAppliance = function () {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'parentApplianceSort.html',
            controller: parentApplianceSortCtrl,
            resolve: {
                tmps: function () {
                    return $scope.tmps;
                }
            }
        });
        modalInstance.result.then(function () {
            $scope.dynamic_params.options.initialState = 'expanded';
            $scope.dynamic_params.refresh();
        });
    }
    //器械小类排序
    $scope.sortAppliance = function (node) {
        $http(
            {
                url: constVar.baseUrl + 'API/ApplianceTypeList/' + node.id + '?rd=' + Math.random(),
                method: "GET",
                contentType: 'application/json;charset=utf-8',
                headers: {"Authorization": "admin"},
                dataType: "json"
            }).success(function (data) {
            $scope.loadmask.hide();
            if (data.meta.code == '200') {
                $scope.mtmps = data.data;
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'applianceSort.html',
                    controller: applianceSortCtrl,
                    resolve: {
                        mtmps: function () {
                            return $scope.mtmps;
                        },
                        id: function () {
                            return node.id;
                        }
                    }
                });
                modalInstance.result.then(function () {
                    $scope.dynamic_params.options.initialState = 'expanded';
                    $scope.dynamic_params.refresh();
                });
            }
            else {
                alertService.error(data.meta.code + ',' + data.meta.msg);
            }
        }).error(function () {
        });
    }
    //删除器械类
    $scope.deleteDisease = function (node) {
        if (node.type == "大类") {
            swal({
                title: "确定删除" + node.name + "大类吗?",
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
                        url: constVar.baseUrl + 'API/ApplianceTypes/' + node.id + '/Enforce?rd=' + Math.random(),
                        method: "DELETE",
                        contentType: 'application/json;charset=utf-8',
                        headers: {"Authorization": "admin"},
                        dataType: "json"
                    }).success(function (data) {
                    $scope.loadmask.hide();
                    if (data.meta.code == '200') {
                        swal({
                            title: node.name + "大类已被删除!",
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
        else {
            swal({
                title: "确定删除" + node.name + "吗?",
                text: "此小类下所有器械将全部删除",
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
                        url: constVar.baseUrl + 'API/ApplianceTypes/' + node.id + '/Enforce?rd=' + Math.random(),
                        method: "DELETE",
                        contentType: 'application/json;charset=utf-8',
                        headers: {"Authorization": "admin"},
                        dataType: "json"
                    }).success(function (data) {
                    $scope.loadmask.hide();
                    if (data.meta.code == '200') {
                        swal({
                            title: node.name + "已被删除!",
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

    //管理器械
    $scope.editTypeDetail = function (node) {
        $scope.isType = false;
        $scope.items = {
            id: node.id,
            name: node.name,
            parentId: node.parentId,
            parentName: node.parentName,
            sequence: node.sequence
        }
        $scope.loadmask.show();
        $http(
            {
                url: constVar.baseUrl + 'API/ApplianceTypes/' + node.id + '/Appliances?rd=' + Math.random(),
                method: "get",
                contentType: 'application/json;charset=utf-8',
                headers: {"Authorization": "admin"},
                dataType: "json"
            }).success(function (d) {
            $scope.loadmask.hide();
            if (d.meta.code == '200') {
                $scope.appliances = d.data;
                $scope.paginate();
            }
            else {
                alert(d.meta.code);
            }
        }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    }

    //前台分页实现
    $scope.paginate = function () {
        $scope.tms = [];
        $scope.pagging.pageTotal = $scope.appliances.length;
        for (var i = ($scope.pagging.pageIndex - 1) * $scope.pagging.pageSize, j = 0; i < $scope.appliances.length && j < $scope.pagging.pageSize; i++, j++) {
            $scope.tms[j] = {name: $scope.appliances[i].name, id: $scope.appliances[i].id};
        }
    };

    //返回
    $scope.back = function () {
        $scope.isType = true;
        $location.search({});
        $scope.items = {
            id: "",
            name: "",
            parentId: "",
            parentName: "",
            sequence: 0
        }
    }

    //器械改名
    $scope.renameAppliance = function (item, size) {
        $scope.appliance = {
            id: item.id,
            name: item.name
        }
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'applianceEditContent.html',
            controller: ModalInstanceC,
            size: size,
            resolve: {
                appliance: function () {
                    return $scope.appliance;
                }
            }
        });
        modalInstance.result.then(function () {
            $scope.loadmask.show();
            $http(
                {
                    url: constVar.baseUrl + 'API/Appliances/' + $scope.appliance.id + '?rd=' + Math.random(),
                    method: "PATCH",
                    data: {
                        name: $scope.appliance.name,
                    },
                    contentType: 'application/json;charset=utf-8',
                    headers: {"Authorization": "admin"},
                    dataType: "json"
                }).success(function (data) {
                $scope.loadmask.hide();
                if (data.meta.code == '200') {
                    swal({
                        title: "修改成功 ",
                        type: "success",
                        timer: 3000
                    });
                }
                else if (data.meta.code == '400.2') {
                    swal({
                        title: "名称不能重复 ",
                        type: "error",
                        timer: 3000
                    });
                }
                else {
                    alertService.error(data.meta.code + ',' + data.meta.msg);
                }
                $scope.editTypeDetail($scope.items);
            }).error(function () {
                $scope.loadmask.hide();
            });
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

    //新增器械
    $scope.newAppliance = function (size) {
        $scope.appliance = {
            id: "",
            name: "",
        }
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'applianceNewContent.html',
            controller: ModalInstanceC,
            size: size,
            resolve: {
                appliance: function () {
                    return $scope.appliance;
                }
            }
        });
        modalInstance.result.then(function () {
            $scope.loadmask.show();
            $http(
                {
                    url: constVar.baseUrl + 'API/ApplianceTypes/' + $scope.items.id + '/Appliances?rd=' + Math.random(),
                    method: "Post",
                    data: {
                        name: $scope.appliance.name
                    },
                    contentType: 'application/json;charset=utf-8',
                    headers: {"Authorization": "admin"},
                    dataType: "json"
                }).success(function (data) {
                $scope.loadmask.hide();
                if (data.meta.code == '200') {
                    swal({
                        title: "新增成功 ",
                        type: "success",
                        timer: 3000
                    });
                    $scope.dynamic_params.refresh();
                }
                else if (data.meta.code == '400.2') {
                    swal({
                        title: "名称不能重复 ",
                        type: "error",
                        timer: 3000
                    });
                }
                else {
                    alertService.error(data.meta.code + ',' + data.meta.msg);
                }
                $scope.editTypeDetail($scope.items);
            }).error(function () {
                $scope.loadmask.hide();
            });
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

    //删除器械
    $scope.deleteAppliance = function (item) {
        swal({
            title: "确定删除" + item.name + "吗?",
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
                    url: constVar.baseUrl + 'API/Appliances/' + item.id + '?rd=' + Math.random(),
                    method: "DELETE",
                    contentType: 'application/json;charset=utf-8',
                    headers: {"Authorization": "admin"},
                    dataType: "json"
                }).success(function (data) {
                $scope.loadmask.hide();
                if (data.meta.code == '200') {
                    swal({
                        title: item.name + "已被删除!",
                        type: "success",
                        timer: 2000
                    });
                }
                $scope.editTypeDetail($scope.items);
            }).error(function () {
                $scope.loadmask.hide();
            });
        });
    }

    //跳转到普通结点
    $scope.editAppliance = function (item) {
        $http(
            {
                url: constVar.baseUrl + 'API/Appliances/' + item.id + '/Detail?rd=' + Math.random(),
                method: "GET",
                contentType: 'application/json;charset=utf-8',
                headers: {"Authorization": "admin"},
                dataType: "json"
            }).success(function (d) {
            if (d.meta.code == '200') {
                $location.search({
                    normalDocId: d.data.normal_doc,
                    page: "appliance",
                    items: $scope.items
                });
                $location.path('/operate');
            }
        }).error(function () {

        });
    }

    //检查ＵＲＬ
    $scope.watchURL = function () {
        if ($location.search().page == "appliance") {
            $scope.isType = false;
            $scope.editTypeDetail($location.search().items);
        }
    };

    //初始化
    $scope.init = function () {

    }
    $scope.watchURL();
    $scope.getParentSequence();

    var ModalInstanceC = function ($scope, $uibModalInstance, appliance) {
        $scope.appliance = appliance;

        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };
    var parentApplianceSortCtrl = function ($scope, $uibModalInstance, $http, tmps) {
        $scope.tmps = tmps;
        $scope.List = [];
        $scope.ok = function () {
            if ($scope.List.length == 0)
                $uibModalInstance.close();
            else {
                $http(
                    {
                        url: constVar.baseUrl + 'API/ApplianceTypes/parent/batch?rd=' + Math.random(),
                        method: "PATCH",
                        data: {
                            applianceTypeIdList: $scope.List
                        },
                        contentType: 'application/json;charset=utf-8',
                        headers: {"Authorization": "admin"},
                        dataType: "json"
                    }).success(function (data) {
                    if (data.meta.code == '200') {
                        $uibModalInstance.close();
                    }
                    else {
                        alertService.error(data.meta.code + ',' + data.meta.msg);
                    }
                }).error(function () {
                    $scope.loadmask.hide();
                });
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.sortUpdate = function (value) {
            //alert(value.models);
            $scope.List = [];
            var tmpId;
            for (var i = 0; i < value.models.length; i++) {
                tmpId = value.models[i].id;
                $scope.List.push(tmpId);
            }
        };
    }
    var applianceSortCtrl = function ($scope, $uibModalInstance, $http, mtmps, id) {
        $scope.id = id;
        $scope.mtmps = mtmps;
        $scope.List = [];
        $scope.ok = function () {
            if ($scope.List.length == 0)
                $uibModalInstance.close();
            else {
                $http(
                    {
                        url: constVar.baseUrl + 'API/ApplianceTypes/' + $scope.id + '/batch?rd=' + Math.random(),
                        method: "PATCH",
                        data: {
                            applianceTypeIdList: $scope.List
                        },
                        contentType: 'application/json;charset=utf-8',
                        headers: {"Authorization": "admin"},
                        dataType: "json"
                    }).success(function (data) {
                    if (data.meta.code == '200') {
                        $uibModalInstance.close();
                    }
                    else {
                        alertService.error(data.meta.code + ',' + data.meta.msg);
                    }
                }).error(function () {
                    $scope.loadmask.hide();
                });
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.sortUpdate = function (value) {
            //alert(value.models);
            $scope.List = [];
            var tmpId;
            for (var i = 0; i < value.models.length; i++) {
                tmpId = value.models[i].id;
                $scope.List.push(tmpId);
            }
        };
    }
}
