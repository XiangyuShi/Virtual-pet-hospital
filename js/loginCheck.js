$(document).ready(function () {
    var userCookie = $.cookie(constVar.userCookie) || '';
    if (userCookie == null || userCookie == '') {
        location.href = constVar.loginUrl;
    }
});