CKEDITOR.dialog.add(
    "myvideo",
      function (b) {
          return {
              title: "视频",
              minWidth: 590,
              minHeight: 300,
              contents: [{
                  id: "myvideoTab",
                  label: "",
                  title: "",
                  expand: true,
                  padding: 0,
                  elements: [{
                      type: "html",
                      html: '<div style="clear:both;" class="myvideoDiv">\
                                <ul>\
                                </ul>\
                            </div>\
                            <div style="clear:both;padding:10px;"><label class="cke_dialog_ui_labeled_label">视频宽度:</label><input type="text" class="cke_dialog_ui_input_text" style="width:100px;" placeHolder="视频宽度" /></div>\
                            <div style="clear:both;padding:10px;"><label class="cke_dialog_ui_labeled_label">视频高度:</label><input type="text" class="cke_dialog_ui_input_text" style="width:100px;" placeHolder="视频高度" /></div>' //对话框中要显示的内容
                  }]
              }],
              onOk: function () { //对话框点击确定的时候调用该函数
                  var imgs = $('.myvideoDiv').find('a[class="myvideo-a myvideo-active"]');
                  for (var i = 0; i < imgs.length; i++) {
                      var videoSrc = $(imgs[i]).children('img:eq(0)').attr('video');
                      var img = b.document.createElement('img');
                      img.setAttribute('alt', '');
                      img.setAttribute('src', $(imgs[i]).children('img:eq(0)').attr('src'));
                      img.setAttribute('width', '1');
                      img.setAttribute('height', '1');
                      img.setAttribute('id', 'imgTempPet');
                      img.setAttribute('style', 'display:none;');
                      b.insertElement(img);
                      var w = $('.myvideoDiv').next().children('input').val();
                      var h = $('.myvideoDiv').next().next().children('input').val();
                      var video = $('<video width="' + w + '" height="' + h + '" controls><source src="' + videoSrc + '" type="video/mp4"></video>');
                      var tempImg = $(window.frames[0].document).find('#imgTempPet');
                      $(tempImg).after(video);
                      $(tempImg).remove();
                  }
              },
              onLoad: function () { //对话框初始化时调用
                  $.ajax({
                      url: constVar.baseUrl + 'API/Management/VideoNodes?rd=' + Math.random(),
                      type: 'get',
                      dataType: 'json',
                      contentType: 'application/json;charset=utf-8',
                      headers: {
                          "Authorization": "admin"
                      },
                      data: {},
                      success: function (d) {
                          if (d.meta.code == '200') {
                              var ul = $('.myvideoDiv').find('ul');
                              $(ul).empty();
                              for (var i = 0; i < d.data.length; i++) {
                                  var li = $('<li><a class="myvideo-a" href="javascript:void(0)" tabindex="-1"><img video="' + d.data[i].video + '" src="' + d.data[i].picture + '" style="-moz-background-size:100% 100%;background-size:100% 100%;width:100%;"></img></a></li>');
                                  $(ul).append(li);
                              }
                              $('.myvideoDiv').find('a').each(function () {
                                  $(this).click(function () {
                                      $('.myvideoDiv').find('a').removeClass('myvideo-active');
                                      $(this).toggleClass('myvideo-active');
                                      var defaultSize = { h: 150, w: 150 };
                                      $('.myvideoDiv').next().children('input').val(defaultSize.w);
                                      $('.myvideoDiv').next().next().children('input').val(defaultSize.h);
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
function playVideo(obj) {
    alert('');
}