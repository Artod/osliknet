System.register(['angular2/core', 'angular2/router', '../pipes/to-date.pipe'], function(exports_1) {
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
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var core_1, router_1, to_date_pipe_1;
    var UserCardComponent;
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
            }],
        execute: function() {
            UserCardComponent = (function () {
                function UserCardComponent(configUser) {
                    this.configUser = configUser;
                }
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], UserCardComponent.prototype, "user", void 0);
                UserCardComponent = __decorate([
                    core_1.Component({
                        selector: 'user-card',
                        templateUrl: '/client_src/tmpls/user-card.html',
                        directives: [router_1.ROUTER_DIRECTIVES],
                        pipes: [to_date_pipe_1.ToDatePipe]
                    }),
                    __param(0, core_1.Inject('config.user')), 
                    __metadata('design:paramtypes', [Object])
                ], UserCardComponent);
                return UserCardComponent;
            }());
            exports_1("UserCardComponent", UserCardComponent);
        }
    }
});
