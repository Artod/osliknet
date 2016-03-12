System.register(['angular2/core', 'angular2/router', './trip-card.component', './order-card.component', './goto-card.component', '../services/order/order.service', '../services/notification/notification.service', '../pipes/to-date.pipe'], function(exports_1) {
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
    var core_1, router_1, trip_card_component_1, order_card_component_1, goto_card_component_1, order_service_1, notification_service_1, to_date_pipe_1;
    var OrdersComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (trip_card_component_1_1) {
                trip_card_component_1 = trip_card_component_1_1;
            },
            function (order_card_component_1_1) {
                order_card_component_1 = order_card_component_1_1;
            },
            function (goto_card_component_1_1) {
                goto_card_component_1 = goto_card_component_1_1;
            },
            function (order_service_1_1) {
                order_service_1 = order_service_1_1;
            },
            function (notification_service_1_1) {
                notification_service_1 = notification_service_1_1;
            },
            function (to_date_pipe_1_1) {
                to_date_pipe_1 = to_date_pipe_1_1;
            }],
        execute: function() {
            OrdersComponent = (function () {
                function OrdersComponent(_orderService, _routeParams, _notificationService, _appRef, configOrderStatus) {
                    var _this = this;
                    this._orderService = _orderService;
                    this._routeParams = _routeParams;
                    this._notificationService = _notificationService;
                    this._appRef = _appRef;
                    this.configOrderStatus = configOrderStatus;
                    this.orders = [];
                    this.newMessages = {};
                    this._inited = false;
                    this.page = 0;
                    this.limit = 5;
                    this.fullPage = false;
                    this._busy = false;
                    this.loadNext();
                    this.newMessages = this._notificationService.data.newMessages || {};
                    this._notifSub = this._notificationService.start().subscribe(function (data) {
                        _this.newMessages = data.newMessages || {};
                        _this._appRef.tick();
                    });
                }
                OrdersComponent.prototype.loadNext = function () {
                    var _this = this;
                    this._busy = true;
                    this._orderService.get(this.limit, this.page).subscribe(function (data) {
                        (data.orders || []).forEach(function (order) {
                            _this.orders.push(order);
                        });
                        if ((data.orders || [])[_this.limit - 1]) {
                            _this.page++;
                        }
                        else {
                            _this.fullPage = true;
                        }
                        _this._busy = false;
                        _this._inited = true;
                    }, function (error) {
                        _this.fullPage = true;
                        _this._busy = false;
                        _this._inited = true;
                    });
                };
                OrdersComponent.prototype.ngOnDestroy = function () {
                    this._notifSub.unsubscribe();
                };
                OrdersComponent = __decorate([
                    core_1.Component({
                        template: "\n   <div class=\"container\">\n   \t<div class=\"page-header\">\n   \t\t<h2>Requests</h2>\n   \t</div>\n\n   \t<p *ngIf=\"!_inited\">Loading...</p>\n\n   \t<p *ngIf=\"_inited && orders && !orders.length\"><i>There are no requests yet.</i></p>\n\n   \t<table class=\"table\">\n   \t\t<tr *ngFor=\"#order of orders; #idx = index\">\n   \t\t\t<td class=\"col-xs-8\">\n   \t\t\t\t<order-card [order]=\"order\" [user]=\"order.user\"></order-card>\n\t\t\t\t\n   \t\t\t\t<p class=\"order-message\">\n   \t\t\t\t\t{{ order.message }}\n   \t\t\t\t</p>\n\t\t\t\t\n   \t\t\t\t<goto [order]=\"order\" [newMessages]=\"newMessages\"></goto>\n   \t\t\t</td>\n   \t\t\t<td class=\"col-xs-4\">\n   \t\t\t\t<trip-card [trip]=\"order.trip\" [user]=\"order.trip.user\"></trip-card>\t\t\t\t\n   \t\t\t</td>\n   \t\t</tr>\n   \t</table>\n\n   \t<p *ngIf=\"_inited && !fullPage\" class=\"text-center\">\n   \t\t<button class=\"btn btn-default btn-lg\" (click)=\"_busy ? false : loadNext()\">{{ _busy ? 'Wait...' : 'Load more' }}</button>\n   \t</p>\n   </div>\n\t",
                        directives: [router_1.ROUTER_DIRECTIVES, trip_card_component_1.TripCardComponent, order_card_component_1.OrderCardComponent, goto_card_component_1.GotoComponent],
                        pipes: [to_date_pipe_1.ToDatePipe]
                    }),
                    __param(4, core_1.Inject('config.orderStatus')), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof order_service_1.OrderService !== 'undefined' && order_service_1.OrderService) === 'function' && _a) || Object, (typeof (_b = typeof router_1.RouteParams !== 'undefined' && router_1.RouteParams) === 'function' && _b) || Object, (typeof (_c = typeof notification_service_1.NotificationService !== 'undefined' && notification_service_1.NotificationService) === 'function' && _c) || Object, (typeof (_d = typeof core_1.ApplicationRef !== 'undefined' && core_1.ApplicationRef) === 'function' && _d) || Object, Object])
                ], OrdersComponent);
                return OrdersComponent;
                var _a, _b, _c, _d;
            })();
            exports_1("OrdersComponent", OrdersComponent);
        }
    }
});