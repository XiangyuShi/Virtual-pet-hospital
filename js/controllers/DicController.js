var DicController = function ($scope, $http) {
    $scope.plugin = new petPlugin();
    $scope.plugin.InitializePlugin();
    $scope.selectedNode = {};
    $scope.prevId = '';
    $scope.searchText = '';
    $scope.add = true;
    $scope.loadmask = $scope.plugin.CreateMask({
        style: 'z-index:9999;',
        id: 'test_Mask',
        loadingImage: true
    });
    $scope.tree = $scope.plugin.CreateTree({
        url: constVar.baseUrl + 'usersTree?rd=' + Math.random(),
        id: 'tree',
        root: '用户',
        postData: {},
        autoLoad: false,
        expandAll: true,
        multiple: false,
        nodeClick: function (event, treeId, treeNode) { $scope.getTreeNode(treeNode.id); },
        onCheck: function (event, treeId, treeNode) { },
        renderTo: 'divTree'
    });
    $scope.clearForm = function () {
        $scope.selectedNode = {};
    }
    $scope.loadTree = function () {
        $scope.loadmask.show();
        var postData = { searchText: $scope.searchText };
        $scope.tree.loadTree(function () { $scope.loadmask.hide(); }, postData);
    }
    $scope.getTreeNode = function (id) {
        if (id == '-1') return;
        $scope.loadmask.show();
        var url = constVar.baseUrl + 'users/' + id + '?rd=' + Math.random();
        $http.get(url).success(function (d) {
            $scope.loadmask.hide();
            if (d.code == '200') {
                $scope.clearForm();
                $scope.selectedNode = d.result;
                $scope.selectedNode.confirmPassword = $scope.selectedNode.password;
                $scope.prevId = id;
                $scope.add = false;
            } else {
                alert(d.code + ',' + d.message);
            }
        }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    }
    $scope.addNode = function () {
        $scope.add = true;
        $scope.selectedNode = {};
    }
    $scope.cancelNode = function () {
        if ($scope.prevId != '')
            $scope.getTreeNode($scope.prevId);
    }
    $scope.saveNode = function (isValid) {
        if (!isValid) {
            return;
        }
        var node = $scope.selectedNode;
        $scope.loadmask.show();
        var url = '';
        if ($scope.add)
            url = constVar.baseUrl + 'users?rd=' + Math.random();
        else
            url = constVar.baseUrl + 'users/' + node.id + '?rd=' + Math.random();
        $http.post(url, node).success(function (d) {
            $scope.loadmask.hide();
            if (d.code == '200') {
                alert('保存成功');
                $scope.loadTree();
            } else {
                alert(d.code + ',' + d.message);
            }
        }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    }
    $scope.delNode = function (node) {
        if (!node.id || node.id == '') return;
        if (window.confirm('确认删除吗？')) {
            $scope.loadmask.show();
            var url = constVar.baseUrl + 'users/' + node.id + '?rd=' + Math.random();
            $http.delete(url).success(function (d) {
                $scope.loadmask.hide();
                if (d.code == '200') {
                    alert('删除成功');
                    $scope.selectedNode = {};
                    $scope.prevId = '';
                    $scope.loadTree();
                    $scope.add = true;
                } else {
                    alert(d.code + ',' + d.message);
                }
            }).error(function (data, header, config, status) {
                $scope.loadmask.hide();
            });
        }
    }
    $scope.loadTree();
};