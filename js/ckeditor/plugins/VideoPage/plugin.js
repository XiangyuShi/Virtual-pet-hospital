(function () {
    b = 'VideoPage';
    CKEDITOR.plugins.add(b, {
        requires: ["dialog"], //当按钮触发时弹出对话框
        init: function (editor) {
            //editor.addCommand(b, a);
            editor.addCommand("myvideo", new CKEDITOR.dialogCommand("myvideo"));
            editor.ui.addButton('VideoPage', {
                label: '插入视频',
                icon: this.path + 'video_icon.png',
                command: "myvideo"
            });
            CKEDITOR.dialog.add("myvideo", this.path + "/video.js");
        },
        onLoad: function (editor) {
            CKEDITOR.document.appendStyleSheet(this.path + "/video.css");
        }
    });
})();