/**
 * Created by Nova on 2016/5/23.
 */

var PictureController = function ($scope, $http, FileUploader) {
    $scope.pictureItems = {};//接受获取到全部的数据

    $scope.keyWords = '';//搜索关键词
    $scope.hitText = '';//提示词默认为空
    $scope.showUploadPaneAttr = false;//ng-show属性控制显示上传面板是否
    $scope.showFileItemAttr = false;//ng-show属性控制显示图像列表是否

    $scope.plugin = new petPlugin();
    $scope.loadmask = $scope.plugin.CreateMask({
        style: 'z-index:9999;',
        id: 'test_Mask',
        loadingImage: true
    });
    //当前选择的科室
    $scope.phaseDepartment = {
        id: '',
        name: "其他"
    };
    //当前选择的病种大类
    $scope.phaseDiseaseTypesForSelect = {
        id: '',
        name: "其他"
    }
    //当前选择的病种中的小类
    $scope.phaseDiseasesForSelect = {
        id: '',
        name: "其他"
    }

    //分页栏的数据
    $scope.pagging = {
        maxSize: 5,
        pageSize: '12',
        pageIndex: 1,
        pageTotal: 0
    };
    //分页
    $scope.paginate = function () {
        $scope.currentPictureItems = {};//当前页面的数据
        for (var i = ($scope.pagging.pageIndex - 1) * $scope.pagging.pageSize, j = 0; i < $scope.pictureItems.length && j < $scope.pagging.pageSize; i++, j++) {
            $scope.currentPictureItems[j] = {
                name: $scope.pictureItems[i].name,
                id: $scope.pictureItems[i].id,
                img: $scope.pictureItems[i].img
            };
        }
    };
    $scope.initPictureItems = function (keyWords) {
        $http({
            url: constVar.baseUrl + 'API/Management/PictureNodes?word=' + encodeURI(keyWords) + '&rd=' + Math.random(),
            method: "GET",
            headers: {"Authorization": "admin"},
            dataType: "json"
        }).success(function (d) {
            if (d.meta.code == '200') {
                $scope.pictureItems = d.data;
                if (d.data.length != 0) {
                    $scope.hitText = '本次查询到' + d.data.length + '张图片';
                    $scope.pagging.pageTotal = d.data.length;
                    $scope.paginate();
                    //$scope.pagging.pageTotal=200;//测试用
                } else {
                    $scope.hitText = '没有找到符合的图片';
                }

            }
            else {
                //alert(d.meta.code + ',' + d.meta.msg);
                swal({
                    title: "发生错误!",
                    text: d.meta.code + "," + d.meta.msg,
                    type: "error"
                });
            }
        });
    };

    //选择科室，确定department
    $scope.showDepartment = function (value) {
        $scope.phaseDepartment = value;
    };
    //选择病种大类后获取该大类的病种
    $scope.showDiseaseTypes = function (value) {
        if (value == null) {
            $scope.phaseDiseaseTypesForSelect = '其他';
        } else {
            $scope.loadDiseases(value);
            $scope.phaseDiseaseTypesForSelect = value;
        }

    };
    //选择病种后，病例名称生成默认值
    $scope.showDiseases = function (value) {
        $scope.phaseDiseasesForSelect = value;
    }
    //获取selectValue.departmentsForSelect
    $scope.loadDepartments = function () {
        $scope.loadmask.show();
        $http({
            url: constVar.baseUrl + 'API/Func/Departments?rd=' + Math.random(),
            method: "GET",
            headers: {"Authorization": "admin"},
            dataType: "json"
        }).success(function (d) {
            if (d.meta.code == '200') {
                $scope.selectValue.departmentsForSelect = [];
                for (var i = 0; i < d.data.length; i++) {
                    var records = {};
                    records.id = d.data[i]['id'];
                    records.name = d.data[i]['name'];
                    records.department = d.data[i]['department'];
                    $scope.selectValue.departmentsForSelect.push(records);
                }
                $scope.loadmask.hide();
            }
            else {
                //alert(d.meta.code + ',' + d.meta.msg);
                swal({
                    title: "发生错误!",
                    text: d.meta.code + "," + d.meta.msg,
                    type: "error"
                });
            }
        });
    };
    //获取selectValue.diseaseTypesForSelect
    $scope.loadDiseaseTypes = function () {

        $http(
            {
                url: constVar.baseUrl + 'API/DiseaseTypes?rd=' + Math.random(),
                method: "GET",
                headers: {"Authorization": "admin"},
                dataType: "json"
            })
            .success(function (d) {
                if (d.meta.code == '200') {
                    $scope.selectValue.diseaseTypesForSelect = [];
                    for (var i = 0; i < d.data.length; i++) {
                        var records = {};
                        records.id = d.data[i]['id'];
                        records.name = d.data[i]['name'];
                        $scope.selectValue.diseaseTypesForSelect.push(records);
                    }
                    //console.log(JSON.stringify($scope.selectValue.diseaseTypesForSelect));
                }
                else {
                    //alert(d.meta.code + ',' + d.meta.msg);
                    swal({
                        title: "发生错误!",
                        text: d.meta.code + "," + d.meta.msg,
                        type: "error"
                    });
                }

            });
    };

    //获取diseaseTypesForSelect.diseasesForSelect
    $scope.loadDiseases = function (value) {
        $scope.loadmask.show();
        $http(
            {
                url: constVar.baseUrl + 'API/DiseaseTypes/' + value.id + '/Diseases?rd=' + Math.random(),
                method: "GET",
                headers: {"Authorization": "admin"},
                dataType: "json"
            })
            .success(function (d) {
                $scope.diseaseTypesForSelect.diseasesForSelect = [];
                $scope.diseasesForSelect = '';
                if (d.meta.code == '200') {
                    for (var i = 0; i < d.data.length; i++) {
                        var records = {};
                        records.id = d.data[i]['id'];
                        records.name = d.data[i]['name'];
                        $scope.diseaseTypesForSelect.diseasesForSelect.push(records);
                    }
                    $scope.loadmask.hide();
                    //console.log(JSON.stringify($scope.selectValue.diseasesForSelect));
                }
                else {
                    //alert(d.meta.code + ',' + d.meta.msg);
                    swal({
                        title: "发生错误!",
                        text: d.meta.code + "," + d.meta.msg,
                        type: "error"
                    });
                }
            });
    };

    //搜索关键字
    $scope.searchByPictureName = function (keyWords) {
        $scope.initPictureItems(keyWords);
        $scope.showUploadPaneAttr = false;
        $scope.showFileItemAttr = true;

    };
    //点击上传按钮
    $scope.showUploadPane = function () {
        $scope.showUploadPaneAttr = true;
        $scope.showFileItemAttr = false;
        $scope.hitText = '';
    };

    //删除图片
    $scope.deletePicture = function (id) {
        swal({
            title: "确认删除该图片吗?",
            text: "你将会删除该图片不可恢复!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnConfirm: false
        }, function () {
            $http({
                url: constVar.baseUrl + 'API/Management/PictureNodes/' + id,
                method: "DELETE",
                headers: {"Authorization": "admin"},
                dataType: "json"
            }).success(function (d) {
                if (d.meta.code == '200') {
                    $scope.initPictureItems('');

                    swal({
                        title: "删除成功!",
                        text: "该图片已删除！",
                        type: "success"
                    });
                }
                else {
                    // alert("图片正在使用，不能删除！");
                    swal({
                        title: "不能删除!",
                        text: "图片正在使用，请勿删除!",
                        type: "error"
                    });
                }
            });
        });
    };

    //初始化
    $scope.initPackage = function () {
        $scope.selectValue = {
            departmentsForSelect: [],
            diseaseTypeForSelect: []
        };
        $scope.loadDepartments();
        $scope.loadDiseaseTypes();
        // $scope.initPictureItems('');
    };
    $scope.initPackage();

    var uploader = $scope.uploader = new FileUploader({
        url: constVar.baseUrl + 'API/Management/PictureNodes',
        headers: {"Authorization": "admin"},
        method: "POST",
        //removeAfterUpload: true
    });


    // FILTERS
    uploader.filters.push({
        name: 'customFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function (fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function (addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };

    uploader.onBeforeUploadItem = function (item) {
        console.info('onBeforeUploadItem', item);
        formData = [{
            name: $scope.phaseDepartment.name + '_' + $scope.phaseDiseaseTypesForSelect.name + '_' + $scope.phaseDiseasesForSelect.name + '_' + item.file.name
        }];
        Array.prototype.push.apply(item.formData, formData);
    };
    uploader.onProgressItem = function (fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function (progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function (fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function (fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function () {
        console.info('onCompleteAll');

        //uploader.clearQueue();
        //$scope.initPictureItems('');
    };

    console.info('uploader', uploader);


};
