/**
 * Created by hnsxy on 2016/4/23 0023.
 */
var SystemRoleController = function ($scope, $http, $uibModal, $log, alertService) {
    $scope.plugin = new petPlugin();
    $scope.animationsEnabled = true;
    $scope.loadmask = $scope.plugin.CreateMask({
        style: 'z-index:9999;',
        id: 'test_Mask',
        loadingImage: true
    });//显示load画面
    $scope.isCollapsed = true;//是否折叠
    $scope.data = {};
    $scope.rowData = { id: '', name: '', status: '1' };
    $scope.pagging = {
        maxSize: 5,
        pageSize: '10',
        pageIndex: 1,
        pageTotal: 0
    };
    //切换搜索面板
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
    //初始化界面
    $scope.initialize = function () {
        $scope.postData = {
            name: '',
            status: '-1'
        };
        $scope.loadData();
    };
    //清空搜索面板
    $scope.clear = function () {
        $scope.postData.status = '-1';
        $scope.postData.name = '';
        $scope.loadData();
    };
    //从后台获取数据
    $scope.loadData = function () {
        $scope.loadmask.show();
        var url = constVar.baseUrl + 'systemRolesPage?rd=' + Math.random();
        var data = {
            pageSize: $scope.pagging.pageSize,
            pageIndex: $scope.pagging.pageIndex,
            name: $scope.postData.name,
            status: $scope.postData.status
        };
        $http({
            url: url,
            method: "POST",
            headers: { "Authorization": "admin" },
            dataType: "json",
            data: data
        }).success(function (d) {
            $scope.loadmask.hide();
            if (d.meta.code == '200') {
                $scope.data = d.data;
                $scope.pagging.pageTotal = d.page.total;
                $scope.pagging.pageIndex = d.page.current;
                $scope.pagging.pageSize = String(d.page.pagesize);
            } else {
                alertService.error(d.meta.code + ',' + d.meta.msg);
            }
        }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    };
    $scope.searchKeyDown = function (event) {
        if (event.keyCode == 13) {
            $scope.loadData();
        }
    };
    $scope.openModal = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop: false,
            templateUrl: 'systemRoleModal.html',
            controller: ModalInstanceController,
            size: 'lg',
            resolve: {
                pscope: function () {
                    return $scope;
                }
            }
        });
    };
    //新增
    $scope.new = function () {
        $scope.add = true;
        $scope.rowData = { id: '', name: '', status: '1' };
        $scope.openModal();
    };
    //修改
    $scope.edit = function (id) {
        $scope.add = false;
        $scope.loadmask.show();
        var url = constVar.baseUrl + 'systemRoles/' + id + '?rd=' + Math.random();
        $http({
            url: url,
            method: "GET",
            headers: { "Authorization": "admin" },
            dataType: "json"
        }).success(function (d) {
            $scope.loadmask.hide();
            if (d.meta.code == '200') {
                $scope.rowData.id = d.data.id;
                $scope.rowData.name = d.data.name;
                $scope.rowData.status = String(d.data.status);
                $scope.openModal();
            }
            else {
                alertService.error(d.meta.code + ',' + d.meta.msg);
            }
        });
    };
    //删除
    $scope.del = function (id) {
        alertService.confirm('确认删除吗？', function () {
            $scope.loadmask.show();
            var url = constVar.baseUrl + 'systemRoles/' + id + '?rd=' + Math.random();
            $http.delete(url).success(function (d) {
                $scope.loadmask.hide();
                if (d.meta.code == '200') {
                    $scope.loadData();
                    alertService.success('删除成功');
                } else {
                    alertService.error(d.meta.code + ',' + d.meta.msg);
                }
            }).error(function (data, header, config, status) {
                $scope.loadmask.hide();
            });
        });
    };
    //转换状态
    $scope.renderStatus = function (val) {
        switch (val) {
            case 1:
                return '有效';
            case 0:
                return '无效';
            default:
                return '未知';
        }
    }
    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };
    $scope.initialize();
};
var ModalInstanceController = function ($scope, $uibModalInstance, $http, pscope, alertService) {
    $scope.plugin = new petPlugin();
    $scope.loadmask = $scope.plugin.CreateMask({
        style: 'z-index:9999;',
        id: 'test_Mask',
        loadingImage: true
    });
    $scope.rowData = pscope.rowData;
    $scope.ok = function () {
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.save = function (valid) {
        if (!valid) return;
        $scope.loadmask.show();
        var menuArray = new Array();
        for (var i = 0; i < $scope.resultSet.length; i++) {
            if ($scope.resultSet[i].isCheck)
                menuArray.push({ id: $scope.resultSet[i].roleId });
            for (var j = 0; j < $scope.resultSet[i].children.length; j++) {
                if ($scope.resultSet[i].children[j].isCheck)
                    menuArray.push({ id: $scope.resultSet[i].children[j].roleId });
            }
        }
        var url;
        if (pscope.add)
            url = constVar.baseUrl + 'systemRoles?rd=' + Math.random();
        else
            url = constVar.baseUrl + 'systemRoles/' + pscope.rowData.id + '?rd=' + Math.random();
        var data = { name: $scope.rowData.name, status: parseInt($scope.rowData.status), menuList: menuArray };
        $http({
            url: url,
            method: "POST",
            headers: { "Authorization": "admin" },
            dataType: "json",
            data: data
        }).success(function (d) {
            $scope.loadmask.hide();
            if (d.meta.code == '200') {
                alertService.success('保存成功');
                $uibModalInstance.close();
                pscope.loadData();
            } else if (d.meta.code == '502') {
                alertService.error('角色名已存在');
            } else {
                alertService.error(d.meta.code + ',' + d.meta.msg);
            }
        }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    };
    //加载树，调用initMenu方法
    $scope.loadTree = function (roleId) {
        $scope.loadmask.show();
        $http(
            {
                url: constVar.baseUrl + 'systemRoleMenus/' + roleId + '?rd=' + Math.random(),
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
            records.isCheck = $scope.data[i]['isCheck'];
            record = $scope.data[i]['menuList'];
            records.children = [];
            for (var j = 0; j < record.length; j++) {
                var childRecord = {};//树的第二层数据
                childRecord.roleId = record[j]['id'];
                childRecord.roleName = record[j]['name'];
                childRecord.isCheck = record[j]['isCheck'];
                childRecord.children = [];
                childRecordSet.push(childRecord);
            }
            records.children = childRecordSet;
            $scope.resultSet.push(records);
        }
    };
    $scope.treeCheck = function (node) {
        for (var i = 0; i < node.children.length; i++) {
            node.children[i].isCheck = node.isCheck;
        }
        if (!node.isCheck) return;
        for (var i = 0; i < $scope.resultSet.length; i++) {
            for (var j = 0; j < $scope.resultSet[i].children.length; j++) {
                if ($scope.resultSet[i].children[j].roleId == node.roleId) {
                    $scope.resultSet[i].isCheck = true;
                    return;
                }
            }
        }
    };
    $scope.loadTree(pscope.rowData.id);
};
