System.register(['angular2/core', 'angular2/router', '../pipes/to-date.pipe', './user-card.component', './chat.component'], function(exports_1) {
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
                    this.corrId = this._routeParams.get('id');
                }
                MessagesComponent = __decorate([
                    core_1.Component({
                        selector: 'messages',
                        template: "\n   <div class=\"container\">\n   \t<div class=\"page-header\">\n   \t\t<h2>\n   \t\t\tDialog with \n   \t\t\t<user-card [user]=\"user\" *ngIf=\"user && user._id\"></user-card>\n   \t\t</h2>\t\t\n   \t</div>\n\n\n\n   \t<chat (user)=\"user = $event\" [(isChatActual)]=\"isChatActual\" [corrId]=\"corrId\"></chat>\n   </div>\n\t",
                        pipes: [to_date_pipe_1.ToDatePipe],
                        directives: [router_1.ROUTER_DIRECTIVES, chat_component_1.ChatComponent, user_card_component_1.UserCardComponent]
                    }),
                    __param(1, core_1.Inject('config.user')), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof router_1.RouteParams !== 'undefined' && router_1.RouteParams) === 'function' && _a) || Object, Object])
                ], MessagesComponent);
                return MessagesComponent;
                var _a;
            })();
            exports_1("MessagesComponent", MessagesComponent);
        }
    }
});