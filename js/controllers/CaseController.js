/**
 * Created by yichli on 2016/4/13.
 */
var CaseController = function ($scope, $http, $compile, $uibModal, $log, $window, $location, $interval) {
    $scope.plugin = new petPlugin();
    $scope.animationsEnabled = true;
    $scope.currentPacketName = "";
    $scope.currentCaseName = "未选择病例";//当前病例名字
    $scope.currentCaseId = '';//当前病例ID
    $scope.diseaseType = "";//病种大类，默认为空
    /* initial of packet or normal case show*/
    $scope.isPacket = false;
    $scope.isNotPacket = false;
    $scope.isPacketTree = false;
    $scope.packetInfo = {asdasd: ''};
    $scope.messageForSearch = '';
    $scope.newCaseToPackage = {
        name: "",
        diseaseId: ''
    };//新增病例：disease_id必需，name和disease_case_package_id选填
    $scope.casePackage = {
        name: "",
        pet_name: ""
    };//新增病例袋：name和petName必需
    $scope.diseaseTypesForSelect = {
        diseasesForSelect: []
    };//select中选择病种大类
    $scope.diseasesForSelect = '';//select中选择病种
    $scope.phaseForSelect = '';//select中选择阶段
    $scope.phases = [];//阶段信息，包括阶段名称，科室-角色-操作
    $scope.phase = {
        id: '',
        name: ""
    };//当前选择的阶段
    $scope.phaseDepartment = {
        id: '',
        name: ""
    };//当前选择的科室
    $scope.phaserole = {
        id: '',
        name: ""
    };//当前选择的角色
    $scope.operateName = '';//新增操作的名称
    $scope.normalDocId = '';//操作对应的操作的id
    $scope.phaseoperate = [];
    $scope.caseName = '';//修改病例名称参数
    $scope.num = 1;
    $scope.active = 1;
    $scope.alertMe = function () {
        setTimeout(function () {
            $window.alert('You\'ve selected the alert tab!');
        });
    };
    //删除方法
    $scope.println = function (id, type) {
        if (type == "case") {
            $scope.deleteCase(id);
        }
        if (type == "packet") {
            $scope.deletePacket(id);
        }
        if (type == 'department') {
            $scope.deleteDepartment(id);
        }
        if (type == 'role') {
            $scope.deleteRole(id);
        }
        if (type == 'operate') {
            $scope.deleteOperate(id);
        }

    }

    $scope.model = {
        name: 'Tabs'
    };
    //点击树结点触发的函数统称为showCase,根据结点不同type决定接下来触发的函数
    $scope.showCase = function (value) {
        if (value.type == "case") {
            $scope.getDiseaseMessage(value.roleId);//获得当前病例名字，id，所属病种
            $scope.num = 1;
            $scope.showPhases(value.roleId);
            $scope.isPacket = false;
            $scope.isNotPacket = true;
            console.log(value.roleId);
        }
        if (value.type == "packet") {
            $scope.currentPacket = value;
            $scope.isPacket = true;
            $scope.isNotPacket = false;
        }
        else if (value.type == "operate") {
            $scope.getNormalDocIDAndHref(value.roleId);
        }
    };

    //修改病例基本信息
    $scope.editCase = function (valid) {
        if (!valid) {
            //alert("失败，根据表单提醒正确填写信息");
            swal("失败，根据表单提醒正确填写信息!", "error");
            return;
        }
        var data = {
            name: $scope.caseName
        };
        $scope.loadmask.show();
        $.ajax(
            {
                url: constVar.baseUrl + 'API/DiseaseCases/' + $scope.currentCaseId + '?rd=' + Math.random(),
                method: "PATCH",
                data: JSON.stringify(data),
                contentType: 'application/json;charset=utf-8',
                headers: {"Authorization": "admin"},
                dataType: "json"
            })
            .success(function (d) {
                $scope.loadmask.hide();
                if (d.meta.code == '200') {
                    //alert("修改成功");
                    swal({
                        title: "修改成功 ",
                        type: "success",
                        timer: 2000
                    });
                    $scope.searchByPackageName($scope.messageForSearch);
                    $scope.isPacket = false;
                    $scope.isNotPacket = true;
                    $scope.showPhases($scope.currentCaseId);
                }
                else if (d.meta.code == '400.2') {
                    //alert("病例名称不能重复");
                    swal({
                        title: "病例名称不能重复",
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
    };
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

    //根据病例ID获得病例信息
    $scope.getDiseaseMessage = function (id) {
        $http(
            {
                url: constVar.baseUrl + 'API/DiseaseCases/' + id + '?rd=' + Math.random(),
                method: "GET",
                headers: {"Authorization": "admin"},
                dataType: "json"
            })
            .success(function (d) {
                $scope.diseaseType = d.data.disease.name;
                $scope.currentCaseName = d.data.name;
                $scope.currentCaseId = d.data.id;
                $scope.caseName = $scope.currentCaseName;
                $scope.currentPacketName = d.data.disease_case_package.name;
            }).error(function (data, header, config, status) {
        });
    };

    //新增病例
    $scope.addCase = function (name) {
        if (name == null) {
            swal({
                title: "名字不能为空 ",
                type: "error",
                timer: 2000,
            });
            return;
        }
        if ($scope.diseasesForSelect.id == undefined || $scope.diseasesForSelect.id == null) {
            swal({
                title: "选择病种和病种小类 ",
                type: "error",
                timer: 2000,
            });
            return;
        }
        var data = {
            name: name,
            disease_id: $scope.diseasesForSelect.id
        };
        $scope.loadmask.show();
        $.ajax(
            {
                url: constVar.baseUrl + 'API/DiseaseCasePackages/' + $scope.currentPacket.roleId + '/DiseaseCases?rd=' + Math.random(),
                method: "Post",
                data: JSON.stringify(data),
                contentType: 'application/json;charset=utf-8',
                headers: {"Authorization": "admin"},
                dataType: "json"
            })
            .success(function (d) {
                $scope.selectValue.diseasesForSelect = [];
                $scope.diseasesForSelect = '';
                if (d.meta.code == '200') {
                    $scope.addPhase(d.data.id);
                    $scope.loadmask.hide();
                    //alert("新增病例成功");
                    swal({
                        title: "新增病例成功 ",
                        type: "success",
                        timer: 2000,
                    });
                    $scope.searchByPackageName($scope.messageForSearch);
                }
                else {
                    alert(d.meta.code);
                }
            }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    };

    //创建病例时，自动新增5个阶段
    $scope.addPhase = function (id) {
        var d = {
            "treatment_phase_id_list": [{"treatment_phase_id": "jd1"},
                {"treatment_phase_id": "jd2"},
                {"treatment_phase_id": "jd3"},
                {"treatment_phase_id": "jd4"},
                {"treatment_phase_id": "jd5"},
                {"treatment_phase_id": "jd6"},
            ]
        };
        $.ajax(
            {
                url: constVar.baseUrl + 'API/DiseaseCases/' + id + '/TreatmentPhases/Batch?rd=' + Math.random(),
                method: "Post",
                data: JSON.stringify(d),
                contentType: 'application/json;charset=utf-8',
                headers: {"Authorization": "admin"},
                dataType: "json"
            })
            .success(function (d) {
                if (d.meta.code == '200') {
                    var d = {
                        treatment_phase_id: "jd4",
                        department_id: "ks2",
                        role_id: "js5",
                        name: "诊断书(费用0元)",
                        fee: 0
                    };
                    $scope.loadmask.show();
                    $http(
                        {
                            url: constVar.baseUrl + 'API/DiseaseCases/' + id + '/Responsibilities?rd=' + Math.random(),
                            method: "Post",
                            data: JSON.stringify(d),
                            contentType: 'application/json;charset=utf-8',
                            headers: {"Authorization": "admin"},
                            dataType: "json"
                        })
                        .success(function (d) {
                            $scope.loadmask.hide();
                        })
                        .error(function () {
                            $scope.loadmask.hide();
                        });
                }
                else {
                    alert(d.meta.code);
                }
            }).error(function () {
        });
    };

    //新增操作
    $scope.addOperate = function (value, id, fee) {
        var phaseId = '';
        $http(
            {
                url: constVar.baseUrl + 'API/TreatmentPhases/' + id + '?rd=' + Math.random(),
                method: "GET",
                headers: {"Authorization": "admin"},
                dataType: "json"
            })
            .success(function (d) {
                if (d.meta.code == '200') {
                    phaseId = d.data.treatment_phase_id;
                    if (value == null || value == "") {
                        //alert("填写操作名称");
                        swal({
                            title: "填写操作名称",
                            type: "error",
                            timer: 3000
                        });
                        return;
                    }
                    if (fee == undefined || fee == " ") {
                        fee = 0;
                    }
                    if ($scope.phaseDepartment.department.id == undefined || $scope.phaseDepartment.department.id == null) {
                        swal({
                            title: "选择科室",
                            type: "error",
                            timer: 2000
                        });
                        return;
                    }
                    if ($scope.phaserole.role == undefined || $scope.phaserole.role == null) {
                        swal({
                            title: "选择角色",
                            type: "error",
                            timer: 2000
                        });
                        return;
                    }
                    var d = {
                        treatment_phase_id: phaseId,
                        department_id: $scope.phaseDepartment.department.id,
                        role_id: $scope.phaserole.role.id,
                        name: value + "(费用" + fee + "元)",
                        fee: fee
                    };
                    $scope.loadmask.show();
                    $http(
                        {
                            url: constVar.baseUrl + 'API/DiseaseCases/' + $scope.currentCaseId + '/Responsibilities?rd=' + Math.random(),
                            method: "Post",
                            data: JSON.stringify(d),
                            contentType: 'application/json;charset=utf-8',
                            headers: {"Authorization": "admin"},
                            dataType: "json"
                        })
                        .success(function (d) {
                            $scope.loadmask.hide();
                            $scope.selectValue.diseasesForSelect = [];
                            $scope.diseasesForSelect = '';
                            if (d.meta.code == '200') {
                                //alert("新增操作成功");
                                swal({
                                    title: "新增操作成功!",
                                    timer: 2000,
                                    type: "success"
                                });
                                $scope.phases = [];
                                $scope.num = $scope.active;
                                $scope.showPhases($scope.currentCaseId);
                            }
                            else if (d.meta.code == '404.1') {
                                //alert("选择科室和角色");
                                swal({
                                    title: "选择科室和角色 ",
                                    type: "error",
                                    timer: 3000
                                });
                            }
                            else if (d.meta.code == '400.2') {
                                //alert("同一科室角色的操作名称不能重复");
                                swal({
                                    title: "同一科室同一角色的操作名称不能重复 ",
                                    type: "error"
                                });
                            }
                        })
                        .error(function () {
                            $scope.loadmask.hide();
                        });
                }
                else {
                    alert(d.meta.code);
                }
            }).error(function (data, header, config, status) {
        });

    };

    //选择病种大类后获取该大类的病种
    $scope.showDiseaseTypes = function (value) {
        if (value != " - 请选择 -")
            $scope.loadDiseases(value);
    };

    //选择病种后，病例名称生成默认值
    $scope.showDiseases = function (value) {
        if (value != " - 请选择 -")
            $scope.newCaseToPackage.name = value + "--";
    }

    //选择科室，确定phaseDepartment
    $scope.showDepartment = function (value) {
        $scope.phaseDepartment = value;
        $scope.loadRoles(value.id);
    };

    //选择角色，确定phaserole
    $scope.showRole = function (value) {
        $scope.phaserole = value;
    };

    $scope.showOperate = function (value) {
        $scope.phaseoperate = value;
    };

    //根据关键字查找加载相关病例袋树
    $scope.searchByPackageName = function (name) {
        $scope.loadmask.show();
        if (name == null) {
            name = '';
        }
        $scope.messageForSearch = name;
        $http(
            {
                url: constVar.baseUrl + 'API/DiseaseCasePackages/Tree?word=' + encodeURI(name) + '&rd=' + Math.random(),
                method: "GET",
                headers: {"Authorization": "admin"},
                dataType: "json"
            })
            .success(function (d) {
                $scope.loadmask.hide();
                if (d.meta.code == '200') {
                    $scope.isPacketTree = true;
                    $scope.isPacket = false;
                    $scope.isNotPacket = false;
                    $scope.casePacket = [];//树的第一层数据集合
                    for (var i = 0; i < d.data.length; i++) {
                        var records = {};//树的第一层数据
                        var record = [];//树的第二层数据集合集合
                        var childRecordSet = [];//树的第二层数据集合
                        records.roleId = d.data[i]['id'];
                        records.roleName = d.data[i]['name'];
                        records.type = 'packet';
                        record = d.data[i]['disease_cases'];
                        records.children = [];
                        if (record.length > 0) record.collapsed = false;
                        for (var j = 0; j < record.length; j++) {
                            var childRecord = {};//树的第二层数据
                            childRecord.roleId = record[j]['id'];
                            childRecord.roleName = record[j]['name'];
                            childRecord.type = 'case';
                            childRecord.children = [];
                            childRecordSet.push(childRecord);
                        }
                        records.children = childRecordSet;
                        $scope.casePacket.push(records);
                    }
                    //检测ＵＲＬ
                    if ($location.search().caseId != null) {
                        $scope.currentCaseId = $location.search().caseId;
                        $scope.getDiseaseMessage($scope.currentCaseId);
                        $scope.isPacket = false;
                        $scope.isNotPacket = true;
                        if ($location.search().index != null) {
                            $scope.num = $location.search().index;
                            $scope.showPhases($scope.currentCaseId);
                        }
                    }
                }
                else {
                    alert(d.meta.code);
                }
            })
            .error(function () {
                swal({
                    title: "加载失败 ",
                    type: "error",
                    timer: 3000
                });
            });
    }

    //监听回车按键
    $scope.searchKeyDown = function (event) {
        if (event.keyCode == 13) {
            $scope.searchByPackageName($scope.packagename);
        }
    };

    //加载病例袋树
    $scope.showCasePacket = function () {
        $scope.loadmask.show();
        $http(
            {
                url: constVar.baseUrl + 'API/DiseaseCasePackages/Tree?rd=' + Math.random(),
                method: "GET",
                headers: {"Authorization": "admin"},
                dataType: "json"
            })
            .success(function (d) {
                $scope.loadmask.hide();
                if (d.meta.code == '200') {
                    $scope.isPacketTree = true;
                    $scope.casePacket = [];//树的第一层数据集合
                    for (var i = 0; i < d.data.length; i++) {
                        var records = {};//树的第一层数据
                        var record = [];//树的第二层数据集合集合
                        var childRecordSet = [];//树的第二层数据集合
                        records.roleId = d.data[i]['id'];
                        records.roleName = d.data[i]['name'];
                        records.type = 'packet';
                        record = d.data[i]['disease_cases'];
                        records.children = [];
                        for (var j = 0; j < record.length; j++) {
                            var childRecord = {};//树的第二层数据
                            childRecord.roleId = record[j]['id'];
                            childRecord.roleName = record[j]['name'];
                            childRecord.type = 'case';
                            childRecord.children = [];
                            childRecordSet.push(childRecord);
                        }
                        records.children = childRecordSet;
                        $scope.casePacket.push(records);
                    }
                }
                else {
                    alert(d.meta.code);
                }
            })
            .error(function (d) {
                alert(d.meta.code);
            });
    };

    var intervalId;
    //加载阶段树
    $scope.showPhases = function (id) {
        $scope.loadmask.show();
        $http(
            {
                url: constVar.baseUrl + 'API/DiseaseCases/' + id + '/Tree?rd=' + Math.random(),
                method: "GET",
                headers: {"Authorization": "admin"},
                dataType: "json"
            }).success(function (d) {
                if (d.meta.code == '200') {
                    //record代表集合，records代表数据
                    $scope.phases = [];
                    $scope.phases.name = '';
                    $scope.phases.id = '';
                    $scope.phases.roleList = [];
                    for (var i = 0; i < d.data.length; i++) {
                        var firstRecords = {};//树的第一层数据,保存name和rolelist
                        firstRecords.id = d.data[i]['id'];
                        firstRecords.name = d.data[i]['name'];
                        firstRecords.roleList = [];
                        var secondRecord = [];
                        for (var j = 0; j < d.data[i]['departments'].length; j++) {
                            var secondRecords = {};
                            secondRecords.roleId = d.data[i]['departments'][j]['id'];
                            secondRecords.roleName = d.data[i]['departments'][j]['name'];
                            secondRecords.type = 'department';
                            secondRecords.children = [];
                            var thirdRecord = [];
                            for (var k = 0; k < d.data[i]['departments'][j]['roles'].length; k++) {
                                var thirdRecords = {};
                                thirdRecords.roleId = d.data[i]['departments'][j]['roles'][k]['id'];
                                thirdRecords.roleName = d.data[i]['departments'][j]['roles'][k]['name'];
                                thirdRecords.type = 'role';
                                thirdRecords.children = [];
                                var forthRecord = [];
                                for (var l = 0; l < d.data[i]['departments'][j]['roles'][k]['responsibilities'].length; l++) {
                                    var forthRecords = {};
                                    forthRecords.roleId = d.data[i]['departments'][j]['roles'][k]['responsibilities'][l]['id'];
                                    forthRecords.roleName = d.data[i]['departments'][j]['roles'][k]['responsibilities'][l]['name'];
                                    forthRecords.type = 'operate';
                                    forthRecords.children = [];
                                    forthRecord.push(forthRecords);
                                }
                                thirdRecords.children = forthRecord;
                                thirdRecord.push(thirdRecords);
                            }
                            secondRecords.children = thirdRecord;
                            secondRecord.push(secondRecords);
                        }
                        firstRecords.roleList = secondRecord;
                        $scope.phases.push(firstRecords);
                    }

                    intervalId = $interval(function () {
                        if ($scope.num != $scope.active) {
                            $scope.active = $scope.num;
                        }
                        else {
                            $interval.cancel(intervalId);
                            $scope.loadmask.hide();
                        }
                    }, 500);
                }
                else {
                    alert(d.meta.code);
                }

            })
            .error(function (d) {
                alert(d.meta.code);
                $scope.loadmask.hide();
            });
    };

    //读取selectValue.diseaseCase
    $scope.loadDiseaseCase = function () {
        $http(
            {
                url: constVar.baseUrl + 'API/DiseaseCasePackages?rd=' + Math.random(),
                method: "GET",
                headers: {"Authorization": "admin"},
                dataType: "json"
            })
            .success(function (d) {
                if (d.meta.code == '200') {
                    $scope.selectValue.diseaseCase = [];
                    for (var i = 0; i < d.data.length; i++) {
                        var records = {};
                        records.id = d.data[i]['id'];
                        records.name = d.data[i]['name'];
                        $scope.selectValue.diseaseCase.push(records);
                    }
                }
                else {
                    alert(d.meta.code);
                }
            }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
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
                    alert(d.meta.code);
                }
            }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    };

    //获取diseaseTypesForSelect.diseasesForSelect
    $scope.loadDiseases = function (value) {
        $scope.loadmask.show();
        $.ajax(
            {
                url: constVar.baseUrl + 'API/DiseaseTypes/' + value.id + '/Diseases?rd=' + Math.random(),
                method: "GET",
                headers: {"Authorization": "admin"},
                dataType: "json"
            })
            .success(function (d) {
                $scope.loadmask.hide();
                $scope.diseaseTypesForSelect.diseasesForSelect = [];
                $scope.diseasesForSelect = '';
                if (d.meta.code == '200') {
                    for (var i = 0; i < d.data.length; i++) {
                        var records = {};
                        records.id = d.data[i]['id'];
                        records.name = d.data[i]['name'];
                        $scope.diseaseTypesForSelect.diseasesForSelect.push(records);
                    }
                    $scope.$apply();
                }
                else {
                    alert(d.meta.code);
                }
            }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    };

    //获取selectValue.phaseForSelect
    $scope.loadPhase = function () {
        $http(
            {
                url: constVar.baseUrl + 'API/Management/TreatmentPhases?rd=' + Math.random(),
                method: "GET",
                headers: {"Authorization": "admin"},
                dataType: "json"
            })
            .success(function (d) {
                if (d.meta.code == '200') {
                    $scope.selectValue.phaseForSelect = [];
                    for (var i = 0; i < d.data.length; i++) {
                        var records = {};
                        records.id = d.data[i]['id'];
                        records.name = d.data[i]['name'];
                        $scope.selectValue.phaseForSelect.push(records);
                    }
                }
                else {
                    alert(d.meta.code);
                }
            }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    };

    //获取selectValue.departmentsForSelect
    $scope.loadDepartments = function () {
        $http(
            {
                url: constVar.baseUrl + 'API/Func/Departments?rd=' + Math.random(),
                method: "GET",
                headers: {"Authorization": "admin"},
                dataType: "json"
            })
            .success(function (d) {
                if (d.meta.code == '200') {
                    $scope.selectValue.departmentsForSelect = [];
                    for (var i = 0; i < d.data.length; i++) {
                        var records = {};
                        records.id = d.data[i]['id'];
                        records.name = d.data[i]['name'];
                        records.department = d.data[i]['department'];
                        $scope.selectValue.departmentsForSelect.push(records);
                    }
                }
                else {
                    alert(d.meta.code);
                }
            }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    };

    //获取selectValue.rolesForSelect
    $scope.loadRoles = function (id) {
        $http(
            {
                url: constVar.baseUrl + '/API/Func/Departments/' + id + '/Roles?isCase=true&rd=' + Math.random(),
                method: "GET",
                headers: {"Authorization": "admin"},
                dataType: "json"
            })
            .success(function (d) {
                if (d.meta.code == '200') {
                    $scope.selectValue.rolesForSelect = [];
                    for (var i = 0; i < d.data.length; i++) {
                        var records = {};
                        records.id = d.data[i]['id'];
                        records.name = d.data[i]['name'];
                        records.role = d.data[i]['role'];
                        $scope.selectValue.rolesForSelect.push(records);
                    }
                }
                else {
                    alert(d.meta.code);
                }
            }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    };

    //获取当前操作对应的简单节点的id并且跳转
    $scope.getNormalDocIDAndHref = function (id) {
        $scope.normalDocId = '';
        $.ajax(
            {
                url: constVar.baseUrl + 'API/Responsibilities/' + id + '?rd=' + Math.random(),
                method: "GET",
                headers: {"Authorization": "admin"},
                dataType: "json"
            })
            .success(function (d) {
                if (d.meta.code == '200') {
                    $scope.normalDocId = d.data.normal_doc;
                    $location.search({
                        message: $scope.messageForSearch,
                        caseId: $scope.currentCaseId,
                        index: $scope.active,
                        normalDocId: $scope.normalDocId,
                        page: "case"
                    });
                    $location.path('/operate');
                    //$window.location.href = "index.html#/operate?normalDocId=" + $scope.normalDocId;
                }
                else {
                    alert(d.meta.code);
                }
            }).error(function (data, header, config, status) {
            $scope.loadmask.hide();
        });
    };
    //删除病例袋
    $scope.deletePacket = function (id) {
        swal({
            title: "确定删除病例袋吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnConfirm: true
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
                        swal({
                            title: "删除病例袋成功 ",
                            type: "success",
                            timer: 2000
                        });
                        $scope.searchByPackageName($scope.messageForSearch);
                    }
                    else {
                        alert(d.meta.code);
                    }
                }).error(function (data, header, config, status) {
                $scope.loadmask.hide();
            });
        });

    };

    //删除病例
    $scope.deleteCase = function (id) {
        swal({
            title: "确定删除病例吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnConfirm: true
        }, function () {
            $scope.loadmask.show();
            $.ajax(
                {
                    url: constVar.baseUrl + 'API/DiseaseCases/' + id + '/Enforce?rd=' + Math.random(),
                    method: "DELETE",
                    headers: {"Authorization": "admin"},
                    dataType: "json"
                })
                .success(function (d) {
                    $scope.loadmask.hide();
                    if (d.meta.code == '200') {
                        swal({
                            title: "删除病例成功 ",
                            type: "success",
                            timer: 2000
                        });
                        $scope.searchByPackageName($scope.messageForSearch);
                    }
                    else {
                        alert(d.meta.code);
                    }
                }).error(function (data, header, config, status) {
                $scope.loadmask.hide();
            });
        });

    };

    //删除科室
    $scope.deleteDepartment = function (id) {

        swal({
            title: "确定删除科室吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnConfirm: true
        }, function () {
            $scope.loadmask.show();
            $.ajax(
                {
                    url: constVar.baseUrl + 'API/Departments/' + id + '/Enforce?rd=' + Math.random(),
                    method: "DELETE",
                    headers: {"Authorization": "admin"},
                    dataType: "json"
                })
                .success(function (d) {
                    $scope.loadmask.hide();
                    if (d.meta.code == '200') {
                        //alert("删除科室成功");
                        swal({
                            title: "删除科室成功 ",
                            type: "success",
                            timer: 2000
                        });
                        $scope.num = $scope.active;
                        $scope.showPhases($scope.currentCaseId);
                    }
                    else {
                        alert(d.meta.code);
                    }
                }).error(function () {
                $scope.loadmask.hide();
            });
        });

    };

    //删除角色
    $scope.deleteRole = function (id) {

        swal({
            title: "确定删除角色吗?",
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
                    url: constVar.baseUrl + 'API/Roles/' + id + '/Enforce?rd=' + Math.random(),
                    method: "DELETE",
                    headers: {"Authorization": "admin"},
                    dataType: "json"
                })
                .success(function (d) {
                    $scope.loadmask.hide();
                    if (d.meta.code == '200') {
                        //alert("删除角色成功");
                        swal({
                            title: "删除角色成功 ",
                            type: "success",
                            timer: 2000
                        });
                        $scope.num = $scope.active;
                        $scope.showPhases($scope.currentCaseId);
                    }
                    else {
                        alert(d.meta.code);
                    }
                }).error(function (data, header, config, status) {
                $scope.loadmask.hide();
            });
        });

    };

    //删除操作
    $scope.deleteOperate = function (id) {
        swal({
            title: "确定删除操作吗?",
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
                    url: constVar.baseUrl + 'API/Responsibilities/' + id + '/Enforce?rd=' + Math.random(),
                    method: "DELETE",
                    headers: {"Authorization": "admin"},
                    dataType: "json"
                })
                .success(function (d) {
                    $scope.loadmask.hide();
                    if (d.meta.code == '200') {
                        //alert("删除操作成功");
                        swal({
                            title: "删除操作成功 ",
                            type: "success",
                            timer: 2000
                        });
                        $scope.num = $scope.active;
                        $scope.showPhases($scope.currentCaseId);
                    }
                    else {
                        alert(d.meta.code);
                    }
                }).error(function (data, header, config, status) {
                $scope.loadmask.hide();
            });
        });

    };

    //检查ＵＲＬ
    $scope.watchURL = function () {
        if ($location.search().message != null) {
            $scope.messageForSearch = decodeURI($location.search().message);
            $scope.searchByPackageName($scope.messageForSearch);
        }
    };

    //
    $scope.backToCasePackage = function () {
        $location.search({
            message: $scope.messageForSearch,
        });
        $location.path('/casepackage');
    }
    //初始化
    $scope.initPackage = function () {
        $scope.selectValue = {
            rolesForSelect: [],
            diseaseCase: [],
            departmentsForSelect: [],
            diseaseTypeForSelect: [],
            phaseForSelect: []
        };
        $scope.loadDiseaseTypes();
        $scope.loadDepartments();
        $(document).find('input[bootstrapDatetime]').datetimepicker({
            format: 'yyyy-mm-dd',
            minView: 2,
            autoclose: true,
            language: 'zh-CN',
            todayBtn: true
        });
        $scope.newCaseToPackage = {
            name: "",
            disease_case_package_id: '',
            disease_id: ''
        };
        $scope.watchURL();
    };
    $scope.initPackage();

    $scope.tabs = [{
        name: "one",
        content: '<h1>tab one</h1>'
    }, {
        name: "two",
        content: '<h1>tab two</h1>'
    }, {
        name: "three",
        content: '<h1>tab three</h1>'
    }];

    // Save active tab to localStorage
    $scope.setActiveTab = function (activeTab) {
        sessionStorage.setItem("activeTab", activeTab);
    };

    // Get active tab from localStorage
    $scope.getActiveTab = function () {
        return sessionStorage.getItem("activeTab");
    };

    // Check if current tab is active
    $scope.isActiveTab = function (tabName, index) {
        var activeTab = $scope.getActiveTab();
        return (activeTab === tabName || (activeTab === null && index === 0));
    };
    $scope.data = {}
    $scope.updateValueInScope = function () {
        console.log($scope.data.value);
        $scope.data.valueInScope = $scope.data.value;
        alert($scope.data.valueInScope);

    }


};
