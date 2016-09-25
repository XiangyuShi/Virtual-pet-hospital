/*
 @license Angular Treeview version 0.1.6
 ⓒ 2013 AHN JAE-HA http://github.com/eu81273/angular.treeview
 License: MIT


 [TREE attribute]
 angular-treeview: the treeview directive
 tree-id : each tree's unique id.
 tree-model : the tree model on $scope.
 node-id : each node's id
 node-label : each node's label
 node-children: each node's children

 <div
 data-angular-treeview="true"
 data-tree-id="tree01"
 data-tree-model="roleList"
 data-node-id="roleId"
 data-node-label="roleName"
 data-node-type = "type"
 data-node-children="children" 
 data-show-trash="false"
 data-show-check="true"
 data-node-check="isCheck"
 data-node-collapse="true"
 >
 </div>
 */
(function (f) {
    f.module("angularTreeview", []).directive("treeModel", function ($compile) {
        return {
            restrict: "A", link: function (b, h, c) {
                var showTrash = c.showTrash;
                var showCheck = c.showCheck || false;
                var x = c.nodeCollapse || false;
                var collapseClass = x == 'true' ? 'expanded fa fa-minus' : 'collapsed fa fa-plus';
                var expandClass = x == 'true' ? 'collapsed fa fa-plus' : 'expanded fa fa-minus';
                var z = c.nodeCheck;
                var checkHtml = showCheck == 'true' ? '<input type="checkbox" ng-click="treeCheck(node)" ng-model="node.' + z + '"  ng-checked="node.' + z + '" />' : '';
                var a = c.treeId, g = c.treeModel, e = c.nodeLabel, type = c.nodeType || "type", f = c.nodeId || "label", d = c.nodeChildren || "children", e = '<ul><li data-ng-repeat="node in ' + g + '" ng-mouseenter="show = ' + showTrash + '" ng-mouseleave="show = false"><i class="' + collapseClass + '" data-ng-show="node.' + d + '.length && node.collapsed" data-ng-click="' + a + '.selectNodeHead(node)"></i><i class="' + expandClass + '" data-ng-show="node.' + d + '.length && !node.collapsed" data-ng-click="' + a + '.selectNodeHead(node)"></i><i class="normal fa fa-stethoscope" data-ng-hide="node.' +
                    d + '.length"></i> ' + checkHtml + '<span data-ng-class="node.selected" ng-model ="node.' + f + '" data-ng-click="' + a + '.selectNodeLabel(node);showCase(node)"  >{{node.' + e + '}}</span><i class="fa fa-trash-o icon-margin-left10" ng-show="show" ng-click="println(node.' + f + ',node.' + type + ')"></i><div ' + (x == 'true' ? 'data-ng-show' : 'data-ng-hide') + '="node.collapsed" data-tree-id="' + a + '" data-tree-model="node.' + d + '" data-node-id=' + (c.nodeId || "id") + " data-node-label=" + e + " data-node-children=" + d + " data-node-type=" + type + " data-show-trash=" + showTrash + " data-show-check=" + showCheck + " data-node-check=" + z + " data-node-collapse=" + x + "></div></li></ul>";
                a && g && (c.angularTreeview && (b[a] = b[a] || {}, b[a].selectNodeHead = b[a].selectNodeHead || function (a) {
                    a.collapsed = !a.collapsed
                }, b[a].selectNodeLabel = b[a].selectNodeLabel || function (c) {
                    b[a].currentNode && b[a].currentNode.selected &&
                    (b[a].currentNode.selected = void 0);
                    c.selected = "selected";
                    b[a].currentNode = c
                }), h.html('').append($compile(e)(b)))
            }
        }
    })
})(angular);
