System.register([], function(exports_1) {
    "use strict";
    function user() {
        return window.user;
    }
    exports_1("user", user);
    function isLoggedIn() {
        return !!(window.user && window.user.id);
    }
    exports_1("isLoggedIn", isLoggedIn);
    return {
        setters:[],
        execute: function() {
        }
    }
});