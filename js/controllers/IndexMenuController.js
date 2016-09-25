App.controller('IndexMenuController', function ($scope, $http, authorizationService) {
    var userCookie = $.cookie(constVar.userCookie) || '';
    if (userCookie == null || userCookie == '') {
        location.href = constVar.loginUrl + '?type=admin';
    }
    userCookie = JSON.parse(userCookie);
    $scope.user = userCookie.user;
    $scope.plugin = new petPlugin();
    $scope.loadmask = $scope.plugin.CreateMask({
        style: 'z-index:9999;',
        id: 'test_Mask',
        loadingImage: true
    });
    $scope.menus = {};
    $scope.loadUserMenu = function () {
        var userId = userCookie.user.id;
        $scope.loadmask.show();
        var url = constVar.baseUrl + 'usersMenu/' + userId + '?rd=' + Math.random();
        $http({
            url: url,
            method: "GET",
            headers: { "Authorization": "admin" },
            dataType: "json"
        }).success(function (d) {
            $scope.loadmask.hide();
            if (d.meta.code == '200') {
                $scope.menus = d.data;
            } else {
                alert(d.meta.code + ',' + d.meta.msg);
            }
        }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    };
    $scope.initMenu = function () {
        $('#side-menu').metisMenu();
    };
    $scope.loadUserMenu();
});