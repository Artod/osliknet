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
    var ReviewService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            ReviewService = (function () {
                function ReviewService(http) {
                    this.http = http;
                }
                ReviewService.prototype.add = function (data) {
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    headers.append('X-Requested-With', 'XMLHttpRequest');
                    return this.http.post('/reviews/add', JSON.stringify(data), {
                        headers: headers
                    }).map(function (res) { return res.json(); });
                };
                ReviewService.prototype.getByOrderId = function (id) {
                    var headers = new http_1.Headers();
                    headers.append('X-Requested-With', 'XMLHttpRequest');
                    return this.http.get('/reviews/order/' + id, {
                        headers: headers
                    }).map(function (res) { return res.json(); });
                };
                ReviewService.prototype.get = function (limit, page) {
                    var headers = new http_1.Headers();
                    headers.append('X-Requested-With', 'XMLHttpRequest');
                    var search = new http_1.URLSearchParams();
                    if (limit)
                        search.set('limit', limit);
                    if (page)
                        search.set('page', page);
                    return this.http.get('/reviews', {
                        search: search,
                        headers: headers
                    }).map(function (res) { return res.json(); });
                };
                ReviewService.prototype.calculateRating = function (rawRate) {
                    var total = (rawRate || []).reduce(function (res, count, rate) {
                        count = Number(count);
                        if (!count) {
                            return res;
                        }
                        return [res[0] + count, res[1] + (count * (rate + 1))];
                    }, [0, 0]);
                    return [total[0], total[0] ? (total[1] / total[0]).toFixed(1) : 0];
                };
                ReviewService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
                ], ReviewService);
                return ReviewService;
                var _a;
            }());
            exports_1("ReviewService", ReviewService);
        }
    }
});