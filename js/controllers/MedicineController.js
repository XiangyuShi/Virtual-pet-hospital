/**
 * Created by Nova on 2016/5/14.
 */
var MedicineController = function ($scope, $http, $uibModal) {
    $scope.data = {};//接收后台传送的数据
    $scope.resultSet = [];//药品树集合
    $scope.selectedNode = {};
    $scope.typeNodeSet = [];//药品大类
    $scope.prevNode = {};//原来的节点ID
    $scope.add = true;//判断是添加还是更新
    $scope.plugin = new petPlugin();
    $scope.loadmask = $scope.plugin.CreateMask({
        style: 'z-index:9999;',
        id: 'test_Mask',
        loadingImage: true
    });
    //加载树，调用initMenu方法
    $scope.loadTree = function () {
        $scope.loadmask.show();
        $http(
            {
                url: constVar.baseUrl + 'API/MedicineTypes/Tree?rd=' + Math.random(),
                method: "GET",
                headers: {"Authorization": "admin"},
                dataType: "json"
            }).success(function (d) {
            $scope.loadmask.hide();
            if (d.meta.code == '200') {
                $scope.data = d.data;
                $scope.typeNodeSet = [];
                for (var i = 0; i < $scope.data.length; i++) {
                    $scope.data[i].fatherId = '-1';
                    $scope.typeNodeSet.push($scope.data[i]);
                    for (var j = 0; j < $scope.data[i].medicines.length; j++)
                        $scope.data[i].medicines[j].fatherId = String($scope.data[i]['id']);
                }
                $scope.initMenu();
            }
            else {
                //alert(d.meta.code + ',' + d.meta.msg);
                swal({
                    title: "发生错误!",
                    text: d.meta.code + "," + d.meta.msg,
                    type: "error"
                });
            }
        }).error(function (d) {
            $scope.loadmask.hide();
        });
    };
    //从后端得到json数据并解析成树结构
    $scope.initMenu = function () {
        $scope.resultSet = $scope.data;
    };
    //点击显示
    $scope.showCase = function (node) {
        $scope.selectedNode = {id: node.id, name: node.name, fatherId: node.fatherId};
        $scope.prevNode = {id: node.id, name: node.name, fatherId: node.fatherId};
        $scope.add = false;
        if (node.fatherId == "-1") {
            document.getElementById("tdMedicineName").innerHTML = "药品大类:";
            //document.getElementById("trType").style.visibility="collapse";
            document.getElementById("trType").style.display = "none";
        }
        else {
            document.getElementById("tdMedicineName").innerHTML = "药品名称:";
            //document.getElementById("trType").style.visibility="visible";
            document.getElementById("trType").style.display = "";
        }
    };
    //清空详情
    $scope.clearForm = function () {
        // $scope.selectedNode =  $scope.prevNode;
        $scope.selectedNode = angular.copy($scope.prevNode);
    };
    //新增结点
    $scope.addNode = function () {
        $scope.add = true;
        $scope.selectedNode = {};
        document.getElementById("tdMedicineName").innerHTML = "药品名称:";
        document.getElementById("trType").style.display = "";
    };
    //新增大类
    $scope.addTypeNode = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop: false,
            templateUrl: 'ModalNewTypeNode.html',
            controller: modalTypeNodeController,
            resolve: {
                pscope: function () {
                    return $scope;
                }
            }
        });
    };
    //点击删除按钮删除结点
    /*$scope.delNode = function () {
     //弹出框判断是删除药品还是药品大类
     if ($scope.tree.currentNode.fatherId == '-1' ? window.confirm('确认删除该药品大类吗？') : window.confirm('确认删除该药品吗？')) {

     /!* if ($scope.tree.currentNode.fatherId == '-1' ? swal({
     title: "确认删除该药品大类吗?",
     text: "你将会删除该药品大类不可恢复!",
     type: "warning",
     showCancelButton: true,
     confirmButtonColor: "#DD6B55",
     confirmButtonText: "确定",
     cancelButtonText: "取消",
     closeOnConfirm: false
     }) : swal({
     title: "确认删除该药品吗?",
     text: "你将会删除该药品不可恢复!",
     type: "warning",
     showCancelButton: true,
     confirmButtonColor: "#DD6B55",
     confirmButtonText: "确定",
     cancelButtonText: "取消",
     closeOnConfirm: false
     })) {*!/
     $scope.loadmask.show();
     if ($scope.tree.currentNode.fatherId == '-1')
     var url = constVar.baseUrl + 'API/MedicineTypes/' + $scope.tree.currentNode.id + '/Enforce?rd=' + Math.random();
     else
     var url = constVar.baseUrl + 'API/Medicines/' + $scope.tree.currentNode.id + '/Enforce?rd=' + Math.random();
     $http({
     url: url,
     method: "DELETE",
     headers: {"Authorization": "admin"},
     dataType: "json"
     }).success(function (d) {
     $scope.loadmask.hide();
     if (d.meta.code == '200') {
     //alert('删除成功');
     swal({
     title: "删除成功!",
     type: "success"
     });

     $scope.selectedNode = {};
     $scope.add = true;
     $scope.loadTree();
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
     }
     }*/
    //点击删除按钮删除结点
    $scope.delNode = function () {
        //弹出框判断是删除药品还是药品大类

        if ($scope.tree.currentNode.fatherId == '-1') {
            swal({
                    title: "确认删除该药品大类吗?",
                    text: "你将会删除该药品大类不可恢复!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                },
                function () {
                    $scope.loadmask.show();
                    var url = constVar.baseUrl + 'API/MedicineTypes/' + $scope.tree.currentNode.id + '/Enforce?rd=' + Math.random();
                    $http({
                        url: url,
                        method: "DELETE",
                        headers: {"Authorization": "admin"},
                        dataType: "json"
                    }).success(function (d) {
                        $scope.loadmask.hide();
                        if (d.meta.code == '200') {
                            //alert('删除成功');
                            swal({
                                title: "删除成功!",
                                text: "该药品大类已删除！",
                                type: "success"
                            });

                            $scope.selectedNode = {};
                            $scope.add = true;
                            $scope.loadTree();
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
                });
        } else {
            swal({
                    title: "确认删除该药品吗?",
                    text: "你将会删除该药品不可恢复!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                },
                function () {
                    $scope.loadmask.show();
                    var url = constVar.baseUrl + 'API/Medicines/' + $scope.tree.currentNode.id + '/Enforce?rd=' + Math.random();
                    $http({
                        url: url,
                        method: "DELETE",
                        headers: {"Authorization": "admin"},
                        dataType: "json"
                    }).success(function (d) {
                        $scope.loadmask.hide();
                        if (d.meta.code == '200') {
                            //alert('删除成功');
                            swal({
                                title: "删除成功!",
                                text: "该药品已删除",
                                type: "success"
                            });

                            $scope.selectedNode = {};
                            $scope.add = true;
                            $scope.loadTree();
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
                });
        }
    };

//取消更改
    $scope.cancelNode = function () {
        $scope.clearForm();
    };
//保存结点
    $scope.saveNode = function (isValid) {
        if (!isValid) {
            return;
        }
        var node = $scope.selectedNode;
        $scope.loadmask.show();
        var url = '';
        //判断是新增还是更新
        if ($scope.add) {
            /*  if (node.fatherId == "-1")
             url = constVar.baseUrl + '/API/MedicineTypes';
             else */
            url = constVar.baseUrl + 'API/MedicineTypes/' + node.fatherId + '/Medicines';
            $http({
                url: url,
                method: "POST",
                headers: {"Authorization": "admin"},
                dataType: "json",
                data: node
            }).success(function (d) {
                $scope.loadmask.hide();
                if (d.meta.code == '200') {
                    //alert('保存成功');
                    swal({
                        title: "保存成功!",
                        text: "",
                        type: "success"
                    });
                    $scope.loadTree();
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
        }
        else {
            if (node.fatherId == "-1")
                url = constVar.baseUrl + 'API/MedicineTypes/' + node.id + '?rd=' + Math.random();
            else
                url = constVar.baseUrl + 'API/Medicines/' + node.id + '?rd=' + Math.random();
            $http({
                url: url,
                method: "PATCH",
                headers: {"Authorization": "admin"},
                dataType: "json",
                data: node
            }).success(function (d) {
                $scope.loadmask.hide();
                if (d.meta.code == '200') {
                    //alert('保存成功');
                    swal({
                        title: "保存成功!",
                        text: "",
                        type: "success"
                    });
                    $scope.loadTree();
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
        }
    };
    $scope.loadTree();
//加载树

};
//用来弹出框新增大类
var modalTypeNodeController = function ($scope, $http, $uibModalInstance, pscope) {
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
        var url = constVar.baseUrl + 'API/MedicineTypes?rd=' + Math.random();
        $http({
            url: url,
            method: "POST",
            headers: {"Authorization": "admin"},
            dataType: "json",
            data: $scope.selectedNode
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
                pscope.loadTree();
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
    }
};
