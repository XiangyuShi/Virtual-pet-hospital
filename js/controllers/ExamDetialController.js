var ExamDetailController = function ($scope, $http, $location, $route, alertService) {
    $scope.initialize = function () {
        $scope.edit = false;
        $scope.view = false;
        $scope.editor1 = CKEDITOR.replace("editor");
        var id = $location.search()['id'];
        if (id && id != undefined) {
            $scope.id = $location.search()['id'];
        }
        var edit = $location.search()['edit'];
        if (edit && edit != undefined) {
            $scope.edit = true;
        }
        var view = $location.search()['view'];
        if (view && view != undefined) {
            $scope.view = true;
        }
        $scope.tid = $location.search()['tid'];
        $scope.editor1.on('instanceReady', function (e) {
            if ($scope.id)
                $scope.getTreeNode($scope.id);
        });
        $scope.plugin = new petPlugin();
        $scope.plugin.InitializePlugin();
        $scope.selectedNode = {};
        $scope.data = {};
        $scope.type = {};
        $scope.loadmask = $scope.plugin.CreateMask({
            style: 'z-index:9999;',
            id: 'test_Mask',
            loadingImage: true
        });
        $scope.model = {
            name: 'Tabs'
        };

    };
    $scope.clearForm = function () {
        $scope.selectedNode = {};
    }
    $scope.loadDiseaseTypes = function () {
        $scope.loadmask.show();
        var url = constVar.baseUrl + 'API/DiseaseTypes?rd=' + Math.random();
        $http({
            url: url,
            method: "GET",
            headers: { "Authorization": "admin" },
            dataType: "json"
        }).success(function (d) {
            $scope.loadmask.hide();
            if (d.meta.code == '200') {
                $scope.tabs = d.data;
                $scope.tabs.push({ id: '-1', name: '其他' });
            } else {
                alertService.error(d.meta.code + ',' + d.meta.msg);
            }
        }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    };
    $scope.getTreeNode = function (id) {
        $scope.loadmask.show();
        var url = constVar.baseUrl + 'exams/' + id + '?rd=' + Math.random();
        $http({
            url: url,
            method: "GET",
            headers: { "Authorization": "admin" },
            dataType: "json"
        }).success(function (d) {
            $scope.loadmask.hide();
            if (d.meta.code == '200') {
                $scope.clearForm();
                $scope.selectedNode = d.data;
                $scope.editor1.setData($scope.selectedNode.description);
            } else {
                alertService.error(d.meta.code + ',' + d.meta.msg);
            }
        }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    }
    $scope.saveNode = function (isValid) {
        if (!isValid) {
            return;
        }
        var node = $scope.selectedNode;
        node.description = $scope.editor1.document.getBody().getHtml();
        node.descriptext = $scope.editor1.document.getBody().getText();
        $scope.loadmask.show();
        var url = '';
        if (!$scope.edit)
            url = constVar.baseUrl + 'exams?rd=' + Math.random();
        else
            url = constVar.baseUrl + 'exams/' + node.id + '?rd=' + Math.random();
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
                $location.path('/exam');
            } else {
                alertService.error(d.meta.code + ',' + d.meta.msg);
            }
        }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    }
    $scope.back = function () {
        $location.search({ tid: $scope.tid });
        $location.path('/exam');
    };
    $scope.initialize();
    $scope.loadDiseaseTypes();
};