System.register(['angular2/core', 'angular2/router', '../pipes/to-date.pipe', './user-card.component', './chat.component'], function(exports_1, context_1) {
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
    var core_1, router_1, to_date_pipe_1, user_card_component_1, chat_component_1;
    var MessagesComponent;
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
            function (user_card_component_1_1) {
                user_card_component_1 = user_card_component_1_1;
            },
            function (chat_component_1_1) {
                chat_component_1 = chat_component_1_1;
            }],
        execute: function() {
            MessagesComponent = (function () {
                function MessagesComponent(_routeParams, configUser) {
                    this._routeParams = _routeParams;
                    this.configUser = configUser;
                    this.isChatActual = false;
                    this.user = {};
                    this.error = '';
                    this._loaded = false;
                    this.corrId = this._routeParams.get('id');
                }
                MessagesComponent.prototype.onUser = function (user) {
                    this._loaded = true;
                    this.user = user;
                };
                MessagesComponent.prototype.onChatError = function (err) {
                    this._loaded = true;
                    this.error = 'Unexpected error. Try again later.';
                    try {
                        this.error = err.json().error || this.error;
                    }
                    catch (e) { }
                };
                MessagesComponent = __decorate([
                    core_1.Component({
                        selector: 'messages',
                        templateUrl: '/client_src/tmpls/messages.html',
                        pipes: [to_date_pipe_1.ToDatePipe],
                        directives: [router_1.ROUTER_DIRECTIVES, chat_component_1.ChatComponent, user_card_component_1.UserCardComponent]
                    }),
                    __param(1, core_1.Inject('config.user')), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof router_1.RouteParams !== 'undefined' && router_1.RouteParams) === 'function' && _a) || Object, Object])
                ], MessagesComponent);
                return MessagesComponent;
                var _a;
            }());
            exports_1("MessagesComponent", MessagesComponent);
        }
    }
});