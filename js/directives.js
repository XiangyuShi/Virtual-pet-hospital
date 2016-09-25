'use strict';

/* Directives */

var underscore = angular.module('underscore', []);
underscore.factory('_', ['$window', function ($window) {
    return $window._;
}]);

var AppDirectives = angular.module('phtindex.directives', ['underscore']);


AppDirectives.directive('appVersion', ['version', function (version) {
    return function (scope, elm, attrs) {
        elm.text(version);
    };
}]);

AppDirectives.directive('ngMatch', function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstVal = '#' + attrs.ngMatch;
            $(elem).add(firstVal).on('keyup', function () {
                scope.$apply(function () {
                    var v = elem.val() === $(firstVal).val();
                    ctrl.$setValidity('match', v);
                });
            });
        }
    };
});


AppDirectives.directive('selectinfo', function () {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
            department: '=',
            role: '=',
            operate: '='
        },
        template: "<div class='row'><div class='col-md-4'><button>{{department}}</button></div>" +
        "<div class='col-md-4'><button>{{role}}</button></div>" +
        "<div class='col-md-4'><button>{{operate}}</button></div>",
        controller: function ($scope, _) {
        }
    }

});
AppDirectives.directive('dropdownMultiselect', function () {
    return {
        restrict: 'E',
        scope: {
            model: '=',
            disable: '=',
            options: '=',
            modelName: '=',
            pre_selected: '=preSelected'
        },
        template: "<div class='btn-group' data-ng-class='{open: open}'>" +
        "<button  ng-repeat='(k,v) in model' class='btn btn-small btn-info'>{{v.name}}</button>" +
        "<button disabled = 'disabled' class='btn btn-small dropdown-toggle' data-ng-click='open=!open;openDropdown()'><span class='caret'></span></button>" +
        "<ul class='dropdown-menu' aria-labelledby='dropdownMenu'>" +
        "<li><a data-ng-click='selectAll()'><i class='icon-ok-sign'></i>  Check All</a></li>" +
        "<li><a data-ng-click='deselectAll();'><i class='icon-remove-sign'></i>  Uncheck All</a></li>" +
        "<li class='divider'></li>" +
        "<li data-ng-repeat='option in options'> <a data-ng-click='setSelectedItem()'>{{option.name}}<span data-ng-class='isChecked(option.id)'></span></a></li>" +
        "</ul>" +
        "</div>" +
        "<div style='margin-top:10px;margin-bottom:10px;'><button  data-ng-repeat='models in model' class='btn btn-success' style='margin-right:10px;'>{{models.name}}</button></div>",
        controller: function ($scope, _) {
            $scope.selected_items = [];
            for (var i = 0; i < $scope.pre_selected.length; i++) {
                $scope.selected_items.push($scope.pre_selected[i].id);
                var flag = true;
                $.each($scope.model, function (m, mitem) {
                    if ($scope.pre_selected[i].id == mitem.id) {
                        flag = false;
                    }
                });
                if (flag)
                    $scope.model.push($scope.pre_selected[i]);

            }
            /* $scope.openDropdown = function(){
             $scope.selected_items = [];
             for(var i=0; i<$scope.pre_selected.length; i++){
             $scope.selected_items.push($scope.pre_selected[i].id);
             var flag = true;
             $.each($scope.model,function(m,mitem){
             if($scope.pre_selected[i].id == mitem.id){
             flag = false;
             }
             });
             if(flag)
             $scope.model.push($scope.pre_selected[i]);

             }
             };*/

            $scope.selectAll = function () {
                $.each($scope.options, function (i, item) {
                    var record = {};
                    var flag = true;
                    $.each($scope.model, function (m, mitem) {
                        if (item.id == mitem.id) {
                            flag = false;
                        }
                    });
                    if (flag) {
                        record.id = item.id;
                        record.name = item.name;
                        $scope.model.push(record);
                    }

                });
            };
            $scope.deselectAll = function () {
                $scope.model = [];
            };
            $scope.setSelectedItem = function () {
                var record = {};
                var flag = true;
                var index = 0;
                var id = this.option.id;
                var name = this.option.name;
                $.each($scope.model, function (m, mitem) {
                    if (id == mitem.id) {
                        flag = false;
                        index = m;
                    }
                });
                if (flag) {
                    record.id = id;
                    record.name = name;
                    $scope.model.push(record);
                }
                else {
                    $scope.model.splice(index, 1);
                }
            };

            $scope.isChecked = function (id) {
                var flag = false;
                $.each($scope.model, function (m, mitem) {
                    if (id == mitem.id) {
                        flag = true;
                        return '';
                    }
                });
                if (flag) {
                    return 'fa fa-check pull-right';
                }
                return false;
            };
        }
    }
});
AppDirectives.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files[0];
                    // or all selected files:
                    // scope.fileread = changeEvent.target.files;
                });
            });
        }
    }
}]);
AppDirectives.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$eval(attr.onFinishRender)
                });
            }
        }
    }
});