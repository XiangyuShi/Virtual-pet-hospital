'use strict';

var phtindex = {};

var App = angular.module('phtindex', ['phtindex.filters', 'phtindex.services',
    'phtindex.directives', 'angularTreeview',
    'ngRoute', 'ngAnimate',
    'ui.bootstrap', 'ngTreetable',
    'ngTable', 'angularFileUpload','ng-sortable']);

// Declare app level module which depends on filters, and services
App.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/user', {
        templateUrl: 'users/user.html',
        controller: UserController,
        resolve: {
            permission: function ($route, authorizationService) {
                return authorizationService.permissionCheck('user');
            }
        }
    });
    $routeProvider.when('/paper', {
        templateUrl: 'test/paper.html',
        controller: PaperController,
        resolve: {
            permission: function ($route, authorizationService) {
                return authorizationService.permissionCheck('paper');
            }
        }
    });
    $routeProvider.when('/paperContent', {
        templateUrl: 'test/paperContent.html?id',
        controller: PaperContentController,
        resolve: {
            permission: function ($route, authorizationService) {
                return authorizationService.permissionCheck('paperContent');
            }
        }
    });
    $routeProvider.when('/test', {
        templateUrl: 'test/test.html',
        controller: TestController,
        resolve: {
            permission: function ($route, authorizationService) {
                return authorizationService.permissionCheck('test');
            }
        }
    });
    $routeProvider.when('/case', {
        templateUrl: 'diseaseCase/case.html',
        controller: CaseController,
        resolve: {
            permission: function ($route, authorizationService) {
                return authorizationService.permissionCheck('case');
            }
        }
    });
    $routeProvider.when('/operate', {
        templateUrl: 'diseaseCase/operate.html',
        controller: OperateController,
        resolve: {
            permission: function ($route, authorizationService) {
                return authorizationService.permissionCheck('operate');
            }
        }
    });
    $routeProvider.when('/department', {
        templateUrl: 'department/department.html',
        controller: DepartmentController,
        resolve: {
            permission: function ($route, authorizationService) {
                return authorizationService.permissionCheck('department');
            }
        }
    });
    $routeProvider.when('/responsibility', {
        templateUrl: 'department/responsibility.html',
        controller: OperateController,
        resolve: {
            permission: function ($route, authorizationService) {
                return authorizationService.permissionCheck('responsibility');
            }
        }
    });
    $routeProvider.when('/exam', {
        templateUrl: 'exam/layoutexam.html',
        controller: ExamController,
        resolve: {
            permission: function ($route, authorizationService) {
                return authorizationService.permissionCheck('exam');
            }
        }
    });
    $routeProvider.when('/role', {
        templateUrl: 'systemRole/systemRole.html',
        controller: SystemRoleController,
        resolve: {
            permission: function ($route, authorizationService) {
                return authorizationService.permissionCheck('role');
            }
        }
    });
    $routeProvider.when('/examdetail', {
        templateUrl: 'exam/layoutexamdetail.html?id',
        controller: ExamDetailController,
        resolve: {
            permission: function ($route, authorizationService) {
                return authorizationService.permissionCheck('examdetail');
            }
        }
    });
    $routeProvider.when('/menu', {
        templateUrl: 'menu/menu.html',
        controller: MenuController,
        resolve: {
            permission: function ($route, authorizationService) {
                return authorizationService.permissionCheck('menu');
            }
        }
    });
    $routeProvider.when('/diseasetype', {
        templateUrl: 'diseaseType/diseasetype.html',
        controller: DiseaseTypeController,
        resolve: {
            permission: function ($route, authorizationService) {
                return authorizationService.permissionCheck('diseasetype');
            }
        }
    });
    $routeProvider.when('/casepackage', {
        templateUrl: 'diseaseCase/casepackage.html',
        controller: CasePackageController,
        resolve: {
            permission: function ($route, authorizationService) {
                return authorizationService.permissionCheck('casepackage');
            }
        }
    });
    $routeProvider.when('/medicine', {
        templateUrl: 'medicine/medicine.html',
        controller: MedicineController,
        resolve: {
            permission: function ($route, authorizationService) {
                return authorizationService.permissionCheck('medicine');
            }
        }
    });
    $routeProvider.when('/picture', {
        templateUrl: 'picture/picture.html',
        controller: PictureController,
        resolve: {
            permission: function ($route, authorizationService) {
                return authorizationService.permissionCheck('picture');
            }
        }
    });
    $routeProvider.when('/video', {
        templateUrl: 'video/video.html',
        controller: VideoController,
        resolve: {
            permission: function ($route, authorizationService) {
                return authorizationService.permissionCheck('video');
            }
        }
    });
    $routeProvider.when('/freemode', {
        templateUrl: 'freeMode/freemode.html',
        controller: FreeModeController,
        resolve: {
            permission: function ($route, authorizationService) {
                return authorizationService.permissionCheck('freemode');
            }
        }
    });
    $routeProvider.when('/freemodecontent', {
        templateUrl: 'freeMode/freemodeContent.html',
        controller: FreeModeContentController,
        resolve: {
            permission: function ($route, authorizationService) {
                return authorizationService.permissionCheck('freemode');
            }
        }
    });
    $routeProvider.when('/freemodeexamcontent', {
        templateUrl: 'freeMode/freemodeExamContent.html',
        controller: FreeModeExamContentController,
        resolve: {
            permission: function ($route, authorizationService) {
                return authorizationService.permissionCheck('freemode');
            }
        }
    });
    $routeProvider.when('/clinic', {
        templateUrl: 'department/clinic.html',
        controller: ClinicController,
        resolve: {
            permission: function ($route, authorizationService) {
                return authorizationService.permissionCheck('clinic');
            }
        }
    });
    $routeProvider.when('/appliance', {
        templateUrl: 'app/appliance.html',
        controller: ApplianceController,
        resolve: {
            permission: function ($route, authorizationService) {
                return authorizationService.permissionCheck('appliance');
            }
        }
    });
    $routeProvider.when('/nopermission', {
        templateUrl: 'NoPermission.html'
    });
    $routeProvider.otherwise({ redirectTo: '/homepage' });

}]);


