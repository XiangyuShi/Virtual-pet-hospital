CKEDITOR.dialog.add(
    "myimage",
      function (b) {
          return {
              title: "图片",
              minWidth: 590,
              minHeight: 300,
              contents: [{
                  id: "myimageTab",
                  label: "",
                  title: "",
                  expand: true,
                  padding: 0,
                  elements: [{
                      type: "html",
                      html: '<div style="clear:both;" class="myimageDiv">\
                                <ul>\
                                </ul>\
                            </div>\
                            <div style="clear:both;padding:10px;"><label class="cke_dialog_ui_labeled_label">图片宽度:</label><input type="text" class="cke_dialog_ui_input_text" style="width:100px;" placeHolder="图片宽度" /></div>\
                            <div style="clear:both;padding:10px;"><label class="cke_dialog_ui_labeled_label">图片高度:</label><input type="text" class="cke_dialog_ui_input_text" style="width:100px;" placeHolder="图片高度" /></div>'
                  }]
              }],
              onOk: function () { //对话框点击确定的时候调用该函数
                  var imgs = $('.myimageDiv').find('a[class="myimage-a myimage-active"]');
                  for (var i = 0; i < imgs.length; i++) {
                      var img = b.document.createElement('img');
                      img.setAttribute('alt', '');
                      img.setAttribute('src', $(imgs[i]).children('img:eq(0)').attr('src'));
                      var w = $('.myimageDiv').next().children('input').val();
                      var h = $('.myimageDiv').next().next().children('input').val();
                      img.setAttribute('width', w);
                      img.setAttribute('height', h);
                      b.insertElement(img);
                  }
              },
              onLoad: function () { //对话框初始化时调用
                  $.ajax({
                      url: constVar.baseUrl + 'API/Management/PictureNodes?rd=' + Math.random(),
                      type: 'get',
                      dataType: 'json',
                      contentType: 'application/json;charset=utf-8',
                      headers: {
                          "Authorization": "admin"
                      },
                      data: {},
                      success: function (d) {
                          if (d.meta.code == '200') {
                              var ul = $('.myimageDiv').find('ul');
                              $(ul).empty();
                              for (var i = 0; i < d.data.length; i++) {
                                  var li = $('<li><a class="myimage-a" href="javascript:void(0)" tabindex="-1"><img src="' + d.data[i].img + '" style="-moz-background-size:100% 100%;background-size:100% 100%;width:100%;"></img></a></li>');
                                  $(ul).append(li);
                              }
                              $('.myimageDiv').find('a').each(function () {
                                  $(this).click(function () {
                                      $('.myimageDiv').find('a').removeClass('myimage-active');
                                      $(this).toggleClass('myimage-active');
                                      var defaultSize = { h: 150, w: 150 };
                                      $('.myimageDiv').next().children('input').val(defaultSize.w);
                                      $('.myimageDiv').next().next().children('input').val(defaultSize.h);
                                  });
                              });
                          }
                      },
                      error: function (xmlHttpRequest, error, exception) {
                      }
                  });

              },
              onShow: function () {

              }
          };
      }
);

function upload() {
    var formData = new FormData($('#form')[0]);
    $.ajax({
        url: 'http://localhost:8080/usersPage/upload?rd=' + Math.random(),
        type: 'POST',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function (d) {
            alert('');
        },
        error: function (xmlHttpRequest, error, exception) {
            alert('');
        }
    });
}