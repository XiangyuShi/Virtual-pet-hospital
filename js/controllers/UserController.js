var UserController = function ($scope, $http, $uibModal, alertService) {
    $scope.plugin = new petPlugin();
    $scope.plugin.InitializePlugin();
    $scope.selectedNode = {};
    $scope.systemRoles = {};
    $scope.prevId = '';
    $scope.searchText = '';
    $scope.add = true;
    $scope.loadmask = $scope.plugin.CreateMask({
        style: 'z-index:9999;',
        id: 'test_Mask',
        loadingImage: true
    });

    $scope.clearForm = function () {
        $scope.selectedNode = {
            name: '', logname: '', password: '', confirmPassword: '', email: '', roleId: '', status: '1', no: ''
        };
    }
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
                    treeData.children.push({ id: d.data[i].id, name: d.data[i].name + '(' + d.data[i].logname + ')', children: [] });
                }
            } else {
                alertService.error(d.meta.code + ',' + d.meta.msg);
            }
        }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
        $scope.resultSet = [treeData];
    }
    $scope.searchKeyDown = function (event) {
        if (event.keyCode == 13) {
            $scope.loadTree();
        }
    };
    $scope.loadSystemRole = function () {
        $scope.loadmask.show();
        var url = constVar.baseUrl + 'systemRoles/?rd=' + Math.random();
        $http({
            url: url,
            method: "GET",
            headers: { "Authorization": "admin" },
            dataType: "json"
        }).success(function (d) {
            $scope.loadmask.hide();
            if (d.meta.code == '200') {
                $scope.systemRoles = d.data;
            } else {
                alertService.error(d.meta.code + ',' + d.meta.msg);
            }
        }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    }
    $scope.showCase = function (node) {
        $scope.getTreeNode(node.id);
    }
    $scope.getTreeNode = function (id) {
        if (id == '-1') return;
        $scope.loadmask.show();
        var url = constVar.baseUrl + 'users/' + id + '?rd=' + Math.random();
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
                $scope.selectedNode.password = '********';
                $scope.selectedNode.confirmPassword = $scope.selectedNode.password;
                $scope.selectedNode.status = String($scope.selectedNode.status);
                $scope.prevId = id;
                $scope.add = false;
            } else {
                alertService.error(d.meta.code + ',' + d.meta.msg);
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
        $scope.loadmask.show();
        var node = {
            name: $scope.selectedNode.name,
            logname: $scope.selectedNode.logname,
            password: $scope.selectedNode.password,
            confirmPassword: $scope.selectedNode.confirmPassword,
            email: $scope.selectedNode.email,
            roleId: $scope.selectedNode.roleId,
            status: $scope.selectedNode.status,
            no: $scope.selectedNode.no
        };
        var url = '';
        if ($scope.add)
            url = constVar.baseUrl + 'users?rd=' + Math.random();
        else {
            url = constVar.baseUrl + 'users/' + $scope.selectedNode.id + '?rd=' + Math.random();
            if (node.password == '********') {
                node.password = '';
            }
        }
        if (node.password != '')
            node.password = $.md5(node.password);
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
                $scope.selectedNode.password = '********';
                $scope.selectedNode.confirmPassword = $scope.selectedNode.password;
            }
            else if (d.meta.code == '502') {
                alertService.error('用户名已存在');
            }
            else {
                alertService.error(d.meta.code + ',' + d.meta.msg);
            }
        }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    }
    $scope.delNode = function (node) {
        if (!node.id || node.id == '') return;

        alertService.confirm('确认删除吗？',
            function () {
                $scope.loadmask.show();
                var url = constVar.baseUrl + 'users/' + node.id + '?rd=' + Math.random();
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
                        $scope.loadTree();
                        $scope.add = true;
                    } else {
                        alertService.error(d.meta.code + ',' + d.meta.msg);
                    }
                }).error(function (data, header, config, status) {
                    $scope.loadmask.hide();
                });

            });
    }
    $scope.import = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop: false,
            templateUrl: 'UserImport.html',
            controller: modalUserImportController,
            size: 'lg',
            resolve: {
                pscope: function () {
                    return $scope;
                }
            }
        });
    }
    $scope.clearForm();
    $scope.loadTree();
    $scope.loadSystemRole();
};
var modalUserImportController = function ($scope, $http, FileUploader, $uibModalInstance, pscope, alertService) {
    $scope.plugin = new petPlugin();
    $scope.loadmask = $scope.plugin.CreateMask({
        style: 'z-index:9999;',
        id: 'test_Mask',
        loadingImage: true
    });
    $scope.file = null;
    var uploader = $scope.uploader = new FileUploader({
        url: constVar.baseUrl + 'users/import?rd=' + Math.random(),
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