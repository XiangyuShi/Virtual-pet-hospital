/**
 * Created by Nova on 2016/5/26.
 */
var filePercent, status;
var VideoController = function ($scope, $http, $interval) {
    $scope.videoItems = {};//接受获取到的数据
    $scope.uploadVideoItems = {};//上传的文件列表
    $scope.filePercent = '';
    $scope.keyWords = '';//关键词
    $scope.hitText = '';//提示词默认为空
    $scope.showUploadPaneAttr = false;//ng-show属性控制显示上传面板是否
    $scope.showFileItemAttr = false;//ng-show属性控制显示图像列表是否
    //$scope.status=-1;//判断上传是否出错，0正在上传中，1上传中，2上传成功
    //分页栏的数据
    $scope.pagging = {
        maxSize: 5,
        pageSize: '12',
        pageIndex: 1,
        pageTotal: 0
    };
    //分页
    $scope.paginate = function () {
        $scope.currentVideoItems = {};//当前页面的数据
        for (var i = ($scope.pagging.pageIndex - 1) * $scope.pagging.pageSize, j = 0; i < $scope.videoItems.length && j < $scope.pagging.pageSize; i++, j++) {
            $scope.currentVideoItems[j] = {
                name: $scope.videoItems[i].name,
                id: $scope.videoItems[i].id,
                video: $scope.videoItems[i].video,
                picture: $scope.videoItems[i].picture
            };
        }
    };
    //监听input file框的状态变换
    /*    $("#file").change(function () {
     var tmpFile = $("#file").prop("files")[0];
     $scope.uploadVideoItems = tmpFile;
     //$scope.uploadVideoItems.push(tmpFile);
     });*/

    //var war_url="139.196.200.37:8080/PetHospitalTraining/";
    var war_url = constVar.baseUrl2;
    var ws = null;
    //var ws = new WebSocket("ws://" + war_url.slice(7) + "websocket?id=" + Math.random());

    $scope.initVideoItems = function (keyWords) {
        $http({
            url: constVar.baseUrl2 + 'API/Management/VideoNodes?word=' + encodeURI(keyWords) + '&rd=' + Math.random(),
            method: "GET",
            headers: {"Authorization": "admin"},
            dataType: "json"
        }).success(function (d) {
            if (d.meta.code == '200') {
                $scope.videoItems = d.data;
                if (d.data.length != 0) {
                    $scope.hitText = '本次查询到' + d.data.length + '个视频';
                    $scope.pagging.pageTotal = d.data.length;
                    $scope.paginate();
                } else {
                    $scope.hitText = '没有找到符合的视频';
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
    //$scope.initVideoItems('');
    //搜索关键字
    $scope.searchByVideoName = function (keyWords) {
        $scope.initVideoItems(keyWords);
        $scope.showUploadPaneAttr = false;
        $scope.showFileItemAttr = true;
    };
    //点击上传按钮
    $scope.showUploadPane = function () {
        $scope.showUploadPaneAttr = true;
        $scope.showFileItemAttr = false;
        $scope.hitText = '';
    };
    //删除视频
    $scope.deleteVideo = function (id) {
        swal({
            title: "确认删除该视频吗?",
            text: "你将会删除该视频不可恢复!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnConfirm: false
        }, function () {
            $http({
                url: constVar.baseUrl2 + 'API/Management/VideoNodes/' + id,
                method: "DELETE",
                headers: {"Authorization": "admin"},
                dataType: "json"
            }).success(function (d) {
                if (d.meta.code == '200') {
                    $scope.initVideoItems('');

                    swal({
                        title: "删除成功!",
                        text: "该视频已删除！",
                        type: "success"
                    });
                }
                else {
                    //alert(d.meta.code + ',' + d.meta.msg);
                    swal({
                        title: "不能删除!",
                        text: "视频正在使用，请勿删除!",
                        type: "error"
                    });
                }
            });
        });

    };
    $scope.uploadFile = function (video_size) {
        console.log("Send button clicked.");
        ws = new WebSocket("ws://" + war_url.slice(7) + "websocket?id=" + Math.random());
        var id_md5 = '';
        ws.onopen = function () {
            var id = $scope.uploadVideoItems.lastModified + '|' + $scope.uploadVideoItems.size + '|' + $scope.uploadVideoItems.name;
            id_md5 = $.md5(id);
            ws.send(id_md5);
            var total_size = $scope.uploadVideoItems.size;
            var unit = 1024 * 1024 * 4;
            var now_size = video_size * unit;
            var buffer = null;
            var count = 0;
            console.log("Start upload");
            //alert("Start upload");
            // $("#state").html("正在上传中。。。请勿关闭此页面");
            if (now_size >= total_size) {
                //alert("该视频服务器上已经存在");
                swal({
                    title: "该视频服务器上已经存在!",
                    text:"服务器上有该完整的视频，请勿重复上传！",
                    type: "warning"
                });
                console.log("该视频该视服务器上存在");
                if (ws != null) {
                    ws.close();
                    $scope.uploadVideoItems = {};
                    filePercent = '';
                    status = -1;

                    var file = $("#file");
                    file.after(file.clone().val(""));
                    file.remove();
                }
            }
            //分片并上传
            while (now_size < total_size) {
                if (now_size + unit < total_size) {
                    buffer = $scope.uploadVideoItems.slice(now_size, now_size + unit);
                    now_size = now_size + unit;
                } else {
                    buffer = $scope.uploadVideoItems.slice(now_size, total_size);
                    now_size = total_size;
                }
                console.log(buffer.size);
                console.log("Upload part" + count);
                count++;
                ws.send(buffer);
                console.log("正在发送中。。。");
                status = 0;
            }
            console.log("发送完毕");
            status = -1;
        };


        ws.onmessage = function (e) {


            if (e.data != "ready to transcode") {
                filePercent = parseInt((e.data) * 100);
                console.log(filePercent);//服务器返回数据可以准备转码e.data==ready to transcode
                //$("#state").html("正在上传中。。。请勿关闭此页面" + filePercent + "%");
            } else {
                // $scope.uploadVideoItems = {};
                // filePercent = '';
                // var file = $("#file");
                // file.after(file.clone().val(""));
                // file.remove();
                console.log(id_md5);
                // $("#state").html("上传成功");
                //发送请求开始转码
                // $scope.initVideoItems('');
                $.ajax({
                    type: "PATCH",
                    headers: {"Authorization": "admin"},
                    url: war_url + "API/Management/VideoNodes/" + id_md5,
                    data: "",
                    contentType: "application/json",
                    dataType: "json",
                    success: function (res) {
                        console.log(res.data);
                        // alert("开始转码")
                    }
                });


            }
        }
    };

    $scope.upload = function () {
        $scope.uploadVideoItems = {};
        filePercent = '';
        status = -1;

        $scope.uploadVideoItems = $("#file").prop("files")[0];
        // ws = new WebSocket("ws://" + war_url.slice(7) + "websocket?id=" + Math.random());
        var id = $scope.uploadVideoItems.lastModified + '|' + $scope.uploadVideoItems.size + '|' + $scope.uploadVideoItems.name;
        var id_md5 = $.md5(id);
        $.ajax({
            type: "GET",
            headers: {"Authorization": "admin"},
            url: war_url + "API/Management/VideoNodes/" + id_md5,
            success: function (data) {
                console.log(data);//data is a object such as extension:"mp4"id:"1ba8793297a4e896b9ea4f28985ad68fname:"灵书妙探.Castle.S08E01.中英字幕.HDTVrip.1024X576.x264.mp4size:103status:totalSize:103
                if (data.data == null) {
                    t_size = Math.ceil($scope.uploadVideoItems.size / (1024 * 1024 * 4));
                    var requestBody = {id: id_md5, name: $scope.uploadVideoItems.name, total_size: t_size};
                    console.log(requestBody);
                    var jsonRequestBody = $.toJSON(requestBody);
                    console.log(jsonRequestBody);
                    $.ajax({
                        type: "POST",
                        headers: {"Authorization": "admin"},
                        url: war_url + "API/Management/VideoNodes",
                        data: jsonRequestBody,
                        contentType: "application/json",
                        dataType: "json",
                        success: function (res) {
                            console.log(res);
                            if (res.data != null)
                                $scope.uploadFile(res.data.size);
                            else
                            //alert("该文件损坏或者格式错误，请选择文件重新上传")
                                swal({
                                    title: "发生错误!",
                                    text: "该文件损坏或者格式错误，请选择文件重新上传",
                                    type: "error"
                                });
                        },
                        error: function (res) {
                            console.log(res);
                        }
                    });
                }
                else {
                    $scope.uploadFile(data.data.size)
                }
            }

        });

        var timer = $interval(function () {
            $scope.filePercent = filePercent;
            $scope.status = status;
            if (filePercent == '100')
                $interval.cancel(timer);
        }, 1000);

    };
    //取消上传
    $scope.cancelAll = function () {
        if (ws != null) {
            ws.close();
            var id = $scope.uploadVideoItems.lastModified + '|' + $scope.uploadVideoItems.size + '|' + $scope.uploadVideoItems.name;
            var id_md5 = $.md5(id);
            $scope.deleteVideo(id_md5);
            $scope.uploadVideoItems = {};
            $scope.filePercent = '';
            filePercent = '';
            $scope.status = -1;
            status = -1;

            var file = $("#file");
            file.after(file.clone().val(""));
            file.remove();
        }
    };
    //移除视频
    $scope.clearQueue = function () {
        if (ws != null) {
            ws.close();
            $scope.uploadVideoItems = {};
            $scope.filePercent = '';
            filePercent = '';
            $scope.status = -1;
            status = -1;

            var file = $("#file");
            file.after(file.clone().val(""));
            file.remove();
        }
    };


};

