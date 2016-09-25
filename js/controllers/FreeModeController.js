/**
 * Created by Nova on 2016/7/9.
 */
var FreeModeController=function ($scope,$http,$location) {
    $scope.departmentItems=[];
    $scope.plugin = new petPlugin();
    $scope.loadmask = $scope.plugin.CreateMask({
        style: 'z-index:9999;',
        id: 'test_Mask',
        loadingImage: true
    });

    //获取到科室列表
    $scope.loadDepartments = function (){
        $scope.loadmask.show();
        $http({
            url: constVar.baseUrl + '/API/Management/Departments?rd=' + Math.random(),
            method: "GET",
            headers: {"Authorization": "admin"},
            dataType: "json"
        }).success(function (d) {
            if (d.meta.code == '200') {
                    $scope.departmentItems=d.data;
                $scope.loadmask.hide();
            }
            else {
                swal({
                    title: "发生错误!",
                    text: d.meta.code + "," + d.meta.msg,
                    type: "error"
                });
            }
        });
    };
    $scope.loadDepartments();

    //传递可是id并且跳转
    $scope.editContent=function (id) {
        $location.search({
            departmentId:id
        });
        $location.path('/freemodecontent');
    };
};