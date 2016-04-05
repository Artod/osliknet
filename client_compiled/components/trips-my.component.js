System.register(['angular2/core', 'angular2/router', '../services/trip/trip.service', '../services/notification/notification.service', './trip-card.component', './order-card.component', './goto-card.component', '../pipes/to-date.pipe'], function(exports_1, context_1) {
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
    var core_1, router_1, trip_service_1, notification_service_1, trip_card_component_1, order_card_component_1, goto_card_component_1, to_date_pipe_1;
    var TripsMyComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (trip_service_1_1) {
                trip_service_1 = trip_service_1_1;
            },
            function (notification_service_1_1) {
                notification_service_1 = notification_service_1_1;
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
            function (to_date_pipe_1_1) {
                to_date_pipe_1 = to_date_pipe_1_1;
            }],
        execute: function() {
            TripsMyComponent = (function () {
                function TripsMyComponent(_tripService, _notificationService, _appRef, configOrderStatus) {
                    var _this = this;
                    this._tripService = _tripService;
                    this._notificationService = _notificationService;
                    this._appRef = _appRef;
                    this.configOrderStatus = configOrderStatus;
                    this.trips = [];
                    this.ordersByTrip = {};
                    this.newMessages = {};
                    this._inited = false;
                    this.page = 0;
                    this.limit = 10;
                    this.fullPage = false;
                    this._busy = false;
                    console.log('constructor');
                    this.loadNext();
                    this.newMessages = this._notificationService.data.newMessages || {};
                    this._notifSub = this._notificationService.start().subscribe(function (data) {
                        _this.newMessages = data.newMessages || {};
                        _this._appRef.tick();
                    });
                }
                TripsMyComponent.prototype.routerOnActivate = function () {
                    console.log('routerOnActivate');
                    return false;
                };
                TripsMyComponent.prototype.loadNext = function () {
                    var _this = this;
                    this._busy = true;
                    this._tripService.getMy(this.limit, this.page).subscribe(function (res) {
                        (res.trips || []).forEach(function (trip) {
                            _this.trips.push(trip);
                        });
                        (res.orders || []).forEach(function (order, i, arr) {
                            _this.ordersByTrip[order.trip] = _this.ordersByTrip[order.trip] || [];
                            _this.ordersByTrip[order.trip].push(order);
                        });
                        if ((res.trips || [])[_this.limit - 1]) {
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
                TripsMyComponent.prototype.ngOnDestroy = function () {
                    this._notifSub.unsubscribe();
                };
                TripsMyComponent = __decorate([
                    core_1.Component({
                        templateUrl: '/client_src/tmpls/trips-my.html',
                        directives: [router_1.ROUTER_DIRECTIVES, trip_card_component_1.TripCardComponent, order_card_component_1.OrderCardComponent, goto_card_component_1.GotoComponent],
                        pipes: [to_date_pipe_1.ToDatePipe]
                    }),
                    __param(3, core_1.Inject('config.orderStatus')), 
                    __metadata('design:paramtypes', [trip_service_1.TripService, notification_service_1.NotificationService, core_1.ApplicationRef, Object])
                ], TripsMyComponent);
                return TripsMyComponent;
            }());
            exports_1("TripsMyComponent", TripsMyComponent);
        }
    }
});
