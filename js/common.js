var constVar = {
    //baseUrl: 'http://localhost:8081/',
    //baseUrl: 'http://139.196.200.37/testenv/',
    baseUrl: 'http://139.196.200.37/testenv/',
    baseUrl2: 'http://139.196.200.37:8080/PetHospitalTraining-test/',
    userCookie: 'pht-user-cookie',
    loginUrl: 'http://localhost:8080/front/pages/login.html'
};
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
    var context = "";
    if (r != null)
        context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
}