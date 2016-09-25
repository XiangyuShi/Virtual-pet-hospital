/**
 * Created by hnsxy on 2016/4/16 0016.
 */
var MenuController = function ($scope, $http, alertService) {
    $scope.data = {};//接收后台传送的数据
    $scope.resultSet = [];//菜单树集合
    $scope.selectedNode = {};
    $scope.prevId = '';//原来的节点ID
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
                url: constVar.baseUrl + 'menu?rd=' + Math.random(),
                method: "GET",
                headers: { "Authorization": "admin" },
                dataType: "json"
            }).success(function (d) {
                $scope.loadmask.hide();
                if (d.meta.code == '200') {
                    $scope.data = d.data;
                    $scope.initMenu();
                }
                else {
                    alertService.error(d.meta.code + ',' + d.meta.msg);
                }
            }).error(function (d) {
                $scope.loadmask.hide();
            });
    };
    //从后端得到json数据并解析成树结构
    $scope.initMenu = function () {
        $scope.resultSet = [];//树的第一层数据集合
        for (var i = 0; i < $scope.data.length; i++) {
            var records = {};//树的第一层数据
            var record = [];//树的第二层数据集合集合
            var childRecordSet = [];//树的第二层数据集合
            records.roleId = $scope.data[i]['id'];
            records.roleName = $scope.data[i]['name'];
            record = $scope.data[i]['menuList'];
            records.children = [];
            for (var j = 0; j < record.length; j++) {
                var childRecord = {};//树的第二层数据
                childRecord.roleId = record[j]['id'];
                childRecord.roleName = record[j]['name'];
                childRecord.children = [];
                childRecordSet.push(childRecord);
            }
            records.children = childRecordSet;
            $scope.resultSet.push(records);
        }
    };
    $scope.getTreeNode = function (id) {
        $scope.loadmask.show();
        var url = constVar.baseUrl + 'menu/' + id;
        $http({
            url: url,
            method: "GET",
            headers: { "Authorization": "admin" },
            dataType: "json"
        }).success(function (d) {
            $scope.loadmask.hide();
            if (d.meta.code == '200') {
                $scope.selectedNode = d.data;
                $scope.selectedNode.status = String(d.data.status);
                $scope.selectedNode.fatherId = String(d.data.fatherId == '-1' ? '' : d.data.fatherId);
                $scope.add = false;
                $scope.prevId = id;
            }
            else {
                alertService.error(d.meta.code + ',' + d.meta.msg);
            }
        }).error(function (d) {
            $scope.loadmask.hide();
        });
    };
    //watch函数监控选择的节点
    $scope.$watch('tree.currentNode', function (newObj, oldObj) {
        if ($scope.tree && angular.isObject($scope.tree.currentNode)) {
            console.log('Node Selected!!');
            console.log($scope.tree.currentNode);
            $scope.getTreeNode($scope.tree.currentNode.roleId);
        }
    }, false);
    //清空详情
    $scope.clearForm = function () {
        if ($scope.prevId != '')
            $scope.getTreeNode($scope.prevId);
    }
    //新增结点
    $scope.addNode = function () {
        $scope.add = true;
        $scope.selectedNode = {};
    }
    //删除结点
    $scope.delNode = function () {

        alertService.confirm('确认删除吗？', function () {
            $scope.loadmask.show();
            var url = constVar.baseUrl + 'menu/' + $scope.tree.currentNode.roleId + '?rd=' + Math.random();
            $http({
                url: url,
                method: "DELETE",
                headers: { "Authorization": "admin" },
                dataType: "json"
            }).success(function (d) {
                $scope.loadmask.hide();
                if (d.meta.code == '200') {
                    alertService.success('删除成功');
                    $scope.selectedNode = {};
                    $scope.prevId = '';
                    $scope.add = true;
                    $scope.loadTree();
                } else {
                    alertService.error(d.meta.code + ',' + d.meta.msg);
                }
            }).error(function (data, header, config, status) {
                $scope.loadmask.hide();
            });
        });
    }
    //取消更改
    $scope.cancelNode = function () {
        $scope.clearForm();
    }
    //保存结点
    $scope.saveNode = function (isValid) {
        if (!isValid) {
            return;
        }
        var node = $scope.selectedNode;
        $scope.loadmask.show();
        var url = '';
        if ($scope.add)
            url = constVar.baseUrl + 'menu?rd=' + Math.random();
        else
            url = constVar.baseUrl + 'menu/' + node.id + '?rd=' + Math.random();
        $http({
            url: url,
            method: "POST",
            headers: { "Authorization": "admin" },
            dataType: "json",
            data: node
        }).success(function (d) {
            $scope.loadmask.hide();
            if (d.meta.code == '200') {
                alertService.success('保存成功');
                $scope.loadTree();
            } else {
                alertService.error(d.meta.code + ',' + d.meta.msg);
            }
        }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    }
    $scope.loadTree();//加载树
}