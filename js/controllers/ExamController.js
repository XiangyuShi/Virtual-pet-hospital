var ExamController = function ($scope, $http, $location, $uibModal, alertService) {
    $scope.plugin = new petPlugin();
    $scope.item = {};
    $scope.data = {};
    $scope.type = {};
    $scope.resultSet = [];
    $scope.isCollapsed = true;
    $scope.activeIndex = 0;
    var tid = $location.search()['tid'];
    if (tid && tid != undefined) {
        $scope.tid = tid;
    }
    $scope.loadmask = $scope.plugin.CreateMask({
        style: 'z-index:9999;',
        id: 'test_Mask',
        loadingImage: true
    });
    $scope.postData = {
        name: ''
    };
    $scope.changeTab = function (tid) {
        $scope.tid = tid;
        $scope.clear();
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
    $scope.lockTab = function () {
        $scope.tid = $scope.tabs[0].id;
        $scope.activeIndex = 1;
        if ($scope.tabs.length > 0) {
            if (tid && tid != undefined) {
                for (var i = 0; i < $scope.tabs.length; i++) {
                    if ($scope.tabs[i].id == tid) {
                        $scope.tid = $scope.tabs[i].id;
                        $scope.activeIndex = i + 1;
                        break;
                    }
                }
            }
        }
        $scope.loadData();
    };
    $scope.loadData = function () {
        $scope.loadmask.show();
        var url = constVar.baseUrl + 'examsPage?rd=' + Math.random();
        var data = {
            pageSize: $scope.pagging.pageSize,
            pageIndex: $scope.pagging.pageIndex,
            name: $scope.postData.name,
            typeid: $scope.tid
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
                $scope.items = d.data;
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
    $scope.model = {
        name: 'Tabs'
    };
    $scope.clear = function () {
        $scope.postData.name = '';
        $scope.loadData();
    }
    $scope.new = function () {
        $location.search({ tid: $scope.tid });
        $location.path('/examdetail');
    };
    $scope.view = function (id) {
        $location.search({ id: id, view: 1, tid: $scope.tid });
        $location.path('/examdetail');
    };
    $scope.edit = function (id) {
        $location.search({ id: id, edit: 1, tid: $scope.tid });
        $location.path('/examdetail');
    };

    $scope.delNode = function (node) {
        if (!node.id || node.id == '') return;
        alertService.confirm('确认删除吗？', function () {
            $scope.loadmask.show();
            var url = constVar.baseUrl + 'exams/' + node.id + '?rd=' + Math.random();
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
                    $scope.loadData();
                } else {
                    alertService.error(d.meta.code + ',' + d.meta.msg);
                }
            }).error(function (data, header, config, status) {
                $scope.loadmask.hide();
            });
        });
    };
    $scope.import = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop: false,
            templateUrl: 'ExamImport.html',
            controller: modalExamImportController,
            size: 'lg',
            resolve: {
                pscope: function () {
                    return $scope;
                }
            }
        });
    };
    $scope.loadDiseaseTypes();
};
var modalExamImportController = function ($scope, $http, FileUploader, $uibModalInstance, pscope, alertService) {
    $scope.plugin = new petPlugin();
    $scope.loadmask = $scope.plugin.CreateMask({
        style: 'z-index:9999;',
        id: 'test_Mask',
        loadingImage: true
    });
    $scope.file = null;
    var uploader = $scope.uploader = new FileUploader({
        url: constVar.baseUrl + 'exams/import?rd=' + Math.random(),
        headers: { "Authorization": "admin" },
        method: "POST",
        removeAfterUpload: true
    });

    // FILTERS
    uploader.filters.push({
        name: 'customFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });
    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {

    };
    uploader.onAfterAddingFile = function (fileItem) {

    };
    uploader.onAfterAddingAll = function (addedFileItems) {

    };

    uploader.onBeforeUploadItem = function (item) {
        console.info('onBeforeUploadItem', item);
        formData = [{
            name: item.file.name.split('.')[0]
        }];
        Array.prototype.push.apply(item.formData, formData);
    };
    uploader.onProgressItem = function (fileItem, progress) {

    };
    uploader.onProgressAll = function (progress) {

    };
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        $scope.loadmask.hide();
        $uibModalInstance.dismiss('cancel');
        if (response.meta.code == '200') {
            alertService.success('导入成功,共导入' + response.data + '条数据');

            pscope.loadTree();
        } else {
            alertService.error('导入失败,' + response.meta.msg);
        }
    };
    uploader.onErrorItem = function (fileItem, response, status, headers) {
    };
    uploader.onCancelItem = function (fileItem, response, status, headers) {

    };
    uploader.onCompleteItem = function (fileItem, response, status, headers) {

    };
    uploader.onCompleteAll = function () {

    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.ok = function () {
        if ($scope.file == null || $scope.file.name == '') {
            alertService.info('请选择文件');
            return;
        } else {
            var fileName = $scope.file.name;
            var mime = fileName.toLowerCase().substr(fileName.lastIndexOf("."));
            if (!(mime == '.xls' || mime == '.xlsx')) {
                alertService.info('请选择excel文件');
                return;
            }
        }
        $scope.loadmask.show();
        uploader.queue[0].upload();
    };
}