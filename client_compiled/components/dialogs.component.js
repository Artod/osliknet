System.register(['angular2/core', 'angular2/router', '../services/message/message.service', '../services/notification/notification.service', './user-card.component', '../pipes/to-date.pipe'], function(exports_1, context_1) {
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
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var core_1, router_1, message_service_1, notification_service_1, user_card_component_1, to_date_pipe_1;
    var DialogsComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (message_service_1_1) {
                message_service_1 = message_service_1_1;
            },
            function (notification_service_1_1) {
                notification_service_1 = notification_service_1_1;
            },
            function (user_card_component_1_1) {
                user_card_component_1 = user_card_component_1_1;
            },
            function (to_date_pipe_1_1) {
                to_date_pipe_1 = to_date_pipe_1_1;
            }],
        execute: function() {
            DialogsComponent = (function () {
                function DialogsComponent(_messageService, _notificationService, _appRef, configUser) {
                    var _this = this;
                    this._messageService = _messageService;
                    this._notificationService = _notificationService;
                    this._appRef = _appRef;
                    this.configUser = configUser;
                    this._messageService.getDialogs().subscribe(function (res) {
                        _this.users = res.users;
                    }, function (error) {
                    });
                    this.newPrivMessages = this._notificationService.data.newPrivMessages || {};
                    this._notifSub = this._notificationService.start().subscribe(function (data) {
                        _this.newPrivMessages = data.newPrivMessages || {};
                        _this._appRef.tick();
                    });
                }
                DialogsComponent.prototype.ngOnDestroy = function () {
                    this._notifSub.unsubscribe();
                };
                DialogsComponent = __decorate([
                    core_1.Component({
                        templateUrl: '/client_src/tmpls/dialogs.html',
                        directives: [router_1.ROUTER_DIRECTIVES, user_card_component_1.UserCardComponent],
                        pipes: [to_date_pipe_1.ToDatePipe]
                    }),
                    __param(3, core_1.Inject('config.user')), 
                    __metadata('design:paramtypes', [message_service_1.MessageService, notification_service_1.NotificationService, core_1.ApplicationRef, Object])
                ], DialogsComponent);
                return DialogsComponent;
            }());
            exports_1("DialogsComponent", DialogsComponent);
        }
    }
});
