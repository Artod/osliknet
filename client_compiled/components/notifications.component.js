System.register(['angular2/core', 'angular2/router', '../pipes/to-date.pipe', '../services/notification/notification.service'], function(exports_1, context_1) {
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
    var core_1, router_1, to_date_pipe_1, notification_service_1;
    var NotificationsComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (to_date_pipe_1_1) {
                to_date_pipe_1 = to_date_pipe_1_1;
            },
            function (notification_service_1_1) {
                notification_service_1 = notification_service_1_1;
            }],
        execute: function() {
            NotificationsComponent = (function () {
                function NotificationsComponent(_notificationService, _appRef) {
                    var _this = this;
                    this._notificationService = _notificationService;
                    this._appRef = _appRef;
                    this.newOrders = [];
                    this.newTrips = [];
                    this.newMessagesKeys = [];
                    this.newPrivMessagesKeys = [];
                    this.isOpened = false;
                    this._notificationService.start().subscribe(function (data) {
                        console.log('NotificationsComponent subscribe');
                        console.dir(data);
                        _this.newOrders = data.newOrders;
                        _this.newTrips = data.newTrips;
                        _this.newMessages = data.newMessages;
                        _this.newMessagesKeys = _this.getKeys(data.newMessages);
                        _this.newPrivMessages = data.newPrivMessages;
                        _this.newPrivMessagesKeys = _this.getKeys(data.newPrivMessages);
                        console.log('this.newPrivMessagesKeys', _this.newPrivMessagesKeys);
                        _this._appRef.tick();
                    }, function (err) { });
                }
                NotificationsComponent.prototype.onClick = function ($event) {
                    this.isOpened = !this.isOpened;
                    $event.stopPropagation();
                    return false;
                };
                NotificationsComponent.prototype.onDocumentClick = function ($event) {
                    this.isOpened = false;
                };
                NotificationsComponent.prototype.getKeys = function (obj) {
                    if (!obj) {
                        return [];
                    }
                    return Object.keys(obj).filter(function (key) {
                        return obj[key][0];
                    });
                };
                NotificationsComponent = __decorate([
                    core_1.Component({
                        selector: '[notifications]',
                        templateUrl: '/client_src/tmpls/notifications.html',
                        directives: [router_1.ROUTER_DIRECTIVES],
                        pipes: [to_date_pipe_1.ToDatePipe]
                    }), 
                    __metadata('design:paramtypes', [notification_service_1.NotificationService, core_1.ApplicationRef])
                ], NotificationsComponent);
                return NotificationsComponent;
            }());
            exports_1("NotificationsComponent", NotificationsComponent);
        }
    }
});
