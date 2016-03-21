System.register(['angular2/core', 'angular2/http'], function(exports_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1;
    var SubscribeService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            SubscribeService = (function () {
                function SubscribeService(http) {
                    this.http = http;
                }
                SubscribeService.prototype.add = function (data) {
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    headers.append('X-Requested-With', 'XMLHttpRequest');
                    return this.http.post('/subscribes/add', JSON.stringify(data), {
                        headers: headers
                    }).map(function (res) { return res.json(); });
                };
                SubscribeService.prototype.cancel = function (id) {
                    var headers = new http_1.Headers();
                    headers.append('X-Requested-With', 'XMLHttpRequest');
                    return this.http.get('/subscribes/cancel/' + id, {
                        headers: headers
                    }).map(function (res) { return res.json(); });
                };
                SubscribeService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
                ], SubscribeService);
                return SubscribeService;
                var _a;
            }());
            exports_1("SubscribeService", SubscribeService);
        }
    }
});