/**
 * Created by angela on 2016/5/28.
 */
var ClinicController = function ($scope, $location, $http, $compile, $uibModal, $log, $q, $window, ngTreetableParams) {

    $scope.plugin = new petPlugin();
    $scope.animationsEnabled = true;
    $scope.getClinicList = function(){
        var data = [];
        var roles =[];
        var test = [];
        $http(
            {
                url: constVar.baseUrl + 'API/Func/Departments?rd=' + Math.random(),
                method: "GET",
                headers: {"Authorization": "admin"},
                dataType: "json",
                async : false
            })
            .success(function (d) {
                data = d['data'];
                $.each(data,function (i,item) {
                    item.hasOwnProperty('department')
                    item.type = "科室";
                    $http(
                        {
                            url: constVar.baseUrl + 'API/Func/Departments/'+item['id']+'/Roles?isCase=false',
                            method: "GET",
                            headers: {"Authorization": "admin"},
                            dataType: "json",
                            async : false
                        })
                        .success(function (d) {
                            roles = d['data'];
                            $.each(roles,function (i,citem) {
                            //if ( item['name']!="管理制度")
                                item.children = citem;
                               test = item.children
                            });
                        })
                });


            }).error(function (data, header, config, status) {
        });
    }

    $scope.editType = function(node) {
        $scope.items = {
            id: node.id,
            name: node.name,
            normalDocId: node.normal_doc,
            parentId: node.parentId,
            parentName: node.parentName
        }
        $location.search({ normalDocId: node.normal_doc, page: "clinic"});
        $location.path('/operate');
    }

    $scope.dynamic_params = new ngTreetableParams({
        getNodes: function(parent) {
            var deferred = $q.defer();
            $http(
                {
                    url: constVar.baseUrl + 'API/Func/Departments?rd=' + Math.random(),
                    method: "GET",
                    headers: {"Authorization": "admin"},
                    dataType: "json"
                }).success(function(data) {
                var temp = data['data'];
                var roles = [];
                $.each(data['data'],function (i,item) {

                    item.type = "科室";
                    $http(
                        {
                            url: constVar.baseUrl + 'API/Func/Departments/'+item['id']+'/Roles?isCase=false',
                            method: "GET",
                            headers: {"Authorization": "admin"},
                            dataType: "json"
                        }).success(function(data) {
                        roles = data['data'];
                        var j = 0;
                            $.each(roles,function (i,citem) {
                                //if ( item['name']!="管理制度")
                                //item.children = citem['normal_doc'];
                                citem.parentId = item['id'];
                                citem.parentName = item['name'];
                               // item.childId = citem['id'];
                               // item.childName = citem['name'];
                                });
                        item['children'] =  roles;
                        deferred.resolve(temp);
                    });
                });
            });

            return parent ? parent.children : deferred.promise;
        },

        getTemplate: function (node) {
            return 'tree_node';
        },
        options: {
            //initialState: 'expanded',
            onNodeExpand: function () {
                console.log('A node was expanded!');
            }
        }
    });


    $scope.expanded_params = new ngTreetableParams({
        getNodes: function(parent) {
            return parent ? parent.children : $scope.data;
        },
        getTemplate: function(node) {
            return 'tree_node';
        },
        options: {
            initialState: 'expanded'
        }
    });

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




    $scope.init = function(){
        //console.log('int');
        //var el = document.getElementsByClassName('new');
        //console.log(el);
        //$.each(document.getElementsByClassName('new'),function(i,item){
        //    console.log("33"+ item.parent().attr("is-branch"));
        //    if(!item.parent().attr("is-branch"))
        //        item.hide();

        //});
    }

}