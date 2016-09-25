(function(){ 
    b='ImagePage'; 
    CKEDITOR.plugins.add(b, {
        requires: ["dialog"], //当按钮触发时弹出对话框
        init:function(editor){ 
            //editor.addCommand(b, a);
            editor.addCommand("myimage", new CKEDITOR.dialogCommand("myimage"));
            editor.ui.addButton('ImagePage',{ 
                label:'插入图片', 
                icon: this.path + 'image_icon.png', 
                command: "myimage"
            });
            CKEDITOR.dialog.add("myimage", this.path + "/image.js");
        },
        onLoad: function (editor) {
            CKEDITOR.document.appendStyleSheet(this.path + "/image.css");
        }
    }); 
})(); 