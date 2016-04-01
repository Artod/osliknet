System.register(['./components/app', 'angular2/platform/browser', 'angular2/router', 'angular2/core', 'angular2/http', 'rxjs/Rx', './services/maps-api-loader/lazy-maps-api-loader'], function(exports_1) {
    "use strict";
    var app_1, browser_1, router_1, core_1, http_1, lazy_maps_api_loader_1;
    return {
        setters:[
            function (app_1_1) {
                app_1 = app_1_1;
            },
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (_1) {},
            function (lazy_maps_api_loader_1_1) {
                lazy_maps_api_loader_1 = lazy_maps_api_loader_1_1;
            }],
        execute: function() {
            core_1.enableProdMode();
            browser_1.bootstrap(app_1.AppComponent, [
                router_1.ROUTER_PROVIDERS,
                core_1.provide(router_1.APP_BASE_HREF, { useValue: '/' }),
                http_1.Http,
                core_1.provide(lazy_maps_api_loader_1.LazyMapsAPILoaderConfig, { useFactory: function () {
                        return window.googleMaps;
                    } }),
                core_1.provide('config.user', { useFactory: function () {
                        return window.user;
                    } }),
                core_1.provide('config.captcha', { useFactory: function () {
                        return window.googleRecaptcha;
                    } }),
                core_1.provide('config.orderStatus', { useFactory: function () {
                        return window.orderStatus;
                    } }),
                core_1.provide('config.orderStatusConst', { useFactory: function () {
                        return window.orderStatusConst;
                    } }),
                core_1.provide('config.invoiceStatus', { useFactory: function () {
                        return window.invoiceStatus;
                    } }),
                core_1.provide('config.invoiceStatusConst', { useFactory: function () {
                        return window.invoiceStatusConst;
                    } }),
                core_1.provide('config.fees', { useFactory: function () {
                        return window.fees;
                    } }),
                lazy_maps_api_loader_1.LazyMapsAPILoader
            ]);
        }
    }
});