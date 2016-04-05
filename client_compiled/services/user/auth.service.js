System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
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
