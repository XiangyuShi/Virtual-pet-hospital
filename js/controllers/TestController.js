var TestController = function ($scope, $http, $location, $uibModal, alertService) {
    $scope.plugin = new petPlugin();
    $scope.isCollapsed = true;
    $scope.editTest = null;
    $scope.loadmask = $scope.plugin.CreateMask({
        style: 'z-index:9999;',
        id: 'test_Mask',
        loadingImage: true
    });
    $scope.data = {};
    $scope.postData = {
        name: '',
        startDate: '',
        endDate: ''
    };
    $scope.pagging = {
        maxSize: 5,
        pageSize: '10',
        pageIndex: 1,
        pageTotal: 0
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
    $scope.initialize = function () {
        $(document).find('input[bootstrapDatetime]').datetimepicker({
            format: 'yyyy-mm-dd',
            minView: 2,
            autoclose: true,
            language: 'zh-CN'
        });
        $scope.loadData();
    };
    $scope.loadData = function () {
        $scope.loadmask.show();
        var url = constVar.baseUrl + 'testPage?rd=' + Math.random();
        var data = {
            pageSize: $scope.pagging.pageSize,
            pageIndex: $scope.pagging.pageIndex,
            name: $scope.postData.name,
            startDate: $scope.postData.startDate,
            endDate: $scope.postData.endDate
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
    $scope.clear = function () {
        $scope.postData.name = '';
        $scope.postData.startDate = '';
        $scope.postData.endDate = '';
        $scope.loadData();
    };
    $scope.new = function () {
        $scope.editTest = null;
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop: false,
            templateUrl: 'ModalNewTest.html',
            controller: modalInstanceController,
            size: 'lg',
            resolve: {
                pscope: function () {
                    return $scope;
                }
            }
        });
        modalInstance.rendered.then(function (selectedItem) {
            $(document).find('input[bootstrapDatetime]').datetimepicker({
                format: 'yyyy-mm-dd hh:ii:00',
                minView: 0,
                autoclose: true,
                language: 'zh-CN'
            });
        }, function () {

        });
    };
    $scope.view = function (testId) {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop: false,
            templateUrl: 'ModalViewResult.html',
            controller: modalViewResultController,
            size: 'lg',
            resolve: {
                testId: function () {
                    return testId;
                }
            }
        });
    };
    $scope.del = function (testId) {
        alertService.confirm('确认删除吗？', function () {
            $scope.loadmask.show();
            var url = constVar.baseUrl + 'test/' + testId + '?rd=' + Math.random();
            $http({
                url: url,
                method: "DELETE",
                headers: { "Authorization": "admin" },
                dataType: "json"
            }).success(function (d) {
                $scope.loadmask.hide();
                if (d.meta.code == '200') {
                    alertService.success('删除成功');
                    $scope.loadData();
                }
                else {
                    alertService.error(d.meta.code + ',' + d.meta.msg);
                }
            }).error(function (data, header, config, status) {
                $scope.loadmask.hide();
            });
        });
    };
    $scope.edit = function (test) {
        $scope.editTest = test;
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop: false,
            templateUrl: 'ModalNewTest.html',
            controller: modalInstanceController,
            size: 'lg',
            resolve: {
                pscope: function () {
                    return $scope;
                }
            }
        });
        modalInstance.rendered.then(function (selectedItem) {
            $(document).find('input[bootstrapDatetime]').datetimepicker({
                format: 'yyyy-mm-dd hh:ii:00',
                minView: 0,
                autoclose: true,
                language: 'zh-CN'
            });
        }, function () {

        });
    };
    $scope.renderType = function (val) {
        switch (val) {
            case 1:
                return '随堂考';
            case 0:
                return '考试';
            default:
                return '未知';
        }
    };
    $scope.initialize();
};
var modalInstanceController = function ($scope, $http, $uibModalInstance, $filter, pscope, alertService) {
    $scope.plugin = new petPlugin();
    $scope.loadmask = $scope.plugin.CreateMask({
        style: 'z-index:9999;',
        id: 'test_Mask',
        loadingImage: true
    });
    $scope.papers = {};
    $scope.add = pscope.editTest == null;
    $scope.test = {
        paperId: $scope.add ? '' : pscope.editTest.paper.id,
        startDate: $scope.add ? '' : $filter('date')(pscope.editTest.startDate, 'yyyy-MM-dd HH:mm:ss'),
        endDate: $scope.add ? '' : $filter('date')(pscope.editTest.endDate, 'yyyy-MM-dd HH:mm:ss'),
        users: []
    };
    $scope.loadTree = function () {
        $scope.loadmask.show();
        var treeData = { id: '-1', name: '用户', children: [] };
        var postData = { searchText: $scope.searchText };
        var url = constVar.baseUrl + 'usersTree/?rd=' + Math.random();
        $http({
            url: url,
            method: "POST",
            headers: { "Authorization": "admin" },
            dataType: "json",
            data: postData
        }).success(function (d) {
            $scope.loadmask.hide();
            if (d.meta.code == '200') {
                for (var i = 0; i < d.data.length; i++) {
                    var userItem = { id: d.data[i].id, name: d.data[i].name, children: [] };
                    if (!$scope.add && pscope.editTest.users) {
                        for (var j = 0; j < pscope.editTest.users.length; j++) {
                            if (pscope.editTest.users[j].id == userItem.id)
                                userItem.isCheck = true;
                        }
                    }
                    treeData.children.push(userItem);
                }
            } else {
                alertService.error(d.meta.code + ',' + d.meta.msg);
            }
        }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
        $scope.resultSet = [treeData];
    };
    $scope.loadPaper = function () {
        $scope.loadmask.show();
        var url = constVar.baseUrl + 'papersAll?rd=' + Math.random();
        var data = {
            status: 1
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
                $scope.papers = d.data;
            } else {
                alertService.error(d.meta.code + ',' + d.meta.msg);
            }
        }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.treeCheck = function (node) {
        for (var i = 0; i < node.children.length; i++) {
            node.children[i].isCheck = node.isCheck;
        }
    };
    $scope.save = function (isValid) {
        if (!isValid) return;
        $scope.test.users = [];
        console.log($scope.test);
        if ($filter('date')($scope.test.startDate, 'yyyy-MM-dd HH:mm:ss') >= $filter('date')($scope.test.endDate, 'yyyy-MM-dd HH:mm:ss')) {
            alertService.error('开始日期不能大于结束日期');
            return
        }
        for (var i = 0; i < $scope.resultSet[0].children.length; i++) {
            if ($scope.resultSet[0].children[i].isCheck)
                $scope.test.users.push($scope.resultSet[0].children[i]);
        }
        if ($scope.test.users.length == 0) return;

        $scope.loadmask.show();
        var url = constVar.baseUrl + 'test?rd=' + Math.random();
        if (!$scope.add)
            url = url = constVar.baseUrl + 'test/' + pscope.editTest.id + '?rd=' + Math.random();
        $http({
            url: url,
            method: "POST",
            headers: { "Authorization": "admin" },
            dataType: "json",
            data: $scope.test
        }).success(function (d) {
            $scope.loadmask.hide();
            if (d.meta.code == '200') {
                $scope.cancel();
                alertService.success('保存成功');
                pscope.loadData();
            } else {
                alertService.error(d.meta.code + ',' + d.meta.msg);
            }
        }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });

    };
    $scope.loadPaper();
    $scope.loadTree();
};

var modalViewResultController = function ($scope, $http, $uibModalInstance, testId) {
    $scope.plugin = new petPlugin();
    $scope.loadmask = $scope.plugin.CreateMask({
        style: 'z-index:9999;',
        id: 'test_Mask',
        loadingImage: true
    });
    $scope.pagging = {
        maxSize: 5,
        pageSize: '10',
        pageIndex: 1,
        pageTotal: 0
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.loadData = function () {
        $scope.loadmask.show();
        var url = constVar.baseUrl + 'test/resultPage/' + testId + '?rd=' + Math.random();
        var data = {
            pageSize: $scope.pagging.pageSize,
            pageIndex: $scope.pagging.pageIndex,
            name: ''
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
    $scope.renderScore = function (p) {
        if (p.status == 0)
            return '未开始';
        else if (p.status == 1)
            return '答题中';
        else if (p.status == 2)
            return p.score;
        else if (p.status == -1)
            return '已过期';
        else
            return '';
    }
    $scope.loadData();
};