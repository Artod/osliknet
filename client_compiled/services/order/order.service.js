System.register(['angular2/core', 'angular2/http'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
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
    var OrderService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            OrderService = (function () {
                function OrderService(http) {
                    this.http = http;
                }
                OrderService.prototype.get = function (limit, page) {
                    var headers = new http_1.Headers();
                    headers.append('X-Requested-With', 'XMLHttpRequest');
                    var search = new http_1.URLSearchParams();
                    if (limit)
                        search.set('limit', limit);
                    if (page)
                        search.set('page', page);
                    return this.http.get('/orders', {
                        headers: headers,
                        search: search
                    }).map(function (res) { return res.json(); });
                };
                OrderService.prototype.getByTripId = function (tripId) {
                    var headers = new http_1.Headers();
                    headers.append('X-Requested-With', 'XMLHttpRequest');
                    return this.http.get('/orders/trip/' + tripId, {
                        headers: headers
                    }).map(function (res) { return res.json(); });
                };
                OrderService.prototype.add = function (data) {
                    var headers = new http_1.Headers();
                    headers.append('X-Requested-With', 'XMLHttpRequest');
                    headers.append('Content-Type', 'application/json');
                    return this.http.post('/orders/add', JSON.stringify(data), {
                        headers: headers
                    }).map(function (res) { return res.json(); });
                };
                OrderService.prototype.changeStatus = function (status, order) {
                    var headers = new http_1.Headers();
                    headers.append('X-Requested-With', 'XMLHttpRequest');
                    headers.append('Content-Type', 'application/json');
                    var data = {
                        status: status,
                        order: order
                    };
                    return this.http.post('/orders/status', JSON.stringify(data), {
                        headers: headers
                    }).map(function (res) { return res.json(); });
                };
                OrderService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], OrderService);
                return OrderService;
            }());
            exports_1("OrderService", OrderService);
        }
    }
});
