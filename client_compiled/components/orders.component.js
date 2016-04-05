System.register(['angular2/core', 'angular2/router', './trip-card.component', './order-card.component', './goto-card.component', '../services/order/order.service', '../services/notification/notification.service', '../pipes/to-date.pipe'], function(exports_1, context_1) {
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
                    this.limit = 15;
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
                        templateUrl: '/client_src/tmpls/orders.html',
                        directives: [router_1.ROUTER_DIRECTIVES, trip_card_component_1.TripCardComponent, order_card_component_1.OrderCardComponent, goto_card_component_1.GotoComponent],
                        pipes: [to_date_pipe_1.ToDatePipe]
                    }),
                    __param(4, core_1.Inject('config.orderStatus')), 
                    __metadata('design:paramtypes', [order_service_1.OrderService, router_1.RouteParams, notification_service_1.NotificationService, core_1.ApplicationRef, Object])
                ], OrdersComponent);
                return OrdersComponent;
            }());
            exports_1("OrdersComponent", OrdersComponent);
        }
    }
});
