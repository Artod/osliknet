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
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var core_1, router_1, user_card_component_1, to_date_pipe_1;
    var OrderCardComponent;
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
            OrderCardComponent = (function () {
                function OrderCardComponent(configOrderStatus) {
                    this.configOrderStatus = configOrderStatus;
                }
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], OrderCardComponent.prototype, "order", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], OrderCardComponent.prototype, "user", void 0);
                OrderCardComponent = __decorate([
                    core_1.Component({
                        selector: 'order-card',
                        template: "\n   <div class=\"order-card\">\n   \t<user-card [user]=\"user\" *ngIf=\"user && user._id\"></user-card>\n\n   \t<p class=\"order-info\">\n   \t\t<span class=\"text-muted\">{{ order.created_at | toDate | date: 'longDate' }} | \n   \t\tOrder status: <b>{{ configOrderStatus[order.status] }}</b></span>\n   \t</p>\n   </div>\n\t",
                        directives: [router_1.ROUTER_DIRECTIVES, user_card_component_1.UserCardComponent],
                        pipes: [to_date_pipe_1.ToDatePipe]
                    }),
                    __param(0, core_1.Inject('config.orderStatus')), 
                    __metadata('design:paramtypes', [Object])
                ], OrderCardComponent);
                return OrderCardComponent;
            })();
            exports_1("OrderCardComponent", OrderCardComponent);
        }
    }
});