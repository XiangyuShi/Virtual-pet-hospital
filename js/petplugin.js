function petPlugin()
{ }
/*
jquery.js
bootstrap.js
petplugin.js
bootstrap.css
petplugin.css
*/
petPlugin.prototype.InitializePlugin = (function ($) {
    function Constructor(d) {
        var constructor = this;
        $(document).find('input[plugin-tree]').each(function () {
            var obj = $(this);
            $(obj).hide();
            $(obj).val('');
            var p = new Object();
            p = $.extend({
                width: 200,
                height: 200,
                root: '',
                postData: {},
                autoLoad: false,
                expandAll: true,
                multiple: false,
                nodeClick: function () { },
                onCheck: function () { },
                canClose: true,
                disable: false,
                url: '',
                placeHolder: '&nbsp;',
                reloadAlways: false,
                loaded: false
            }, eval("(" + (obj).attr('plugin-tree') + ")"));
            p.id = $(obj).attr('id');
            var container = $('<div class="PluginContainer" style="width:' + p.width + 'px;"></div>');
            $(obj).after(container);
            var btn = $('<div class="btn-group">\
                         <button type="button" style="width:' + p.width + 'px;" class="btn btn-default dropdown-toggle"><div style="text-align: left;float:left;width:' + (p.width - 30) + 'px;">' + p.placeHolder + '</div><span class="caret"></span></button>\
                        </div>')
            var div = $('<div id="' + p.id + '_treeDiv" class="PluginPanel" style="min-width:' + p.width + 'px;height:' + p.height + 'px;"></div>')
            $(btn).append(div);
            $(container).append(btn);
            p.plugin = new petPlugin();
            p.tree = p.plugin.CreateTree({
                id: p.id + '_dropDownTree',
                root: p.root,
                postData: p.postData,
                autoLoad: p.autoLoad,
                expandAll: p.expandAll,
                multiple: p.multiple,
                nodeClick: function (event, treeId, treeNode) {
                    if (p.multiple) return;
                    var html = treeNode.name;
                    var val = treeNode.id;
                    if (treeNode.pId == null) {
                        html = p.placeHolder;
                        val = '';
                    }
                    $(obj).val(val);
                    $(btn).find('button').find('div').html(html);
                    $(btn).removeClass('open');
                    event.stopPropagation();
                },
                onCheck: function (event, treeId, treeNode) {
                    var treeObj = $.fn.zTree.getZTreeObj(p.id + '_dropDownTree');
                    var nodes = treeObj.getCheckedNodes(true);
                    var val = '';
                    var html = '';
                    for (var i = 0; i < nodes.length; i++) {
                        if (nodes[i].id == '-1') continue;
                        val += nodes[i].id;
                        html += nodes[i].name;
                        if (i != nodes.length - 1) {
                            val += ',';
                            html += ',';
                        }
                    }
                    $(obj).val(val);
                    if (html == '')
                        html = p.placeHolder;
                    $(btn).find('button').find('div').html(html);
                },
                renderTo: p.id + '_treeDiv',
            });
            $(btn).find('button').click(function (event) {
                if (!p.loaded || p.reloadAlways) {
                    p.tree.loadTree(null, p.postData);
                    p.loaded = true;
                }
                $(btn).toggleClass('open');
                event.stopPropagation();
            });
            $(div).mouseleave(function () {
                p.canClose = true;
            });
            $(div).mousemove(function () {
                p.canClose = false;
            });
            $(document).click(function (event) {
                if (p.canClose) {
                    $(btn).removeClass('open');
                }
            });
            $(obj).change(function () {
                var cb = function () {
                    var v = $(obj).val();
                    var treeObj = $.fn.zTree.getZTreeObj(p.id + '_dropDownTree');
                    if (v == '') {
                        $(btn).find('button').find('div').html(p.placeHolder);
                        if (p.multiple) {
                            treeObj.checkAllNodes(false);
                        } else {
                            treeObj.cancelSelectedNode();
                        }
                    }
                    else {
                        if (p.multiple) {
                            var array = v.split(',');
                            var html = '';
                            for (var i = 0; i < array.length; i++) {
                                var nodes = treeObj.getNodesByParam("id", array[i], null);
                                treeObj.checkNode(nodes[0], true, true);
                                html += nodes[0].name;
                                if (i != array.length - 1)
                                    html += ',';
                            }
                            $(btn).find('button').find('div').html(html);

                        } else {
                            var nodes = treeObj.getNodesByParam("id", v, null);
                            treeObj.selectNode(nodes[0]);
                            $(btn).find('button').find('div').html(nodes[0].name);
                        }
                    }
                }
                if (!p.loaded || p.reloadAlways) {
                    p.tree.loadTree(cb, p.postData);
                    p.loaded = true;
                }
                else
                    cb();
            });
        });

    }
    return function (d) {
        return new Constructor(d);
    }
})(jQuery);
/*
jquery.js
bootstrap.js
petplugin.js
bootstrap.css
petplugin.css
*/
petPlugin.prototype.CreateMask = (function ($) {
    function Constructor(d) {
        var constructor = this;
        var p = new Object();
        p = $.extend({
            id: '',
            style: '',
            loadingImage: false
        }, d);
        var id = 'Plugin_mask_layer_' + p.id;
        var mask = $('<div><div id="' + id + '" class="PluginMaskDiv" style="' + p.style + '"></div>');
        if (p.loadingImage) {
            $(mask).find('#' + id).append('<div class="PluginMaskloading"><div class="PluginloadingImage"></div></div>');
        }

        this.show = function () {
            if ($("#" + id).length > 0) {
                $("#" + id).show();
            }
            else {
                $("body").append($(mask).html());
                $("#" + id).show();
            }
        }
        this.hide = function () {
            $("#" + id).hide();
        }
    }
    return function (d) {
        return new Constructor(d);
    }
})(jQuery);
/*
jquery.js
bootstrap.js
petplugin.js
bootstrap.css
petplugin.css
*/
petPlugin.prototype.CreateModal = (function ($) {
    function Constructor(d) {
        var constructor = this;
        //constructor.draggable = false;
        var p = new Object();
        p = $.extend({
            id: '',
            title: '',
            //allowDrag: false,
            width: 600,
            height: 500,
            cancelText: '取消',
            confirmText: '确认',
            onConfirm: null,
            onCancel: null,
            backdrop: false,
            keyboard: false,
            showFooter: true,
            renderTo: '',
            contentElement: ''
        }, d);

        var id = 'MyPlugin_Modal_' + p.id;
        var modal = $('<div class="modal fade" id="' + id + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\
                          <div class="modal-dialog" role="document" style="width:'+ p.width + 'px;">\
                            <div class="modal-content">\
                              <div class="modal-header">\
                                <button type="button" class="close"  aria-label="Close"><span>&times;</span></button>\
                                <h4 class="modal-title" id="myModalLabel">'+ p.title + '</h4>\
                              </div>\
                              <div class="modal-body" style="height:' + p.height + 'px;">\
                              </div>\
                            </div>\
                          </div>\
                        </div>');
        if (p.showFooter) {
            $(modal).find('.modal-body').after('<div class="modal-footer"><button type="button" class="btn btn-default">' + p.cancelText + '</button><button type="button" class="btn btn-primary">' + p.confirmText + '</button></div>');
        }
        var plugin = new petPlugin();
        var mask = plugin.CreateMask({
            style: 'z-index:1000;',
            id: id + '_Mask',
            loadingImage: false
        });
        this.renderTo = function () {
            if (p.renderTo != '') {
                $("#" + p.renderTo).append(modal);
            } else {
                $("body").append(modal);
            }
            if (p.contentElement != '') {
                $('#' + p.contentElement).appendTo($('#' + id).find('.modal-body'));
                $('#' + p.contentElement).show();
            }
            $('#' + id).find('.modal-footer').children('button:eq(0)').click(function () {
                if (p.onCancel)
                    p.onCancel();
                constructor.hide();
            });
            $('#' + id).find('.modal-footer').children('button:eq(1)').click(function () {
                if (p.onConfirm)
                    p.onConfirm();
            });
            $('#' + id).find('.modal-header').children('button:eq(0)').click(function () {
                if (p.onCancel)
                    p.onCancel();
                constructor.hide();
            });
        };
        constructor.renderTo();
        this.setTitle = function (title) {
            $('#' + id).find('.modal-title').html(title);
        };
        this.show = function () {
            if ($("#" + id).length == 0) {
                constructor.renderTo();
            }
            mask.show();
            $("#" + id).modal(p);
            $("#" + id).find('.modal-dialog').height(p.height);
            $("#" + id).find('.modal-dialog').width(p.width);
        }
        this.hide = function () {
            mask.hide();
            $("#" + id).modal('hide');
        }
        this.setHeight = function (h) {
            p.height = h;
        }
        this.setWidth = function (w) {
            p.width = w;
        }
    }
    return function (d) {
        return new Constructor(d);
    }
})(jQuery);
/*
jquery.js
bootstrap.js
petplugin.js
bootstrap.css
petplugin.css
metroStyle.css
jquery.ztree.core-3.5.js
jquery.ztree.excheck-3.5.js
jquery.ztree.exedit-3.5.js
*/
petPlugin.prototype.CreateTree = (function ($) {
    function Constructor(d) {
        var constructor = this;
        var p = new Object();
        p = $.extend({
            url: '',
            id: '',
            root: '',
            postData: {},
            autoLoad: true,
            expandAll: true,
            multiple: false,
            nodeClick: function () { },
            onCheck: function () { },
            renderTo: '',
        }, d);

        var id = p.id;
        var setting = {
            check: { enable: p.multiple },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onClick: p.nodeClick,
                onCheck: p.onCheck
            },
        };
        var tree = $('<ul id="' + id + '" class="ztree"></ul>');
        if (p.renderTo != '') {
            $("#" + p.renderTo).append(tree);
        }
        this.getPostData = function () {
            return p.postData;
        }
        this.loadTree = function (callBack, postData) {
            if (postData)
                p.postData = postData;
            var nodes = [];
            $('#' + id).empty();
            $.ajax({
                url: p.url,
                type: 'post',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(p.postData),
                success: function (d) {
                    if (d.code == '200') {
                        nodes = d.result;
                        if (p.root != '')
                            nodes.push({ id: -1, pId: -2, name: p.root });
                        $('#' + id).empty();
                        $.fn.zTree.init($('#' + id), setting, nodes);
                        $.fn.zTree.getZTreeObj(p.id).expandAll(p.expandAll);
                        if (p.onSuccess)
                            p.onSuccess();
                        if (callBack)
                            callBack();
                    }
                    else {
                        if (p.onFailure)
                            p.onFailure();
                    }
                },
                error: function (xmlHttpRequest, error, exception) {
                    if (p.onError)
                        p.onError(xmlHttpRequest, error, exception);
                }
            });
        }
        if (p.autoLoad)
            constructor.loadTree();
    }
    return function (d) {
        return new Constructor(d);
    }
})(jQuery);