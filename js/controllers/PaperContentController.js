var PaperContentController = function ($scope, $http, $location, $filter, $uibModal, alertService) {
    $scope.plugin = new petPlugin();
    $scope.loadmask = $scope.plugin.CreateMask({
        style: 'z-index:9999;',
        id: 'test_Mask',
        loadingImage: true
    });
    $scope.modal = $scope.plugin.CreateModal({
        id: 'modal',
        title: '输入序号',
        width: 220,
        height: 100,
        showFooter: false,
        contentElement: 'divNo'
    });
    var date = new Date();
    date.setMonth(date.getMonth() + 1);
    $scope.initialize = function () {
        $scope.paper = {
            id: '',
            name: '',
            totalMins: 60,
            score: 1,
            totalScore: 0,
            type: '1',
            status: '1',
            exams: []
        };
        $scope.id = '';
        $scope.edit = false;
        $scope.view = false;
        var id = $location.search()['id'];
        var edit = $location.search()['edit'];
        var view = $location.search()['view'];
        if (id && id != undefined) {
            $scope.id = $location.search()['id'];
            $scope.loadPaperContent(id);
        }
        if (edit && edit != undefined) {
            $scope.edit = true;
        }
        if (view && view != undefined) {
            $scope.view = true;
        }
        $(document).find('input[bootstrapDatetime]').datetimepicker({
            format: 'yyyy-mm-dd',
            minView: 2,
            autoclose: true,
            language: 'zh-CN',
            todayBtn: true
        });
    };
    $scope.loadPaperContent = function (id) {
        $scope.loadmask.show();
        var url = constVar.baseUrl + 'papers/' + id + '?rd=' + Math.random();
        $http({
            url: url,
            method: "GET",
            headers: { "Authorization": "admin" },
            dataType: "json"
        }).success(function (d) {
            $scope.loadmask.hide();
            if (d.meta.code == '200') {
                $scope.paper = d.data;
                $scope.paper.type = String($scope.paper.type);
                $scope.paper.status = String($scope.paper.status);
                $scope.reCalScore();
            } else {
                alertService.error(d.meta.code + ',' + d.meta.msg);
            }
        }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    };
    $scope.indexOfQList = function (id) {
        var index = -1;
        for (var i = 0; i < $scope.paper.exams.length; i++) {
            if ($scope.paper.exams[i].id == id) {
                index = i;
                break;
            }
        }
        return index;
    }
    $scope.removeQ = function (id) {
        var index = $scope.indexOfQList(id);
        if (index != -1)
            $scope.paper.exams.splice(index, 1);
        $scope.reCalScore();
    };
    $scope.moveUpQ = function (id) {
        var index = $scope.indexOfQList(id);
        $scope.exchangeQ(index, index - 1);
    };
    $scope.moveDownQ = function (id) {
        var index = $scope.indexOfQList(id);
        $scope.exchangeQ(index, index + 1);
    };
    $scope.moveToQ = function (id) {
        $('#divNo').find('input[type="text"]').val('');
        $scope.moveFromIndex = $scope.indexOfQList(id);
        $scope.modal.show();
    };
    $scope.confirmMoveToQ = function () {
        var index = parseInt($('#divNo').find('input[type="text"]').val());
        $scope.exchangeQ($scope.moveFromIndex, index - 1);
        $scope.modal.hide();
    }
    $scope.cancelModal = function () {
        $scope.modal.hide();
    }
    $scope.exchangeQ = function (index1, index2) {
        if (index1 >= 0 && index2 >= 0 && index1 < $scope.paper.exams.length && index2 < $scope.paper.exams.length && index1 != index2) {
            var temp = $scope.paper.exams[index1];
            $scope.paper.exams[index1] = $scope.paper.exams[index2];
            $scope.paper.exams[index2] = temp;
        }
    };
    $scope.reCalScore = function () {
        $scope.paper.totalScore = $scope.paper.score * $scope.paper.exams.length;
    };
    $scope.addQuestion = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop: false,
            templateUrl: 'ModalNewTest.html',
            controller: paperContentModalInstanceController,
            size: 'lg',
            resolve: {
                data: function () {
                    return $scope.paper;
                }
            }
        });
    };
    $scope.getQList = function () {
        var array = new Array();
        return array;
    };
    $scope.save = function (isValid) {
        if (!isValid) return;
        $scope.loadmask.show();
        var url = '';
        if ($scope.edit)
            url = constVar.baseUrl + 'papers/' + $scope.paper.id + '?rd=' + Math.random();
        else
            url = constVar.baseUrl + 'papers?rd=' + Math.random();
        $http({
            url: url,
            method: "POST",
            headers: { "Authorization": "admin" },
            dataType: "json",
            data: $scope.paper
        }).success(function (d) {
            $scope.loadmask.hide();
            if (d.meta.code == '200') {
                alertService.success('保存成功');
                $location.path('/paper');
            } else if (d.meta.code == '001') {
                alertService.info('该考卷已被使用,不能修改');
            } else {
                alertService.error(d.meta.code + ',' + d.meta.msg);
            }
        }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    };
    $scope.back = function () {
        $location.search({});
        $location.path('/paper');
    };

    $scope.initialize();
};

var paperContentModalInstanceController = function ($scope, $http, $uibModalInstance, data, alertService) {
    $scope.plugin = new petPlugin();
    $scope.loadmask = $scope.plugin.CreateMask({
        style: 'z-index:9999;',
        id: 'test_Mask',
        loadingImage: true
    });
    $scope.isCollapsed = true;
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
    $scope.pagging = {
        maxSize: 5,
        pageSize: '10',
        pageIndex: 1,
        pageTotal: 0
    };
    $scope.postData = { name: '', typeid: '' };
    $scope.items = {};
    $scope.data = data;
    $scope.ok = function () {
        for (var i = 0; i < $scope.items.length ; i++) {
            if ($scope.items[i].checked) {
                var exist = false;
                for (var j = 0; j < $scope.data.exams.length; j++) {
                    if ($scope.data.exams[j].id == $scope.items[i].id) {
                        exist = true;
                        break;
                    }
                }
                if (!exist)
                    $scope.data.exams.push($scope.items[i]);
            }
        }
        $scope.data.totalScore = $scope.data.score * $scope.data.exams.length;
        $scope.cancel();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.clear = function () {
        $scope.postData.name = '';
        $scope.postData.typeid = '';
        $scope.loadExamData();
    };
    $scope.loadExamData = function () {
        $scope.loadmask.show();
        var url = constVar.baseUrl + 'examsPage?rd=' + Math.random();
        var data = {
            pageSize: $scope.pagging.pageSize,
            pageIndex: $scope.pagging.pageIndex,
            name: $scope.postData.name,
            typeid: $scope.postData.typeid
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
            $scope.loadExamData();
        }
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
    $scope.loadDiseaseTypes();
    $scope.loadExamData();
};