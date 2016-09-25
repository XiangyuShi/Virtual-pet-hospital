var PaperController = function ($scope, $http, $location, alertService) {
    $scope.plugin = new petPlugin();
    $scope.isCollapsed = true;
    $scope.loadmask = $scope.plugin.CreateMask({
        style: 'z-index:9999;',
        id: 'test_Mask',
        loadingImage: true
    });
    $scope.data = {};
    $scope.postData = {
        name: '',
        startDate: '',
        endDate: '',
        status: '-1'
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
    $scope.clear = function () {
        $scope.postData.status = '-1';
        $scope.postData.name = '';
        $scope.postData.startDate = '';
        $scope.postData.endDate = '';
        $scope.loadData();
    };
    $scope.loadData = function () {
        $scope.loadmask.show();
        var url = constVar.baseUrl + 'papersPage?rd=' + Math.random();
        var data = {
            pageSize: $scope.pagging.pageSize,
            pageIndex: $scope.pagging.pageIndex,
            name: $scope.postData.name,
            startDate: $scope.postData.startDate,
            endDate: $scope.postData.endDate,
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
    $scope.new = function () {
        $location.search({});
        $location.path('/paperContent');
    };
    $scope.view = function (id) {
        $location.search({ id: id, view: 1 });
        $location.path('/paperContent');
    };
    $scope.edit = function (id) {
        $location.search({ id: id, edit: 1 });
        $location.path('/paperContent');
    };
    $scope.del = function (id) {
        alertService.confirm('确认删除吗？', function () {
            $scope.loadmask.show();
            var url = constVar.baseUrl + 'papers/' + id + '?rd=' + Math.random();
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
                else if (d.meta.code == '001') {
                    alertService.info('该考卷已被使用,不能删除');
                }
                else {
                    alertService.error(d.meta.code + ',' + d.meta.msg);
                }
            }).error(function (data, header, config, status) {
                $scope.loadmask.hide();
            });
        });
    };
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
    $scope.renderType = function (val) {
        switch (val) {
            case 1:
                return '随堂考';
            case 0:
                return '考试';
            default:
                return '未知';
        }
    }
    $scope.initialize();
};