System.register(['angular2/core', 'angular2/router', '../services/trip/trip.service', '../services/notification/notification.service', './trip-card.component', './order-card.component', './goto-card.component', '../pipes/to-date.pipe'], function(exports_1) {
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
                    this.limit = 5;
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
                        template: "\n   <div class=\"container\">\n   \t<div class=\"page-header\">\n   \t\t<h2>My Trips</h2>\n   \t</div>\n\n   \t<p *ngIf=\"!_inited\">Loading...</p>\n\n   \t<p *ngIf=\"_inited && trips && !trips.length\">\n   \t\t<i>There are no trips yet. You can <a [routerLink]=\"['TripAdd']\">Add a trip</a>.</i>\n   \t</p>\n\t\n   <!--(configUser && configUser.id) &&  \t<p *ngIf=\"_inited && !(configUser && configUser.id)\">\n   \t\tYou are not authorized. <a [routerLink]=\"['Join']\">Create An Account</a> or <a [routerLink]=\"['Login']\">Log in</a> to an existing.\n   \t</p> -->\n\n   \t<div class=\"row trips-my\" *ngFor=\"#trip of trips\">\n   \t\t<div class=\"col-lg-4 col-xs-12\">\n   \t\t\t<trip-card [trip]=\"trip\"></trip-card>\n\n   \t\t\t<p>\n   \t\t\t\t{{ trip.description }}\n   \t\t\t</p>\n   \t\t</div>\n   \t\t<div class=\"col-lg-8 col-xs-12\">\n\t\t\t\n\n   \t\t\t<div class=\"requests-table\">\n   \t\t\t\t<h5>Requests for shipping:</h5>\n\t\t\t\t\n   \t\t\t\t<table *ngIf=\"!ordersByTrip[trip._id]\" class=\"table\">\n   \t\t\t\t\t<tr>\n   \t\t\t\t\t\t<td>\n   \t\t\t\t\t\t\t<i>There are no requests yet.</i>\n   \t\t\t\t\t\t</td>\n   \t\t\t\t\t</tr>\n   \t\t\t\t</table>\n\t\t\t\t\n   \t\t\t\t<table *ngIf=\"ordersByTrip[trip._id]\" class=\"table\">\n   \t\t\t\t\t<tr *ngFor=\"#order of ordersByTrip[trip._id]\">\n   \t\t\t\t\t\t<td>\n   \t\t\t\t\t\t\t<order-card [order]=\"order\" [user]=\"order.user\"></order-card>\n\t\t\t\t\t\t\t\n   \t\t\t\t\t\t\t<p class=\"order-message\">\n   \t\t\t\t\t\t\t\t{{ order.message }}\n   \t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\n   \t\t\t\t\t\t\t<goto [order]=\"order\" [newMessages]=\"newMessages\"></goto>\n   \t\t\t\t\t\t\t<!--\n   \t\t\t\t\t\t\t <p class=\"text-right\">\n   \t\t\t\t\t\t\t\t<span *ngIf=\"newMessages[order._id] && newMessages[order._id][0]\" class=\"label label-danger\">{{newMessages[order._id][0]}} new</span>\n   \t\t\t\t\t\t\t\t<a [routerLink]=\"['Order', {id:order._id}]\">Go to negotiation <span *ngIf=\"order.msg_cnt\">({{ order.msg_cnt }})</span>  <span class=\"badge\" *ngIf=\"newMessages[order._id] && newMessages[order._id][0]\">{{newMessages[order._id][0]}}</span> </a>\n   \t\t\t\t\t\t\t</p> -->\n   \t\t\t\t\t\t</td>\n   \t\t\t\t\t</tr>\n   \t\t\t\t</table>\n   \t\t\t</div>\n   \t\t</div>\n   \t</div>\n\n   \t<p *ngIf=\"_inited && !fullPage\" class=\"text-center\">\n   \t\t<button class=\"btn btn-default btn-lg\" (click)=\"_busy ? false : loadNext()\">{{ _busy ? 'Wait...' : 'Load more' }}</button>\n   \t</p>\n   </div>\n\t",
                        directives: [router_1.ROUTER_DIRECTIVES, trip_card_component_1.TripCardComponent, order_card_component_1.OrderCardComponent, goto_card_component_1.GotoComponent],
                        pipes: [to_date_pipe_1.ToDatePipe]
                    }),
                    __param(3, core_1.Inject('config.orderStatus')), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof trip_service_1.TripService !== 'undefined' && trip_service_1.TripService) === 'function' && _a) || Object, (typeof (_b = typeof notification_service_1.NotificationService !== 'undefined' && notification_service_1.NotificationService) === 'function' && _b) || Object, (typeof (_c = typeof core_1.ApplicationRef !== 'undefined' && core_1.ApplicationRef) === 'function' && _c) || Object, Object])
                ], TripsMyComponent);
                return TripsMyComponent;
                var _a, _b, _c;
            })();
            exports_1("TripsMyComponent", TripsMyComponent);
        }
    }
});