/**
 * Created by yichli on 4/16/16.
 */

var OperateController = function ($scope, $http, $location, $compile, $uibModal, $log, $window, $interval, $anchorScroll) {
    $scope.plugin = new petPlugin();
    $scope.currentOperateContent = '';
    $scope.currentOperateId = '';
    $scope.currentNode = '';
    $scope.normalDocName = '';
    $scope.operateList = [];
    /* for modal animation and other typical animation*/
    $scope.animationsEnabled = true;
    /* control of the show of right part */
    $scope.isWord = false;
    $scope.isPicture = false;
    $scope.isVedio = false;
    $scope.isPictureGroup = false;
    $scope.isVedioGroup = false;
    $scope.isMedicine = false;
    $scope.medicineTypes = [];
    $scope.medicines = [];
    $scope.normalDocID = $location.search().normalDocId;
    $scope.messageForSearch = $location.search().message;
    $scope.currentCaseId = $location.search().caseId;
    $scope.active = $location.search().index;
    $scope.page = $location.search().page;
    $scope.departmentId = $location.search().departmentId;
    $scope.freeExamId = $location.search().freeExamId;
    $scope.freeExamName = $location.search().freeExamName;
    $scope.freeModuleId = $location.search().freeModuleId;
    $scope.contentNormalDocId = $location.search().contentNormalDocId;
    $scope.answerNormalDocId = $location.search().answerNormalDocId;
    $scope.tid = $location.search().tid;
    $scope.items=$location.search().items;
    /* show or hide images,videos lib*/
    $scope.imgShow = false;
    //$scope.videoShow = false;
    $scope.pagging = {
        maxSize: 5,
        pageSize: '10',
        pageIndex: 1,
        pageTotal: 0
    };
    $scope.vidpagging = {
        maxSize: 5,
        pageSize: '9',
        pageIndex: 1,
        pageTotal: 0
    };
    $scope.imgpagging = {
        maxSize: 5,
        pageSize: '9',
        pageIndex: 1,
        pageTotal: 0
    };
    $scope.videos = [];
    /* modal */
    $scope.alertMe = function () {
        setTimeout(function () {
            $window.alert('You\'ve selected the alert tab!');
        });
    };

    /* modal conversation*/
    $scope.open = function (size) {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'myModalContent.html',
            controller: ModalInstanceCtrl,
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

    $scope.println = function (id, type) {
        if (type == "word") {
            $scope.deleteWord(id);
        }
        if (type == "videoGroup") {
            $scope.deleteVideoGroup(id);
        }
        if (type == 'video') {
            $scope.deleteVideo(id);
        }
        if (type == 'picGroup') {
            $scope.deletePicGroup(id);
        }
        if (type == 'pic') {
            $scope.deletePicture(id);
        }
    };

    $scope.model = {
        name: 'Tabs'
    };

    /* click and show related type */
    $scope.showCase = function (value) {
        $scope.currentNode = value;
        $scope.currentOperateName = value.roleName;
        $scope.currentOperateId = value.roleId;
        if (value.type == "word") {
            $scope.currentOperateContent = value.content;
            $scope.isWord = true;
            $scope.isPicture = false;
            $scope.isVideo = false;
            $scope.isWordGroup = false;
            $scope.isPictureGroup = false;
            $scope.isVideoGroup = false;
            $scope.isMedicine = false;
        }
        if (value.type == "pic") {
            $scope.isWord = false;
            $scope.isPicture = true;
            $scope.isVideo = false;
            $scope.isWordGroup = false;
            $scope.isPictureGroup = false;
            $scope.isVideoGroup = false;
            $scope.isMedicine = false;
        }
        if (value.type == "video") {
            $scope.isWord = false;
            $scope.isPicture = false;
            $scope.isVideo = true;
            $scope.isWordGroup = false;
            $scope.isPictureGroup = false;
            $scope.isVideoGroup = false;
            $scope.isMedicine = false;
        }
        if (value.type == "picGroup") {
            $scope.isWord = false;
            $scope.isPicture = false;
            $scope.isVideo = false;
            $scope.isWordGroup = false;
            $scope.isPictureGroup = true;
            $scope.isVideoGroup = false;
            $scope.isMedicine = false;
            $scope.imgShow = true;
            //$scope.showImages();
        }
        if (value.type == "videoGroup") {
            $scope.isWord = false;
            $scope.isPicture = false;
            $scope.isVideo = false;
            $scope.isWordGroup = false;
            $scope.isPictureGroup = false;
            $scope.isVideoGroup = true;
            $scope.isMedicine = false;
            $scope.imgShow = false;
        }

    };

    /* loadmask action */
    $scope.loadmask = $scope.plugin.CreateMask({
        style: 'z-index:9999;',
        id: 'test_Mask',
        loadingImage: true
    });
    //新增文字组，图片组，视频组
    $scope.add = function (name) {
        $scope.isMedicine = false;
        if ($scope.normalDocSelect == 1) {
            $scope.addWord(name);
        }
        else if ($scope.normalDocSelect == 3) {
            $scope.addPicGroup(name);
        }
        else if ($scope.normalDocSelect == 2) {
            $scope.addVideoGroup(name);
        }
        else if ($scope.normalDocSelect == 0) {
            swal({
                title: "请选择组别",
                type: "error",
                timer: 4000,
                closeOnConfirm: true
            });
        }
        else if ($scope.normalDocSelect == undefined) {
            swal({
                title: "请选择组别",
                type: "error",
                timer: 4000,
                closeOnConfirm: true
            });
        }

    };

    //监听回车按键
    $scope.addKeyDown = function (event) {
        if (event.keyCode == 13) {
            $scope.add($scope.normalDocName);
        }
    };

    //增加文字
    $scope.addWord = function (value) {
        if (value == null || value == "") {
            swal({
                title: "请填写名称",
                type: "error",
                timer: 3000
            });
            return;
        }
        var d = {
            name: value,
            content: " "
        };
        $scope.normalDocName = '';
        $scope.currentOperateName = value;
        $scope.loadmask.show();
        $http(
            {
                url: constVar.baseUrl + 'API/NormalDocs/' + $scope.normalDocID + '/TextNodes?rd=' + Math.random(),
                method: "Post",
                data: JSON.stringify(d),
                contentType: 'application/json;charset=utf-8',
                headers: {"Authorization": "admin"},
                dataType: "json"
            })
            .success(function (d) {
                $scope.loadmask.hide();
                if (d.meta.code == '200') {
                    $scope.currentOperateId = d.data.id;
                    $scope.currentOperateContent = d.data.content;
                    swal({
                        title: "新增文字成功 ",
                        type: "success",
                        timer: 2000,
                    });
                    $scope.initPackage();
                    $scope.isWord = true;
                    $scope.isPicture = false;
                    $scope.isVideo = false;
                    $scope.isWordGroup = false;
                    $scope.isPictureGroup = false;
                    $scope.isVideoGroup = false;
                }
                else {
                    alert(d.meta.code);
                }
            }).error(function () {
            $scope.loadmask.hide();
        });
    };

    //修改文字内容
    $scope.editWord = function (value) {
        var d = {
            name: $scope.currentOperateName,
            content: value
        };
        $scope.loadmask.show();
        $http(
            {
                url: constVar.baseUrl + 'API/TextNodes/' + $scope.currentOperateId + '?rd=' + Math.random(),
                method: "PATCH",
                data: JSON.stringify(d),
                contentType: 'application/json;charset=utf-8',
                headers: {"Authorization": "admin"},
                dataType: "json"
            })
            .success(function (d) {
                $scope.loadmask.hide();
                if (d.meta.code == '200') {
                    swal({
                        title: "保存成功 ",
                        type: "success",
                        timer: 2000,
                    });
                    $scope.initPackage();
                }
                else {
                    alert(d.meta.code);
                }
            }).error(function () {
            $scope.loadmask.hide();
        });
    };

    //增加图片组
    $scope.addPicGroup = function (value) {
        if (value == null || value == "") {
            swal({
                title: "请填写名称",
                type: "error",
                timer: 3000
            });
            return;
        }
        var d = {
            name: value
        };
        $scope.loadmask.show();
        $.ajax(
            {
                url: constVar.baseUrl + 'API/NormalDocs/' + $scope.normalDocID + '/PictureGroups?rd=' + Math.random(),
                method: "Post",
                data: JSON.stringify(d),
                contentType: 'application/json;charset=utf-8',
                headers: {"Authorization": "admin"},
                dataType: "json"
            })
            .success(function (d) {
                $scope.loadmask.hide();
                if (d.meta.code == '200') {
                    swal({
                        title: "新增图片组成功",
                        type: "success",
                        timer: 2000,
                    });
                    $scope.initPackage();
                    $scope.currentOperateId = d.data.id;
                    $scope.currentOperateName = d.data.name;
                    $scope.isWord = false;
                    $scope.isPicture = false;
                    $scope.isVideo = false;
                    $scope.isWordGroup = false;
                    $scope.isPictureGroup = true;
                    $scope.imgShow = true;
                    $scope.isVideoGroup = false;
                    //$scope.showImages();
                }
                else {
                    alert(d.meta.code);
                }
            }).error(function () {
            $scope.loadmask.hide();
        });
    };
    //双击图片
    $scope.imgDbClick = function (img) {
        img.isChecked = !img.isChecked;
    }
    //增加图片
    $scope.addPic = function () {
        var array = [];
        var a = [];
        for (var i = 0; i < $scope.imgItems.length; i++) {
            var img = $scope.imgItems[i];
            if (img.isChecked)
                array.push(img);
        }
        if (array.length == 0) {
            swal({
                title: "请选择至少一张图片 ",
                type: "error",
                timer: 3000
            });
            return;
        }
        for (var i = 0; i < array.length; i++) {
            a[i] = {name: array[i].name, picture_id: array[i].id};
        }
        var d = {
            "picture_group_picture_node_post_request_list": a
        };
        $scope.loadmask.show();
        $.ajax(
            {
                url: constVar.baseUrl + 'API/PictureGroups/' + $scope.currentOperateId + '/PictureNodes/Batch?rd=' + Math.random(),
                method: "Post",
                data: JSON.stringify(d),
                contentType: 'application/json;charset=utf-8',
                headers: {"Authorization": "admin"},
                dataType: "json"
            })
            .success(function (d) {
                $scope.loadmask.hide();
                if (d.meta.code == '200') {
                    swal({
                        title: "添加图片成功 ",
                        type: "success",
                        timer: 2000,
                    });
                    for (var i = 0; i < $scope.imgItems.length; i++) {
                        var img = $scope.imgItems[i];
                        if (img.isChecked)
                            img.isChecked = !img.isChecked;
                    }
                    $scope.initPackage();
                }
                else {
                    alert(d.meta.code);
                    return;
                }
            }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    };

    //增加视频组
    $scope.addVideoGroup = function (value) {
        if (value == null || value == "") {
            swal({
                title: "请填写名称",
                type: "error",
                timer: 3000
            });
            return;
        }
        var d = {
            name: value
        };
        $scope.loadmask.show();
        $.ajax(
            {
                url: constVar.baseUrl + 'API/NormalDocs/' + $scope.normalDocID + '/VideoGroups?rd=' + Math.random(),
                method: "Post",
                data: JSON.stringify(d),
                contentType: 'application/json;charset=utf-8',
                headers: {"Authorization": "admin"},
                dataType: "json"
            })
            .success(function (d) {
                $scope.loadmask.hide();
                if (d.meta.code == '200') {
                    swal({
                        title: "新增视频组成功 ",
                        type: "success",
                        timer: 2000,
                    });
                    $scope.initPackage();
                    $scope.currentOperateId = d.data.id;
                    $scope.currentOperateName = d.data.name;
                    $scope.isWord = false;
                    $scope.isPicture = false;
                    $scope.isVideo = false;
                    $scope.isWordGroup = false;
                    $scope.isPictureGroup = false;
                    $scope.isVideoGroup = true;
                }
                else {
                    alert(d.meta.code);
                }
            }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    };
    //双击视频
    $scope.videoDbClick = function (vid) {
        vid.isChecked = !vid.isChecked;
    }
    //增加视频
    $scope.addVid = function () {
        var array = [];
        var a = [];
        for (var i = 0; i < $scope.vidItems.length; i++) {
            var vid = $scope.vidItems[i];
            if (vid.isChecked)
                array.push(vid);
        }
        if (array.length == 0) {
            swal({
                title: "请选择至少一个视频",
                type: "error",
                timer: 3000
            });
            return;
        }
        for (var i = 0; i < array.length; i++) {
            a[i] = {name: array[i].name, video_id: array[i].id};
        }
        var d = {
            "video_group_video_node_post_request_list": a
        };
        $scope.loadmask.show();
        $.ajax(
            {
                url: constVar.baseUrl + 'API/VideoGroups/' + $scope.currentOperateId + '/VideoNodes/Batch?rd=' + Math.random(),
                method: "Post",
                data: JSON.stringify(d),
                contentType: 'application/json;charset=utf-8',
                headers: {"Authorization": "admin"},
                dataType: "json"
            })
            .success(function (d) {
                $scope.loadmask.hide();
                if (d.meta.code == '200') {
                    swal({
                        title: "添加视频成功",
                        type: "success",
                        timer: 2000,
                    });
                    for (var i = 0; i < $scope.vidItems.length; i++) {
                        var vid = $scope.vidItems[i];
                        if (vid.isChecked)
                            vid.isChecked = !vid.isChecked;
                    }
                    $scope.initPackage();
                }
                else {
                    alert(d.meta.code);
                    return;
                }
            }).error(function () {
            $scope.loadmask.hide();
        });
    };

    //删除文字
    $scope.deleteWord = function (id) {
        swal({
            title: "确定删除文字吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnConfirm: false
        }, function () {
            $scope.loadmask.show();
            $.ajax(
                {
                    url: constVar.baseUrl + 'API/TextNodes/' + id + '?rd=' + Math.random(),
                    method: "DELETE",
                    headers: {"Authorization": "admin"},
                    dataType: "json"
                })
                .success(function (d) {
                    $scope.loadmask.hide();
                    if (d.meta.code == '200') {
                        swal({
                            title: "删除文字成功 ",
                            type: "success",
                            timer: 2000
                        });
                        $scope.initPackage();
                        $scope.isWord = false;
                    }
                    else {
                        alert(d.meta.code);
                    }
                }).error(function () {
                $scope.loadmask.hide();
            });
        });

    };

    //删除视频组
    $scope.deleteVideoGroup = function (id) {
        swal({
            title: "确定删除视频组吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnConfirm: false
        }, function () {
            $scope.loadmask.show();
            $http(
                {
                    url: constVar.baseUrl + 'API/VideoGroups/' + id + '/Enforce?rd=' + Math.random(),
                    method: "DELETE",
                    headers: {"Authorization": "admin"},
                    dataType: "json"
                })
                .success(function (d) {
                    $scope.loadmask.hide();
                    if (d.meta.code == '200') {
                        swal({
                            title: "删除视频组成功 ",
                            type: "success",
                            timer: 2000
                        });
                        $scope.initPackage();
                        $scope.isVideoGroup = false;
                    }
                    else {
                        alert(d.meta.code);
                    }
                }).error(function () {
                $scope.loadmask.hide();
            });
        });

    };

    //删除视频
    $scope.deleteVideo = function (id) {
        swal({
            title: "确定删除视频吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnConfirm: false
        }, function () {
            $scope.loadmask.show();
            $http(
                {
                    url: constVar.baseUrl + 'API/VideoNodes/' + id + '?rd=' + Math.random(),
                    method: "DELETE",
                    headers: {"Authorization": "admin"},
                    dataType: "json"
                })
                .success(function (d) {
                    $scope.loadmask.hide();
                    if (d.meta.code == '200') {
                        swal({
                            title: "删除视频成功 ",
                            type: "success",
                            timer: 2000
                        });
                        $scope.initPackage();
                        $scope.isVideo = false;
                    }
                    else {
                        alert(d.meta.code);
                    }
                }).error(function () {
                $scope.loadmask.hide();
            });
        });

    };

    //删除图片组
    $scope.deletePicGroup = function (id) {
        swal({
            title: "确定删除图片组吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnConfirm: false
        }, function () {
            $scope.loadmask.show();
            $http(
                {
                    url: constVar.baseUrl + 'API/PictureGroups/' + id + '/Enforce?rd=' + Math.random(),
                    method: "DELETE",
                    headers: {"Authorization": "admin"},
                    dataType: "json"
                })
                .success(function (d) {
                    $scope.loadmask.hide();
                    if (d.meta.code == '200') {
                        swal({
                            title: "删除图片组成功 ",
                            type: "success",
                            timer: 2000
                        });
                        $scope.initPackage();
                        $scope.isPictureGroup = false;
                    }
                    else {
                        alert(d.meta.code);
                    }
                }).error(function () {
                $scope.loadmask.hide();
            });
        });
    };

    //删除图片
    $scope.deletePicture = function (id) {
        swal({
            title: "确定删除图片吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnConfirm: false
        }, function () {
            $scope.loadmask.show();
            $http(
                {
                    url: constVar.baseUrl + 'API/PictureNodes/' + id + '?rd=' + Math.random(),
                    method: "DELETE",
                    headers: {"Authorization": "admin"},
                    dataType: "json"
                })
                .success(function (d) {
                    $scope.loadmask.hide();
                    if (d.meta.code == '200') {
                        swal({
                            title: "删除图片成功 ",
                            type: "success",
                            timer: 2000
                        });
                        $scope.initPackage();
                        $scope.isPicture = false;
                    }
                    else {
                        alert(d.meta.code);
                    }
                }).error(function () {
                $scope.loadmask.hide();
            });
        });
    };

    /* edit function for multiselect which we haven't use for now */
    $scope.edit = function (target) {
        if (target.getAttribute('class') == 'fa fa-lock pull-right') {
            target.setAttribute('class', 'fa fa-unlock pull-right')
            $(target).parent().parent().find('dropdown-multiselect').find('.dropdown-toggle').removeAttr('disabled');
        }
        else {
            target.setAttribute('class', 'fa fa-lock pull-right')
            $(target).parent().parent().find('dropdown-multiselect').find('.dropdown-toggle').attr('disabled', 'disabled');
            $scope.saveCase();
            console.log($scope.phases);
            //$scope.initPackage();
        }
    };

    /* click and show images lib */
    $scope.showImages = function () {
        $scope.loadmask.show();
        $scope.imgShow = true;
        $.ajax(
            {
                url: constVar.baseUrl + 'API/Management/PictureNodes?rd=' + Math.random(),
                method: "get",
                contentType: 'application/json;charset=utf-8',
                headers: {"Authorization": "admin"},
                dataType: "json"
            })
            .success(function (d) {
                if (d.meta.code == '200') {
                    $scope.images = d["data"];
                }

                else {
                    alert(d.meta.code);
                }
                $scope.loadmask.hide();
            }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    };
    //根据名称查询图片
    $scope.searchByPictureName = function (name) {
        $scope.loadmask.show();
        if (name == null) {
            name = '';
        }
        $http(
            {
                url: constVar.baseUrl + 'API/Management/PictureNodes?word=' + encodeURI(name) + '&rd=' + Math.random(),
                method: "GET",
                headers: {"Authorization": "admin"},
                dataType: "json"
            })
            .success(function (d) {
                $scope.loadmask.hide();
                if (d.meta.code == '200') {
                    $scope.images = d["data"];
                    if (d["data"].length == 0) {
                        swal({
                            title: "不存在相关图片 ",
                            type: "error",
                            timer: 3000
                        });

                    }
                    $scope.imgPaginate();
                }
                else {
                    alert(d.meta.code);
                }
            })
            .error(function () {
                alert(d.meta.code);
            });
    }
    //监听回车按键
    $scope.searchPicKeyDown = function (event) {
        if (event.keyCode == 13) {
            $scope.searchByPictureName($scope.picName);
        }
    };
    //视频分页
    $scope.imgPaginate = function () {
        $scope.imgItems = [];
        $scope.imgpagging.pageTotal = $scope.images.length;
        for (var i = ($scope.imgpagging.pageIndex - 1) * $scope.imgpagging.pageSize, j = 0; i < $scope.images.length && j < $scope.imgpagging.pageSize; i++, j++) {
            $scope.imgItems[j] = {name: $scope.images[i].name, id: $scope.images[i].id, img: $scope.images[i].img};
        }
    }
    //根据名称查询视频
    $scope.searchByVideoName = function (name) {
        $scope.loadmask.show();
        if (name == null) {
            name = '';
        }
        $http(
            {
                url: constVar.baseUrl + 'API/Management/VideoNodes?word=' + encodeURI(name) + '&rd=' + Math.random(),
                method: "GET",
                headers: {"Authorization": "admin"},
                dataType: "json"
            })
            .success(function (d) {
                $scope.loadmask.hide();
                if (d.meta.code == '200') {
                    $scope.videos = d["data"];
                    if (d["data"].length == 0) {
                        swal({
                            title: "不存在相关视频",
                            type: "error",
                            timer: 3000
                        });
                    }
                    $scope.vidPaginate();
                }
                else {
                    alert(d.meta.code);
                }
            })
            .error(function () {
                alert(d.meta.code);
            });
    }
    //监听回车按键
    $scope.searchVidKeyDown = function (event) {
        if (event.keyCode == 13) {
            $scope.searchByVideoName($scope.videoName);
        }
    };
    //视频分页
    $scope.vidPaginate = function () {
        $scope.vidItems = [];
        $scope.vidpagging.pageTotal = $scope.videos.length;
        for (var i = ($scope.vidpagging.pageIndex - 1) * $scope.vidpagging.pageSize, j = 0; i < $scope.videos.length && j < $scope.vidpagging.pageSize; i++, j++) {
            $scope.vidItems[j] = {
                name: $scope.videos[i].name,
                id: $scope.videos[i].id,
                picture: $scope.videos[i].picture
            };
        }
    }
    //清空文本内容
    $scope.clearWord = function () {
        $scope.currentOperateContent = "";
    }
    //加载操作树
    $scope.showOperate = function () {
        $scope.loadmask.show();
        $http(
            {
                url: constVar.baseUrl + 'API/NormalDocs/' + $scope.normalDocID + '/Tree?rd=' + Math.random(),
                method: "GET",
                headers: {"Authorization": "admin"},
                dataType: "json"
            })
            .success(function (d) {
                $scope.loadmask.hide();
                if (d.meta.code == '200') {
                    $scope.operateList = [];//树的第一层数据集合
                    //文字组加载
                    for (var i = 0; i < d.data.texts.length; i++) {
                        var records = {};//树的第一层数据
                        records.roleId = d.data.texts[i]['id'];
                        records.roleName = d.data.texts[i]['name'];
                        records.content = d.data.texts[i]['content'];
                        records.type = 'word';
                        $scope.operateList.push(records);
                    }
                    //视频组加载
                    for (var i = 0; i < d.data.video_groups.length; i++) {
                        var records = {};//树的第一层数据
                        var record = [];//树的第二层数据集合集合
                        var childRecordSet = [];//树的第二层数据集合
                        records.roleId = d.data.video_groups[i]['id'];
                        records.roleName = d.data.video_groups[i]['name'];
                        records.type = 'videoGroup';
                        record = d.data.video_groups[i]['videos'];
                        records.children = [];
                        for (var j = 0; j < record.length; j++) {
                            var childRecord = {};//树的第二层数据
                            childRecord.roleId = record[j]['id'];
                            childRecord.roleName = record[j]['name'];
                            childRecord.type = 'video';
                            childRecord.pic = record[j]['picture'];
                            childRecord.vid = record[j]['video'];
                            childRecord.children = [];
                            childRecordSet.push(childRecord);
                        }
                        records.children = childRecordSet;
                        $scope.operateList.push(records);
                    }
                    //图片组加载
                    for (var i = 0; i < d.data.picture_groups.length; i++) {
                        records = {};//树的第一层数据
                        record = [];//树的第二层数据集合集合
                        childRecordSet = [];//树的第二层数据集合
                        records.roleId = d.data.picture_groups[i]['id'];
                        records.roleName = d.data.picture_groups[i]['name'];
                        records.type = 'picGroup';
                        record = d.data.picture_groups[i]['pictures'];
                        records.children = [];
                        for (var j = 0; j < record.length; j++) {
                            var childRecord = {};//树的第二层数据
                            childRecord.roleId = record[j]['id'];
                            childRecord.roleName = record[j]['name'];
                            childRecord.type = 'pic';
                            childRecord.img = record[j]['img'];
                            childRecord.children = [];
                            childRecordSet.push(childRecord);
                        }
                        records.children = childRecordSet;
                        $scope.operateList.push(records);
                    }
                }
                else {
                    alert(d.meta.code);
                }
            })
            .error(function (data, header, config, status) {
                $scope.loadmask.hide();
            });
    };

    //显示药品搜索框
    $scope.showMedicine = function (value) {
        $scope.isMedicine = true;
        $scope.loadMedicineTypes();
    };

    //加载药品大类数据
    $scope.loadMedicineTypes = function () {
        $scope.medicineTypes = [];
        $scope.loadmask.show();
        $http(
            {
                url: constVar.baseUrl + '/API/MedicineTypes?rd=' + Math.random(),
                method: "GET",
                headers: {"Authorization": "admin"},
                dataType: "json"
            })
            .success(function (d) {
                if (d.meta.code == '200') {
                    for (var i = 0; i < d.data.length; i++) {
                        var records = {};
                        records.id = d.data[i]['id'];
                        records.name = d.data[i]['name'];
                        $scope.medicineTypes.push(records);
                    }
                }
                else {
                    alert(d.meta.code);
                }
                $scope.loadmask.hide();
            }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    };

    //加载药品
    $scope.loadMedicine = function (value) {
        $scope.medicines = [];
        if (value == null) {
            $scope.items = [];
            return;
        }
        $scope.loadmask.show();
        $http(
            {
                url: constVar.baseUrl + '/API/MedicineTypes/' + value.id + '/Medicines?rd=' + Math.random(),
                method: "GET",
                headers: {"Authorization": "admin"},
                dataType: "json"
            })
            .success(function (d) {
                if (d.meta.code == '200') {
                    for (var i = 0; i < d.data.length; i++) {
                        var records = {};
                        records.id = d.data[i]['id'];
                        records.name = d.data[i]['name'];
                        $scope.medicines.push(records);
                    }
                    $scope.searchedMedicines = $scope.medicines;
                    $scope.paginate();
                }
                else {
                    alert(d.meta.code);
                }
                $scope.loadmask.hide();
            }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    };

    //添加药品名称到文本
    $scope.addToTest = function (name) {
        $scope.currentOperateContent += name;
    };

    //添加多个药品名到文本
    $scope.addToTest2 = function () {
        var add = false;
        for (var i = 0; i < $scope.items.length; i++) {
            if ($scope.items[i].checked) {
                add = true;
                $scope.currentOperateContent += $scope.items[i].name + '，';
            }
        }
        if (add == true) {
            swal({
                title: "药品名已添加到文本中 ",
                type: "success",
                timer: 2000
            });
        }
        else {
            swal({
                title: "请勾选需要的药品 ",
                type: "error",
                timer: 3000
            });
        }
    };

    //搜索药品名
    $scope.searchMedicine = function (text) {
        var sFind = text;
        if (sFind == " ") {
            for (var i in $scope.medicines) {
                $scope.searchedMedicines[i] = {name: $scope.medicines[i].name};
            }
            $scope.paginate();
        }
        if (sFind != " ") {
            var nPos;
            var vResult = [];
            for (var i in $scope.medicines) {
                var sTxt = $scope.medicines[i].name || '';
                nPos = find(sFind, $scope.medicines[i].name);
                //nPos = sTxt.indexOf(sFind);
                if (nPos >= 0) {
                    vResult[vResult.length] = sTxt;
                }
            }
            $scope.searchedMedicines = [];
            for (var i in vResult) {
                $scope.searchedMedicines[i] = {name: vResult[i]};
            }
            $scope.paginate();

        }
    };
    function find(sFind, sObj) {
        var nSize = sFind.length;
        var nLen = sObj.length;
        var sCompare;
        if (nSize <= nLen) {
            for (var i = 0; i <= nLen - nSize; i++) {
                sCompare = sObj.substring(i, i + nSize);
                if (sCompare == sFind) {
                    return i;
                }
            }
        }
        return -1;
    };
    //监听回车按键
    $scope.searchMediKeyDown = function (event) {
        if (event.keyCode == 13) {
            $scope.searchMedicine($scope.searchText);
        }
    };
    //前台分页实现
    $scope.paginate = function () {
        $scope.items = [];
        $scope.pagging.pageTotal = $scope.searchedMedicines.length;
        for (var i = ($scope.pagging.pageIndex - 1) * $scope.pagging.pageSize, j = 0; i < $scope.searchedMedicines.length && j < $scope.pagging.pageSize; i++, j++) {
            $scope.items[j] = {name: $scope.searchedMedicines[i].name};
        }
    };

    //初始化，加载普通结点
    $scope.initPackage = function () {
        $scope.operateList = [];
        $scope.normalDocName = '';
        $scope.showOperate();
    };

    //跳转测试
    $scope.back = function () {
        if ($scope.page == "clinic") {
            $location.search({});
            $location.path('/clinic');
        }
        else if ($scope.page == "diseaseType") {
            $location.search({});
            $location.path('/diseasetype');
        } else if ($scope.page == "freeModeContent") {
            $location.search({
                departmentId: $scope.departmentId
            });
            $location.path('/freemodecontent');
        }
        else if ($scope.page == "freeModeExamContent") {
            $location.search({
                freeExamId: $scope.freeExamId,
                freeExamName: $scope.freeExamName,
                freeModuleId: $scope.freeModuleId,
                departmentId: $scope.departmentId,
                contentNormalDocId: $scope.contentNormalDocId,
                answerNormalDocId: $scope.answerNormalDocId,
                tid: $scope.tid

            });
            $location.path('/freemodeexamcontent');
        }
        else if ($scope.page == "appliance") {
            $location.search({});
            $location.search({
                items:$scope.items,
                page:$scope.page
            });
            $location.path('/appliance');
        }
        else {
            $location.search({
                message: $scope.messageForSearch,
                caseId: $scope.currentCaseId,
                index: $scope.active,
                normalDocId: $scope.normalDocId
            });
            $location.path('/case');
        }
    };

    $scope.initPackage();

};

/* for modal conversation and we haven't use it for now */
var ModalInstanceCtrl = function ($scope, $uibModalInstance, items) {
    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
};

