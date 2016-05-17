System.register(['angular2/core', 'angular2/http', 'rxjs/Observable', 'rxjs/Subject'], function(exports_1, context_1) {
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
    var core_1, http_1, Observable_1, Subject_1;
    var NotificationService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (Subject_1_1) {
                Subject_1 = Subject_1_1;
            }],
        execute: function() {
            NotificationService = (function () {
                function NotificationService(http) {
                    this.http = http;
                    this.data = {};
                    this.updated = 0;
                    this._defaultTimeout = 10000;
                    this._headers = new http_1.Headers();
                    this._headers.append('X-Requested-With', 'XMLHttpRequest');
                    this.subject = new Subject_1.Subject();
                }
                NotificationService.prototype.changeTimeout = function (timeout) {
                    this.start(timeout);
                };
                NotificationService.prototype.start = function (timeout) {
                    var _this = this;
                    timeout = timeout || this._defaultTimeout;
                    if (timeout === this.currentTimeout && this._pollSub && !this._pollSub.isUnsubscribed) {
                        return this.subject;
                    }
                    this.currentTimeout = timeout;
                    this.stop();
                    this._pollSub = Observable_1.Observable.timer(0, this.currentTimeout).switchMap(function () {
                        return _this.http.get('/users/notifications/' + _this.updated, {
                            headers: _this._headers
                        });
                    }).map(function (res) { return res.json(); }).subscribe(function (res) {
                        var serverUpdated = new Date(res.updated_at).getTime();
                        if (serverUpdated !== _this.updated) {
                            console.log('New notification!');
                            _this.updated = serverUpdated;
                            _this.data = res || {};
                            _this.subject.next(_this.data);
                        }
                    }, function (err) { });
                    return this.subject;
                };
                NotificationService.prototype.stop = function () {
                    if (this._pollSub && !this._pollSub.isUnsubscribed) {
                        this._pollSub.unsubscribe();
                    }
                };
                NotificationService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], NotificationService);
                return NotificationService;
            }());
            exports_1("NotificationService", NotificationService);
        }
    }
});
