CKEDITOR.dialog.add(
    "myimage",
      function (b) {
          return {
              title: "图片上传与下载",
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
                      html: '<div>'+
								'<form action="localhost:8080/pic" method="POST">'+
									'<input type="file" id="file"><br>'+
									'name:<input type="text" id="name">'+
									'<input type="submit" value="Upload">'+
								'</form>'+
							'</div>'+
							'<div class="myimageDiv">'+
								'<ul>'+
									'<li>'+
										'<a class="myimage-a" href="javascript:void(0)" tabindex="-1">'+
											'<img src="http://ckeditor.com/apps/ckfinder/3.3.0/core/connector/php/connector.php?command=Thumbnail&lang=zh-cn&type=Images&currentFolder=%2F&hash=78200e8b45d3f1c2&fileName=catwalk.jpg&date=20160309074502&fileSize=323&size=150x150">'+
											'</img>'+
										'</a>'+
									'</li>'+
									'<li>'+
										'<a class="myimage-a" href="javascript:void(0)" tabindex="-1">'+
											'<img src="http://ckeditor.com/apps/ckfinder/3.3.0/core/connector/php/connector.php?command=Thumbnail&lang=zh-cn&type=Images&currentFolder=%2F&hash=78200e8b45d3f1c2&fileName=river.jpg&date=20160309074502&fileSize=344&size=150x150">'+
											'</img>'+
										'</a>'+
									'</li>'+
								'</ul>'+
							'</div>'//对话框中要显示的内容
                  }]
              }],
			  
              onOk: function () { //对话框点击确定的时候调用该函数
                  var imgs = $('.myimageDiv').find('a[class="myimage-a myimage-active"]');
                  for (var i = 0; i < imgs.length; i++) {
                      var img = b.document.createElement('img');
                      img.setAttribute('alt', '');
                      img.setAttribute('src', $(imgs[i]).children('img:eq(0)').attr('src'));
                      b.insertElement(img);
                  }
              },
              onLoad: function () { //对话框初始化时调用
                  $('.myimageDiv').find('a').each(function () {
                      $(this).click(function () {
                          $('.myimageDiv').find('a').removeClass('myimage-active');
                          $(this).toggleClass('myimage-active');
                      });
                  });
              },
              onShow: function () {

              }
          };
      }
);