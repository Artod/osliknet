System.register(['angular2/core', 'angular2/common', 'angular2/router', '../services/trip/trip.service', '../services/order/order.service', '../services/subscribe/subscribe.service', '../services/modal/modal.service', '../services/notification/notification.service', './trip-card.component', './order-card.component', './goto-card.component', './order-add.component', '../pipes/to-date.pipe'], function(exports_1) {
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
    var core_1, common_1, router_1, trip_service_1, order_service_1, subscribe_service_1, modal_service_1, notification_service_1, trip_card_component_1, order_card_component_1, goto_card_component_1, order_add_component_1, to_date_pipe_1;
    var TripComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (trip_service_1_1) {
                trip_service_1 = trip_service_1_1;
            },
            function (order_service_1_1) {
                order_service_1 = order_service_1_1;
            },
            function (subscribe_service_1_1) {
                subscribe_service_1 = subscribe_service_1_1;
            },
            function (modal_service_1_1) {
                modal_service_1 = modal_service_1_1;
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
            function (order_add_component_1_1) {
                order_add_component_1 = order_add_component_1_1;
            },
            function (to_date_pipe_1_1) {
                to_date_pipe_1 = to_date_pipe_1_1;
            }],
        execute: function() {
            TripComponent = (function () {
                function TripComponent(_router, _location, _modalService, _notificationService, _orderService, _tripService, _subscribeService, _routeParams, _fb, _appRef, configUser) {
                    var _this = this;
                    this._router = _router;
                    this._location = _location;
                    this._modalService = _modalService;
                    this._notificationService = _notificationService;
                    this._orderService = _orderService;
                    this._tripService = _tripService;
                    this._subscribeService = _subscribeService;
                    this._routeParams = _routeParams;
                    this._fb = _fb;
                    this._appRef = _appRef;
                    this.configUser = configUser;
                    this.tripId = '';
                    this.trip = {};
                    this.subscribe = {};
                    this.orders = [];
                    this.model = {};
                    this.newMessages = {};
                    this._inited = false;
                    this._busy = false;
                    this.editMode = false;
                    this.tripId = this._routeParams.get('id');
                    this.form = this._fb.group({
                        id: ['', common_1.Validators.required],
                        description: ['', common_1.Validators.required]
                    });
                    this.model.id = this.tripId;
                    this._tripService.getById(this.tripId).subscribe(function (res) {
                        _this.trip = res.trip || {};
                        _this.orders = res.orders || [];
                        _this.subscribe = res.subscribe || {};
                        _this.trip && (_this.model.description = (_this.trip.description || ''));
                        _this._inited = true;
                    }, function (error) {
                        _this._inited = true;
                    });
                    this.newMessages = this._notificationService.data.newMessages || {};
                    this._notifSub = this._notificationService.start().subscribe(function (data) {
                        _this.newMessages = data.newMessages || {};
                        _this._appRef.tick();
                    });
                }
                TripComponent.prototype.ngOnDestroy = function () {
                    this._notifSub.unsubscribe();
                };
                TripComponent.prototype.onSubmit = function ($textarea) {
                    var _this = this;
                    if (!this.form.controls.description.valid) {
                        $textarea.focus();
                        return;
                    }
                    if (this.form.valid && !this._busy) {
                        this._busy = true;
                        this._tripService.update(this.model).subscribe(function (data) {
                            if (data.trip) {
                                _this.trip.description = data.trip.description;
                            }
                            _this._busy = false;
                            _this.editMode = false;
                        }, function (err) {
                            _this._busy = false;
                            _this.editMode = false;
                        });
                    }
                };
                TripComponent.prototype.onRequest = function (trip) {
                    var _this = this;
                    this._modalService.open().then(function (modalComponentRef) {
                        var otherResolved = core_1.Injector.resolve([
                            core_1.provide(order_service_1.OrderService, { useValue: _this._orderService }),
                            core_1.provide(router_1.Router, { useValue: _this._router }),
                            core_1.provide(router_1.Location, { useValue: _this._location }),
                            core_1.provide('trip', { useValue: trip })
                        ]);
                        _this._modalService.bind(order_add_component_1.OrderAddComponent, modalComponentRef, otherResolved);
                    });
                };
                TripComponent.prototype.unsubscribe = function ($link) {
                    this._subscribeService.cancel(this.subscribe._id).subscribe(function (data) {
                        $link.innerHTML = '<i>You have successfully unsubscribed!</i>';
                    }, function (err) {
                        $link.innerHTML = '<i>Something went wrong. Try again later.</i>';
                    });
                    return false;
                };
                TripComponent = __decorate([
                    core_1.Component({
                        template: "\n   <div class=\"container\">\n   \t<div class=\"page-header\">\n   \t\t<h2>Trip</h2>\n   \t</div>\n\n   \t<p *ngIf=\"!_inited\">Loading...</p>\n\n   \t<div *ngIf=\"trip && trip.user\">\n   \t\t<p *ngIf=\"subscribe && subscribe._id\" class=\"text-right\" #link>\n   \t\t\t<a href=\"#\" (click)=\"unsubscribe(link)\">Unsubscribe from notifications about new trips in the direction.</a>\n   \t\t</p>\n\t\t\n   \t\t<trip-card [trip]=\"trip\" [user]=\"trip.user\"></trip-card>\n\n   \t\t<br />\n\n   \t\t<p *ngIf=\"!editMode\" class=\"pre-wrap\">{{ trip.description }}</p>\n\t\t\n   \t\t<form *ngIf=\"editMode\" action=\"/trips/edit\" method=\"post\" [ngFormModel]=\"form\" (submit)=\"_busy ? false : onSubmit(textarea)\">\n\t\t\n   \t\t\t<input type=\"hidden\" name=\"id\" [(ngModel)]=\"model.id\" [ngFormControl]=\"form.controls.id\" />\n\t\t\t\n   \t\t\t<div class=\"form-group\">\n   \t\t\t\t<textarea class=\"form-control\" name=\"description\" [(ngModel)]=\"model.description\" [ngFormControl]=\"form.controls.description\" maxlength=\"2000\" placeholder=\"Description\" #textarea></textarea>\n   \t\t\t</div>\n\t\t\t\n   \t\t\t<p class=\"text-right\">\n   \t\t\t\t<button type=\"submit\" class=\"btn btn-warning btn-lg\">{{ _busy ? 'Wait...' : 'Update' }}</button>\n   \t\t\t\t<button type=\"submit\" class=\"btn btn-default btn-lg\" (click)=\"editMode = false\" [disabled]=\"_busy\">Cancel</button>\n   \t\t\t</p>\n   \t\t</form>\t\n\t\t\n   \t\t<p *ngIf=\"!editMode && configUser.id === trip.user._id\" class=\"text-right\">\n   \t\t\t<button class=\"btn btn-default btn-lg\" (click)=\"editMode = true\">Edit</button>\n   \t\t</p>\n\n   \t\t<p *ngIf=\"trip.user._id != configUser.id\" class=\"text-right\">\n   \t\t\t<button class=\"btn btn-default btn-lg\" (click)=\"onRequest(trip)\">Request Delivery</button>\n   \t\t</p>\n   \t</div>\n\n   \t<div *ngIf=\"trip && trip.user && configUser.id === trip.user._id\">\n   \t\t<br />\n   \t\t<br />\n   \t\t<h4>Requests for shipping:</h4>\n\n   \t\t<p *ngIf=\"orders && !orders.length\"><i>There are no requests yet.</i></p>\n\n   \t\t<table class=\"table trips-my-requests\">\n   \t\t\t<tr *ngFor=\"#order of orders\">\n   \t\t\t\t<td>\n   \t\t\t\t\t<order-card [order]=\"order\" [user]=\"order.user\"></order-card>\n\t\t\t\t\t\n   \t\t\t\t\t<p class=\"order-message\">\n   \t\t\t\t\t\t{{ order.message }}\n   \t\t\t\t\t</p>\n\t\t\t\t\t\n   \t\t\t\t\t<goto [order]=\"order\" [newMessages]=\"newMessages\"></goto>\n   \t\t\t\t\t<!-- <p class=\"text-right\">\n   \t\t\t\t\t\t<a [routerLink]=\"['Order', {id:order._id}]\">Go to negotiation <span *ngIf=\"order.msg_cnt\">({{ order.msg_cnt }})</span> <!- <span class=\"badge\" *ngIf=\"newMessages[order._id] && newMessages[order._id][0]\">{{newMessages[order._id][0]}}</span> -></a>\n   \t\t\t\t\t</p> -->\t\t\t\n   \t\t\t\t</td>\n   \t\t\t</tr>\n   \t\t</table>\n   \t</div>\n   </div>\n\t",
                        directives: [router_1.ROUTER_DIRECTIVES, trip_card_component_1.TripCardComponent, order_card_component_1.OrderCardComponent, goto_card_component_1.GotoComponent],
                        pipes: [to_date_pipe_1.ToDatePipe]
                    }),
                    __param(10, core_1.Inject('config.user')), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _a) || Object, (typeof (_b = typeof router_1.Location !== 'undefined' && router_1.Location) === 'function' && _b) || Object, (typeof (_c = typeof modal_service_1.ModalService !== 'undefined' && modal_service_1.ModalService) === 'function' && _c) || Object, (typeof (_d = typeof notification_service_1.NotificationService !== 'undefined' && notification_service_1.NotificationService) === 'function' && _d) || Object, (typeof (_e = typeof order_service_1.OrderService !== 'undefined' && order_service_1.OrderService) === 'function' && _e) || Object, (typeof (_f = typeof trip_service_1.TripService !== 'undefined' && trip_service_1.TripService) === 'function' && _f) || Object, (typeof (_g = typeof subscribe_service_1.SubscribeService !== 'undefined' && subscribe_service_1.SubscribeService) === 'function' && _g) || Object, (typeof (_h = typeof router_1.RouteParams !== 'undefined' && router_1.RouteParams) === 'function' && _h) || Object, (typeof (_j = typeof common_1.FormBuilder !== 'undefined' && common_1.FormBuilder) === 'function' && _j) || Object, (typeof (_k = typeof core_1.ApplicationRef !== 'undefined' && core_1.ApplicationRef) === 'function' && _k) || Object, Object])
                ], TripComponent);
                return TripComponent;
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            })();
            exports_1("TripComponent", TripComponent);
        }
    }
});