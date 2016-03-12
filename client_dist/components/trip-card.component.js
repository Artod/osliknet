System.register(['angular2/core', 'angular2/router', './user-card.component', '../pipes/to-date.pipe'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, router_1, user_card_component_1, to_date_pipe_1;
    var TripCardComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (user_card_component_1_1) {
                user_card_component_1 = user_card_component_1_1;
            },
            function (to_date_pipe_1_1) {
                to_date_pipe_1 = to_date_pipe_1_1;
            }],
        execute: function() {
            TripCardComponent = (function () {
                function TripCardComponent() {
                }
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], TripCardComponent.prototype, "trip", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], TripCardComponent.prototype, "user", void 0);
                TripCardComponent = __decorate([
                    core_1.Component({
                        selector: 'trip-card',
                        template: "\n   <div class=\"trip-card\">\n   \t<p class=\"trip-from-to\">\n   \t\t<a href=\"#\" [routerLink]=\"['Trip', {id: trip._id}]\">\n   \t\t\t{{ trip.from }}\n   \t\t\t<span class=\"glyphicon glyphicon-arrow-right\"></span>\n   \t\t\t{{ trip.to }}\n   \t\t</a>\n   \t</p>\n\n   \t<p>\n   \t\t<span class=\"text-muted small1\">{{ trip.when | toDate | date: 'longDate' }}</span>\n   \t</p>\n\n   \t<user-card [user]=\"user\" *ngIf=\"user && user._id\"></user-card>\n   </div>\n\t",
                        directives: [router_1.ROUTER_DIRECTIVES, user_card_component_1.UserCardComponent],
                        pipes: [to_date_pipe_1.ToDatePipe]
                    }), 
                    __metadata('design:paramtypes', [])
                ], TripCardComponent);
                return TripCardComponent;
            })();
            exports_1("TripCardComponent", TripCardComponent);
        }
    }
});