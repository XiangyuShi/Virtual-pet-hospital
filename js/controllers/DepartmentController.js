/**
 * Created by yichli on 4/23/16.
 */

var DepartmentController = function ($scope, $http, $compile,$uibModal,$log,$window) {
    $scope.plugin = new petPlugin();
    $scope.animationsEnabled = true;
    $scope.isDepartmentGroup = true;
    $scope.isWord = false;
    $scope.isPicture = false;
    $scope.isVedio = false;
    $scope.isWordGroup = true;
    $scope.isPictureGroup = false;
    $scope.isVedioGroup = false;
    $scope.tabs = [
        { title:'Dynamic Title 1', content:'Dynamic content 1' },
        { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
    ];

    $scope.alertMe = function() {
        setTimeout(function() {
            $window.alert('You\'ve selected the alert tab!');
        });
    };

    $scope.println = function(value){
        console.log(value);
    }
    $scope.model = {
        name: 'Tabs'
    };
    $scope.showCase = function(value){
        console.log(value.roleId);
        $scope.currentOperateName = value.roleName;
        if(value.roleId.indexOf("department") < 0){
            $window.location.href="index.html#/responsibility";
        }


    }
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

    $scope.loadmask = $scope.plugin.CreateMask({
        style: 'z-index:9999;',
        id: 'test_Mask',
        loadingImage: true
    });



    //test tree model 1
    $scope.roleList1 = [
        { "roleName" : "User", "roleId" : "role1", "children" : [
            { "roleName" : "subUser1", "roleId" : "role11", "children" : [] },
            { "roleName" : "subUser2", "roleId" : "role12", "children" : [
                { "roleName" : "subUser2-1", "roleId" : "role121", "children" : [
                    { "roleName" : "subUser2-1-1", "roleId" : "role1211", "children" : [] },
                    { "roleName" : "subUser2-1-2", "roleId" : "role1212", "children" : [] }
                ]}
            ]}
        ]},

        { "roleName" : "Admin", "roleId" : "role2", "children" : [] },

        { "roleName" : "Guest", "roleId" : "role3", "children" : [] }
    ];

    $scope.edit = function(target){
        if(target.getAttribute('class') == 'fa fa-lock pull-right'){
            target.setAttribute('class','fa fa-unlock pull-right')
            $(target).parent().parent().find('dropdown-multiselect').find('.dropdown-toggle').removeAttr('disabled');
        }
        else{
            target.setAttribute('class','fa fa-lock pull-right')
            $(target).parent().parent().find('dropdown-multiselect').find('.dropdown-toggle').attr('disabled','disabled');
            $scope.saveCase();
            console.log($scope.phases);
            //$scope.initPackage();
        }
    };
    $scope.addCasePackage = function(value){
        console.log(value);
        /*$scope.loadmask.show();
         var url = "";
         $http.post('users/addUser/' + newUser).success(function(d) {
         }).error(function (data, header, config, status) {
         $scope.loadmask.hide();
         });*/
    }
    $scope.addCase = function(value){
        console.log($scope.diseaseCase);
        console.log(value);
        console.log($scope.newCaseToPackage.id);
        /*$scope.loadmask.show();
         var url = "";
         $http.post('users/addUser/' + newUser).success(function(d) {
         }).error(function (data, header, config, status) {
         $scope.loadmask.hide();
         });*/
    }

    $scope.newCaseToPackage = {};
    $scope.showDiseaseCase = function(value){
        $scope.newCaseToPackage = value;
        console.log($scope.newCaseToPackage.id);
    }

    $scope.showDepartment = function(value){
        //$('#append').append(
        //    $compile('<button>' + value + '</button>'
        //    )($scope)
        //);
        console.log(value);
        /*$scope.loadmask.show();
         var url = "";
         $http.post('users/addUser/' + newUser).success(function(d) {
         }).error(function (data, header, config, status) {
         $scope.loadmask.hide();
         });*/
        $scope.phaseDepartment = value;
        $scope.selectValue.roles = [
            {"id": 1, "name": "roles1", "assignable": true},
            {"id": 3, "name": "roles3", "assignable": true}];
    };

    $scope.showRole = function(value){
        $scope.phaserole = value;
        /*$scope.loadmask.show();
         var url = "";
         $http.post('users/addUser/' + newUser).success(function(d) {
         }).error(function (data, header, config, status) {
         $scope.loadmask.hide();
         });*/
    };

    $scope.showOperate = function(value){
        $scope.phaseoperate = value;
        /*$scope.loadmask.show();
         var url = "";
         $http.post('users/addUser/' + newUser).success(function(d) {
         }).error(function (data, header, config, status) {
         $scope.loadmask.hide();
         });*/
    };

    $scope.phaseDepartment = [];
    $scope.phaserole = [];
    $scope.phaseoperate = [];
    $scope.initPackage = function(){
        /*$scope.loadmask.show();
         var url = "";
         $http.get(url).success(function (d) {
         }).error(function (data, header, config, status) {
         $scope.loadmask.hide();
         });*/
        $scope.selectValue = {roles: [
            {"id": 1, "name": "roles1", "assignable": true},
            {"id": 2, "name": "roles2", "assignable": true},
            {"id": 3, "name": "roles3", "assignable": true}
        ],
            operates:[
                {"id": 1, "name": "operates1", "assignable": true},
                {"id": 2, "name": "operates2", "assignable": true},
                {"id": 3, "name": "operates3", "assignable": true}
            ],
            diseaseCase:[
                {"id": 1, "name": "diseaseCase1"},
                {"id": 2, "name": "diseaseCase2"},
                {"id": 3, "name": "diseaseCase3"}
            ],
            departments:[
                {"id": 1, "name": "departments1"},
                {"id": 2, "name": "departments2"},
                {"id": 3, "name": "departments3"}
            ]};

        $scope.casePacket = [
            { "roleName" : "病例袋1", "roleId" : "department1", "children" : [
                { "roleName" : "病例1", "roleId" : "case1", "children" : []},
                { "roleName" : "病例2", "roleId" : "case2", "children" : []}
            ]
            },
            { "roleName" : "病例袋2", "roleId" : "department2", "children" : [
                { "roleName" : "病例1", "roleId" : "case1", "children" : []},
                { "roleName" : "病例2", "roleId" : "case2", "children" : []}
            ]
            }

        ];

        $scope.departmentList = [
            { "roleName" : "科室1", "roleId" : "department1", "children" : [
                { "roleName" : "角色1", "roleId" : "role1", "children" : []},
                { "roleName" : "角色2", "roleId" : "role2", "children" : []}
            ]
            },
            { "roleName" : "科室2", "departmentId" : "department2", "children" : [
                { "roleName" : "角色1", "roleId" : "role1", "children" : []},
                { "roleName" : "角色2", "roleId" : "role2", "children" : []}
            ]
            }
        ];
        $scope.phases = [
            {
                name: "阶段1",
                roleList : [
                    { "roleName" : "科室1", "roleId" : "department1", "children" : [
                        { "roleName" : "角色1", "roleId" : "role11", "children" : [
                            { "roleName" : "操作3", "roleId" : "operate3", "children" : []},
                            { "roleName" : "操作4", "roleId" : "operate4", "children" : []}
                        ]},
                        { "roleName" : "角色2", "roleId" : "role12", "children" : [
                            { "roleName" : "操作1", "roleId" : "operate1", "children" : []},
                            { "roleName" : "操作2", "roleId" : "operate2", "children" : []}
                        ]
                        }
                    ]
                    },
                    { "roleName" : "科室2", "roleId" : "department1", "children" : [
                        { "roleName" : "角色1", "roleId" : "role11", "children" : [
                            { "roleName" : "操作3", "roleId" : "operate3", "children" : []},
                            { "roleName" : "操作4", "roleId" : "operate4", "children" : []}] },
                        { "roleName" : "角色2", "roleId" : "role12", "children" : [
                            { "roleName" : "操作1", "roleId" : "operate1", "children" : []},
                            { "roleName" : "操作2", "roleId" : "operate2", "children" : []}
                        ]}
                    ]}
                ]

            },
            {
                name: "阶段2",
                roleList : [
                    { "roleName" : "科室1", "roleId" : "department1", "children" : [
                        { "roleName" : "角色1", "roleId" : "role11", "children" : [
                            { "roleName" : "操作3", "roleId" : "operate3", "children" : []},
                            { "roleName" : "操作4", "roleId" : "operate4", "children" : []}
                        ]},
                        { "roleName" : "角色2", "roleId" : "role12", "children" : [
                            { "roleName" : "操作1", "roleId" : "operate1", "children" : []},
                            { "roleName" : "操作2", "roleId" : "operate2", "children" : []}
                        ]
                        }
                    ]
                    },
                    { "roleName" : "科室2", "roleId" : "department1", "children" : [
                        { "roleName" : "角色1", "roleId" : "role11", "children" : [
                            { "roleName" : "操作3", "roleId" : "operate3", "children" : []},
                            { "roleName" : "操作4", "roleId" : "operate4", "children" : []}] },
                        { "roleName" : "角色2", "roleId" : "role12", "children" : [
                            { "roleName" : "操作1", "roleId" : "operate1", "children" : []},
                            { "roleName" : "操作2", "roleId" : "operate2", "children" : []}
                        ]}
                    ]}
                ]

            }
        ];
    };

    $scope.phaseInnerAdd = function(value){
        console.log("phaseId : " + value);
        console.log("departmentId : " + $scope.phaseDepartment.id);
        $http.get(url).success(function (d) {
        }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
        // $http.get(url).success(function (d) {
        // }).error(function (data, header, config, status) {
        //     $scope.loadmask.hide();
        // });
        $scope.phases = [
            {
                name: "阶段1",
                result:[
                    {"department": "departments1", "role": "roles1", "operate": "operate1"},
                    {"department": "departments2", "role": "roles2", "operate": "operate3"},
                    {"department": "departments3", "role": "roles3", "operate": "operate3"}
                ]
            },
            {
                name: "阶段2",
                result:[
                    {"department": "departments1", "role": "roles1", "operate": "operate1"},
                    {"department": "departments2", "role": "roles2", "operate": "operate3"},
                ]

            }
        ];
    };




    $scope.initPackage();
};

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

