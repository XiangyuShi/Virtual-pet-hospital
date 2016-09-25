/**
 * Created by yichli on 5/9/16.
 */

var CasePackageController = function ($scope, $http, $compile, $uibModal, $log, $window, ngTableParams, NameService, $location) {
    $scope.plugin = new petPlugin();
    $scope.animationsEnabled = true;
    $scope.packetInfo = {};
    $scope.searchForTable = false;
    $scope.isPacket = false;
    $scope.currentPacket = "";
    $scope.time = "";
    $scope.keyWord = '';
    $scope.pagging = {
        maxSize: 5,
        pageSize: '10',
        pageIndex: 1,
        pageTotal: 0
    };
    $scope.searchByTime = function (time) {
        $scope.time = time;
        $scope.myData = [];
        $scope.loadmask.show();
        $scope.isPacket = false;
        $scope.tableParams = new ngTableParams(
            {
                page: 1,            // show first page
                count: 5,           // count per page
                sorting: {name: 'asc'}
            },
            {
                total: 0, // length of data
                getData: function ($defer, params) {
                    NameService.getData(time, $defer, params, $scope.filter, $scope.loadmask);
                }
            });

        $scope.searchForTable = true;

        $scope.$watch("filter.$", function () {
            $scope.tableParams.reload();
        });

    }
    //搜索病例袋
    $scope.searchByKeyWord = function (word) {
        $scope.keyWord = word;
        $scope.isPacket = false;
        $scope.loadmask.show();
        $http(
            {
                url: ($scope.keyWord == "" || $scope.keyWord == undefined) ? constVar.baseUrl + 'API/DiseaseCasePackages?rd=' + Math.random() :
                constVar.baseUrl + 'API/DiseaseCasePackages?word=' + encodeURI($scope.keyWord) + '&rd=' + Math.random(),
                method: "get",
                contentType: 'application/json;charset=utf-8',
                headers: {"Authorization": "admin"},
                dataType: "json"
            }).success(function (d) {
            $scope.loadmask.hide();
            if (d.meta.code == '200') {
                $scope.diseaseCasePackages = d.data;
                $scope.paginate();
            }
            else {
                alert(d.meta.code);
                //swal({
                //    title: "d.meta.code ",
                //    type: "error"
                //});
            }
            $scope.searchForTable = true;
        }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    };

    //监听回车按键
    $scope.searchKeyDown = function (event) {
        if (event.keyCode == 13) {
            $scope.searchByKeyWord($scope.word);
        }
    };
    //前台分页实现
    $scope.paginate = function () {
        $scope.items = [];
        $scope.pagging.pageTotal = $scope.diseaseCasePackages.length;
        for (var i = ($scope.pagging.pageIndex - 1) * $scope.pagging.pageSize, j = 0; i < $scope.diseaseCasePackages.length && j < $scope.pagging.pageSize; i++, j++) {
            $scope.items[j] = {name: $scope.diseaseCasePackages[i].name, id: $scope.diseaseCasePackages[i].id};
        }
    };

    //修改病例袋基本信息
    $scope.editPacket = function (valid) {
        if (!valid) {
            //alert("失败，根据表单提醒正确填写信息");
            swal({
                title: "根据表单提醒正确填写信息!",
                type: "error"
            });
            return;
        }
        var data = {
            name: $scope.packetInfo.packetName,
            pet_name: $scope.packetInfo.petName,
            pet_species: $scope.packetInfo.petSpecies,
            pet_breed: $scope.packetInfo.petBreed,
            pet_date_of_birth: $scope.packetInfo.petBirth == '' ? null : $scope.packetInfo.petBirth,
            pet_gender: $scope.packetInfo.petGender,
            pet_coat_color: $scope.packetInfo.petCoatColor,
            pet_weight: $scope.packetInfo.petWeight == '' ? null : $scope.packetInfo.petWeight,
            master_name: $scope.packetInfo.masterName,
            master_address: $scope.packetInfo.masterAddress,
            master_telephone: $scope.packetInfo.masterTelephone,
            master_email: $scope.packetInfo.masterEmail,
            body_condition: $scope.packetInfo.bodyCondition
        };
        $scope.loadmask.show();
        //修改
        if ($scope.packetInfo.id != "") {
            $http(
                {
                    url: constVar.baseUrl + 'API/DiseaseCasePackages/' + $scope.packetInfo.id + '?rd=' + Math.random(),
                    method: "PATCH",
                    data: JSON.stringify(data),
                    contentType: 'application/json;charset=utf-8',
                    headers: {"Authorization": "admin"},
                    dataType: "json"
                })
                .success(function (d) {
                    $scope.loadmask.hide();
                    if (d.meta.code == '200') {
                        $scope.searchByTime($scope.time);
                        // alert("修改成功");
                        swal({title: "修改成功!", timer: 2000});
                        $scope.searchByKeyWord($scope.keyWord);
                    }
                    else if (d.meta.code == '500') {
                        //alert("病例袋名称不能重复");
                        swal({
                            title: "病例袋名称不能重复 ",
                            type: "error",
                            timer: 2000
                        });
                    }
                    else {
                        alert(d.meta.code);
                    }
                }).error(function (data, header, config, status) {
                $scope.loadmask.hide();
            });
        }
        else {
            //新增
            if (!valid) {
                //alert("失败，根据表单提醒正确填写信息");
                swal({
                    title: "根据表单提醒正确填写信息!",
                    type: "error"
                });
                return;
            }
            $.ajax(
                {
                    url: constVar.baseUrl + 'API/DiseaseCasePackages?rd=' + Math.random(),
                    method: "POST",
                    data: JSON.stringify(data),
                    contentType: 'application/json;charset=utf-8',
                    headers: {"Authorization": "admin"},
                    dataType: "json"
                })
                .success(function (d) {

                    if (d.meta.code == '200') {
                        //alert("新增成功");
                        swal({title: "新增病例袋成功!", timer: 2000});
                        $scope.searchByKeyWord($scope.keyWord);

                    } else if (d.meta.code == '500') {
                        //alert("病例袋名称不能重复");
                        swal({
                            title: "病例袋名称不能重复 ",
                            type: "error",
                            timer: 2000
                        });
                    }
                    else {
                        alert(d.meta.code);
                    }
                    $scope.loadmask.hide();
                }).error(function (data, header, config, status) {
                $scope.loadmask.hide();
            });
        }

    }

    //弹窗动画
    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

    //网络请求loading动画
    $scope.loadmask = $scope.plugin.CreateMask({
        style: 'z-index:9999;',
        id: 'test_Mask',
        loadingImage: true
    });

    //得到病例袋信息
    $scope.getCasepacketInfo = function (id, name) {
        $scope.currentPacket = name;
        if (id != null) {
            $http(
                {
                    url: constVar.baseUrl + 'API/DiseaseCasePackages/' + id,
                    method: "GET",
                    headers: {"Authorization": "admin"},
                    dataType: "json"
                })
                .success(function (d) {
                    if (d.meta.code == '200') {
                        $scope.packetInfo.id = d['data']['id'];
                        $scope.packetInfo.packetName = d['data']['name'];
                        $scope.packetInfo.petName = d['data']['pet_name'];
                        $scope.packetInfo.petSpecies = d['data']['pet_species'];
                        $scope.packetInfo.petBreed = d['data']['pet_breed'];
                        $scope.packetInfo.petBirth = d['data']['pet_date_of_birth'] == null ? '' : moment(d['data']['pet_date_of_birth']).format('YYYY-MM-DD');
                        $scope.packetInfo.petGender = d['data']['pet_gender'];
                        $scope.packetInfo.petCoatColor = d['data']['pet_coat_color'];
                        $scope.packetInfo.petWeight = d['data']['pet_weight'];
                        $scope.packetInfo.masterName = d['data']['master_name'];
                        $scope.packetInfo.masterAddress = d['data']['master_address'];
                        $scope.packetInfo.masterTelephone = d['data']['master_telephone'];
                        $scope.packetInfo.masterEmail = d['data']['master_email'];
                        $scope.packetInfo.bodyCondition = d['data']['body_condition'];
                    }
                    else {
                        alert(d.meta.code);
                    }
                }).error(function () {
                $scope.loadmask.hide();
            });

        }
        else {
            $scope.searchForTable = false;
            $scope.packetInfo.id = "";
            $scope.packetInfo.packetName = "";
            $scope.packetInfo.petName = "";
            $scope.packetInfo.petSpecies = "";
            $scope.packetInfo.petBreed = "";
            $scope.packetInfo.petBirth = "";
            $scope.packetInfo.petGender = "";
            $scope.packetInfo.petCoatColor = "";
            $scope.packetInfo.petWeight = "";
            $scope.packetInfo.masterName = "";
            $scope.packetInfo.masterAddress = "";
            $scope.packetInfo.masterTelephone = "";
            $scope.packetInfo.masterEmail = "";
            $scope.packetInfo.bodyCondition = "";
        }
        $scope.isPacket = true;
        $scope.searchForTable = false;
    };

    //删除病例袋
    $scope.deleteCasepacket = function (id) {
        $scope.isPacket = false;
        swal({
            title: "确定删除病例袋吗?",
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
                    url: constVar.baseUrl + 'API/DiseaseCasePackages/' + id + '/Enforce?rd=' + Math.random(),
                    method: "DELETE",
                    headers: {"Authorization": "admin"},
                    dataType: "json"
                })
                .success(function (d) {
                    $scope.loadmask.hide();
                    if (d.meta.code == '200') {
                        //alert("删除病例袋成功");
                        swal({
                            title: "删除病例袋成功 ",
                            type: "success",
                            timer: 2000
                        });
                        $scope.searchByKeyWord($scope.keyWord);
                    }
                    else {
                        alert(d.meta.code);
                    }
                }).error(function () {
                $scope.loadmask.hide();
            });
        });
        //$.ajax(
        //    {
        //        url: constVar.baseUrl + 'API/DiseaseCasePackages/' + id + '/Enforce?rd=' + Math.random(),
        //        method: "DELETE",
        //        headers: {"Authorization": "admin"},
        //        dataType: "json"
        //    })
        //    .success(function (d) {
        //        $scope.loadmask.hide();
        //        if (d.meta.code == '200') {
        //            alert("删除病例袋成功");
        //            $scope.searchByKeyWord($scope.keyWord);
        //        }
        //        else {
        //            alert(d.meta.code);
        //        }
        //    }).error(function () {
        //    $scope.loadmask.hide();
        //});
    };
    //查看病例袋病例
    $scope.view = function (name) {
        $location.search({
            message: name
        });
        $location.path('/case');
    }
    //检查ＵＲＬ
    $scope.watchURL = function () {
        if ($location.search().message != null) {
            var word = $location.search().message;
            $scope.searchByKeyWord(word);
        }
    };
    //取消修改病例袋
    $scope.cancelEditPacket = function () {
        $scope.isPacket = false;
        $scope.searchForTable = true;
        $scope.searchByKeyWord($scope.keyWord);
    }

    //初始化病例袋
    $scope.initPackage = function () {
        //时间选择器初始化
        $(document).find('input[bootstrapDatetime]').datetimepicker({
            format: 'yyyy-mm-dd',
            minView: 2,
            autoclose: true,
            language: 'zh-CN',
            todayBtn: true
        });
        $scope.watchURL();
    }
    $scope.initPackage();

};