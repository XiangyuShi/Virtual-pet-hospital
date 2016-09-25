'use strict';

/* Services */

var AppServices = angular.module('phtindex.services', []);

AppServices.value('version', '0.1');

AppServices.factory('alertService', function ($rootScope) {
    var alertService = {};

    // create an array of alerts available globally
    $rootScope.alerts = [];

    alertService.add = function (type, msg) {
        $rootScope.alerts.push({ 'type': type, 'msg': msg });
    };

    alertService.closeAlert = function (index) {
        $rootScope.alerts.splice(index, 1);
    };

    alertService.success = function (msg) {
        swal(msg, '', 'success');
    }
    alertService.error = function (msg) {
        swal(msg, '', 'error');
    }
    alertService.info = function (msg) {
        swal(msg);
    }
    alertService.confirm = function (msg, func) {
        swal({
            title: msg,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnConfirm: true
        }, function () {
            return func();
        });
    }
    return alertService;
});

AppServices.service("NameService", function ($http, $filter) {

    function filterData(data, filter) {
        return $filter('filter')(data, filter);
    }

    function orderData(data, params) {
        return params.sorting() ? $filter('orderBy')(data, params.orderBy()) : filteredData;
    }

    function sliceData(data, params) {
        return data.slice((params.page() - 1) * params.count(), params.page() * params.count())
    }

    function transformData(data, filter, params) {
        return sliceData(orderData(filterData(data, filter), params), params);
    }

    var service = {
        cachedData: [],
        time: "",
        getData: function (time, $defer, params, filter, scope) {
            // console.log("real : " + cache);
            // if (service.cachedData.length > 0 && service.time == time && cache == false) {
            //     console.log("using cached data")
            //     var filteredData = filterData(service.cachedData, filter);
            //     var transformedData = sliceData(orderData(filteredData, params), params);
            //     params.total(filteredData.length)
            //     $defer.resolve(transformedData);
            //     $('.ng-table-counts').hide();
            //     $('.pagination').addClass("pull-right");
            //     scope.hide();
            // }
            // else {
            $http(
                {
                    url: (time == "" || time == undefined) ? constVar.baseUrl + 'API/DiseaseCasePackages?rd=' + Math.random() :
                    constVar.baseUrl + 'API/DiseaseCasePackages?word=' + time + '&rd=' + Math.random(),
                    method: "get",
                    contentType: 'application/json;charset=utf-8',
                    headers: { "Authorization": "admin" },
                    dataType: "json"
                }).success(function (d) {
                    if (d.meta.code == '200') {
                        scope.hide();
                        var resp = d['data'];
                        angular.copy(resp, service.cachedData)
                        params.total(resp.length)
                        var filteredData = $filter('filter')(resp, filter);
                        var transformedData = transformData(resp, filter, params)
                        $defer.resolve(transformedData);
                        service.time = time;
                        $('.ng-table-counts').hide();
                        $('.pagination').addClass("pull-right");

                    }
                    else {
                        alert(d.meta.code);
                    }

                }).error(function (data, header, config, status) {
                });
            // }
        }
    }
    return service;
});

AppServices.factory('authorizationService', function ($q, $rootScope, $location, $http) {
    return {
        permissionModel: { permission: [], isPermissionLoaded: false, excludePermission: ['examdetail', 'papercontent', 'operate'] },

        permissionCheck: function (menu) {
            // 返回一个承诺(promise).
            var deferred = $q.defer();
            var obj = this;
            if (!this.permissionModel.isPermissionLoaded) {
                var userCookie = $.cookie(constVar.userCookie) || '';
                userCookie = JSON.parse(userCookie);
                var userId = userCookie.user.id || '';
                var url = constVar.baseUrl + 'usersMenu/' + userId + '?rd=' + Math.random();
                $http({
                    url: url,
                    method: "GET",
                    headers: { "Authorization": "admin" },
                    dataType: "json"
                }).success(function (d) {
                    if (d.meta.code == '200') {
                        obj.permissionModel.permission = d.data;
                        obj.permissionModel.isPermissionLoaded = true;
                        // 检查当前用户是否有权限访问当前路由
                        obj.getPermission(obj.permissionModel, menu, deferred);
                    }
                }).error(function (data, header, config, status) {
                });
            }
            else {
                // 检查当前用户是否有权限访问当前路由
                this.getPermission(this.permissionModel, menu, deferred);
            }
            return deferred.promise;
        },

        //方法:检查当前用户是否有必须角色访问该路由
        //'permissionModel' 保存了当前用户的权限信息
        //'menu' 当前访问的菜单
        //'deferred' 是用来处理承诺的对象
        getPermission: function (permissionModel, menu, deferred) {
            var ifPermissionPassed = false;
            for (var i = 0; i < permissionModel.excludePermission.length; i++) {
                if (permissionModel.excludePermission[i].toLowerCase() == String(menu).toLowerCase())
                    ifPermissionPassed = true;
            }
            for (var i = 0; i < permissionModel.permission.length; i++) {
                for (var j = 0; j < permissionModel.permission[i].menuList.length; j++) {
                    var permission = permissionModel.permission[i].menuList[j];
                    if (String(permission.url).toLowerCase() == String(menu).toLowerCase()) {
                        ifPermissionPassed = true;
                        break;
                    }
                }
            }
            if (!ifPermissionPassed) {
                // 如果用户没有必须的权限，我们把用户引导到无权访问页面
                $location.path('/nopermission');
                // 我们会一直监视 $locationChangeSuccess 事件
                // 并且当该事件发生的时，就把掉承诺解决掉。
                $rootScope.$on('$locationChangeSuccess', function (next, current) {
                    deferred.resolve();
                });
            } else {
                deferred.resolve();
            }
        }
    };
});