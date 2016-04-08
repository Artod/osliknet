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
    var TripService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            TripService = (function () {
                function TripService(http) {
                    this.http = http;
                }
                TripService.prototype.search = function (data, limit, lastId) {
                    var headers = new http_1.Headers();
                    headers.append('X-Requested-With', 'XMLHttpRequest');
                    var search = new http_1.URLSearchParams();
                    if (data.from_id)
                        search.set('from_id', data.from_id);
                    if (data.to_id)
                        search.set('to_id', data.to_id);
                    if (limit)
                        search.set('limit', limit);
                    if (lastId)
                        search.set('lastId', lastId);
                    return this.http.get('/trips', {
                        headers: headers,
                        search: search
                    }).map(function (res) { return res.json(); });
                };
                TripService.prototype.getMy = function (limit, page) {
                    var headers = new http_1.Headers();
                    headers.append('X-Requested-With', 'XMLHttpRequest');
                    var search = new http_1.URLSearchParams();
                    if (limit)
                        search.set('limit', limit);
                    if (page)
                        search.set('page', page);
                    return this.http.get('/trips/my', {
                        headers: headers,
                        search: search
                    }).map(function (res) { return res.json(); });
                };
                TripService.prototype.getById = function (id) {
                    var headers = new http_1.Headers();
                    headers.append('X-Requested-With', 'XMLHttpRequest');
                    return this.http.get('/trips/' + id, {
                        headers: headers
                    }).map(function (res) { return res.json(); });
                };
                TripService.prototype.addTrips = function (data) {
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    headers.append('X-Requested-With', 'XMLHttpRequest');
                    return this.http.post('/trips/add', JSON.stringify(data), {
                        headers: headers
                    }).map(function (res) { return res.json(); });
                };
                TripService.prototype.update = function (data) {
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    headers.append('X-Requested-With', 'XMLHttpRequest');
                    return this.http.post('/trips/update', JSON.stringify(data), {
                        headers: headers
                    }).map(function (res) { return res.json(); });
                };
                TripService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
                ], TripService);
                return TripService;
                var _a;
            }());
            exports_1("TripService", TripService);
        }
    }
});