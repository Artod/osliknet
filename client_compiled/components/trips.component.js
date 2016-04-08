System.register(['angular2/core', 'angular2/common', 'angular2/router', '../services/trip/trip.service', '../services/order/order.service', '../services/subscribe/subscribe.service', '../services/modal/modal.service', './captcha.component', './trip-card.component', './gm-autocomplite.component', './order-add.component', '../pipes/to-date.pipe'], function(exports_1, context_1) {
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
    var core_1, common_1, router_1, trip_service_1, order_service_1, subscribe_service_1, modal_service_1, captcha_component_1, trip_card_component_1, gm_autocomplite_component_1, order_add_component_1, to_date_pipe_1;
    var TripsComponent;
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
            function (captcha_component_1_1) {
                captcha_component_1 = captcha_component_1_1;
            },
            function (trip_card_component_1_1) {
                trip_card_component_1 = trip_card_component_1_1;
            },
            function (gm_autocomplite_component_1_1) {
                gm_autocomplite_component_1 = gm_autocomplite_component_1_1;
            },
            function (order_add_component_1_1) {
                order_add_component_1 = order_add_component_1_1;
            },
            function (to_date_pipe_1_1) {
                to_date_pipe_1 = to_date_pipe_1_1;
            }],
        execute: function() {
            TripsComponent = (function () {
                function TripsComponent(_router, _location, _modalService, _orderService, _tripService, _subscribeService, _fb, _routeParams, _routeData, _el, _appRef, configUser) {
                    var _this = this;
                    this._router = _router;
                    this._location = _location;
                    this._modalService = _modalService;
                    this._orderService = _orderService;
                    this._tripService = _tripService;
                    this._subscribeService = _subscribeService;
                    this._fb = _fb;
                    this._routeParams = _routeParams;
                    this._routeData = _routeData;
                    this._el = _el;
                    this._appRef = _appRef;
                    this.configUser = configUser;
                    this.trips = [];
                    this.subscribe = {};
                    this.searchModel = {};
                    this.subModel = {};
                    this.lastId = '';
                    this.limit = 15;
                    this._busy = false;
                    this._inited = false;
                    this._busySearch = false;
                    this._subBusy = false;
                    this._subsFinished = false;
                    this._subSubmitted = false;
                    this.isMain = this._routeData.get('isMain');
                    this.searchForm = this._fb.group({
                        from: '',
                        from_id: '',
                        to: '',
                        to_id: ''
                    });
                    this.subModel = {
                        email: '',
                        recaptcha: ''
                    };
                    this.subForm = this._fb.group({
                        email: configUser.id ? '' : ['', common_1.Validators.compose([function (ctrl) {
                                    if (!/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(ctrl.value)) {
                                        return { invalidEmail: true };
                                    }
                                    return null;
                                },
                                common_1.Validators.required])],
                        recaptcha: configUser.id ? '' : ['', common_1.Validators.required]
                    });
                    this.init();
                    this._locationSubscribe = this._location.subscribe(function () {
                        _this.init();
                    });
                }
                TripsComponent.prototype.ngAfterViewInit = function () {
                };
                TripsComponent.prototype.ngOnDestroy = function () {
                    this._locationSubscribe.unsubscribe();
                };
                TripsComponent.prototype.routerCanReuse = function (nextInstruction, prevInstruction) {
                    return (nextInstruction.urlPath === prevInstruction.urlPath);
                };
                TripsComponent.prototype.routerOnReuse = function (next, prev) {
                    this._routeParams.params = next.params;
                };
                TripsComponent.prototype.init = function () {
                    var from = this._routeParams.get('from'), to = this._routeParams.get('to');
                    this.searchModel = {
                        from: from ? decodeURIComponent(from) : '',
                        from_id: this._routeParams.get('from_id') || '',
                        to: to ? decodeURIComponent(to) : '',
                        to_id: this._routeParams.get('to_id') || ''
                    };
                    this.search();
                };
                TripsComponent.prototype.serialize = function (obj) {
                    return '?' + Object.keys(obj).reduce(function (a, k) { if (obj[k])
                        a.push(k + '=' + encodeURIComponent(obj[k])); return a; }, []).join('&');
                };
                TripsComponent.prototype.loadNext = function () {
                    var _this = this;
                    this._busy = true;
                    var queryId = this.serialize(this.searchModel) + this.lastId;
                    this._tripService.search(this.searchModel, this.limit, this.lastId).subscribe(function (data) {
                        if (queryId !== (_this.serialize(_this.searchModel) + _this.lastId)) {
                            return;
                        }
                        (data.trips || []).forEach(function (trip) {
                            _this.trips.push(trip);
                        });
                        _this.subscribe = data.subscribe || {};
                        _this.lastId = (data.trips[_this.limit - 1] || {})._id || '';
                        _this._busy = false;
                    }, function (err) {
                        _this._busy = false;
                    });
                };
                TripsComponent.prototype.onSubmit = function ($event, $form, $thanx) {
                    this.search($event, $form, $thanx);
                };
                TripsComponent.prototype.search = function ($event, $form, $thanx) {
                    var _this = this;
                    if (!this.searchForm.valid) {
                        return false;
                    }
                    if (!this.searchModel.from_id) {
                        this.searchModel.from = '';
                    }
                    if (!this.searchModel.to_id) {
                        this.searchModel.to = '';
                    }
                    if ($event) {
                        if (this.isMain) {
                            setTimeout(function () { return _this._router.navigate(['Trips', _this.searchModel]); }, 10);
                            return;
                        }
                        else {
                            this._location.go('/trips', this.serialize(this.searchModel));
                        }
                    }
                    if (this.subModel.from_id !== this.searchModel.from_id || this.subModel.to_id !== this.searchModel.to_id) {
                        this._subsFinished = false;
                    }
                    this.subModel.from = this.searchModel.from;
                    this.subModel.from_id = this.searchModel.from_id;
                    this.subModel.to = this.searchModel.to;
                    this.subModel.to_id = this.searchModel.to_id;
                    if (!this.searchModel.from_id && !this.searchModel.to_id) {
                        this.trips = [];
                        this.subscribe = {};
                        this.lastId = '';
                        return;
                    }
                    this._busySearch = true;
                    this._tripService.search(this.searchModel, this.limit).subscribe(function (data) {
                        _this.trips = data.trips || [];
                        _this.lastId = (data.trips[_this.limit - 1] || {})._id || '';
                        _this.subscribe = data.subscribe || {};
                        _this._inited = true;
                        _this._busySearch = false;
                    }, function (err) {
                        _this._inited = true;
                        _this._busySearch = false;
                    });
                };
                TripsComponent.prototype.onSubscribe = function ($event, $form) {
                    var _this = this;
                    var $email = $form.querySelector('input[type="email"]');
                    if ($email && $email.value === '') {
                        $email.focus();
                        return false;
                    }
                    this._subSubmitted = true;
                    if (!this.subForm.valid) {
                        return false;
                    }
                    this._subBusy = true;
                    this._subscribeService.add(this.subModel).subscribe(function (data) {
                        _this._subsFinished = true;
                        _this._subSubmitted = false;
                        _this._subBusy = false;
                        _this._appRef.tick();
                    }, function (err) {
                        _this._subBusy = false;
                    });
                };
                TripsComponent.prototype.onRequest = function (trip) {
                    this._modalService.show(order_add_component_1.OrderAddComponent, core_1.Injector.resolve([
                        core_1.provide(order_service_1.OrderService, { useValue: this._orderService }),
                        core_1.provide(router_1.Router, { useValue: this._router }),
                        core_1.provide(router_1.Location, { useValue: this._location }),
                        core_1.provide('trip', { useValue: trip })
                    ]));
                };
                TripsComponent.prototype.unsubscribe = function ($link) {
                    var _this = this;
                    this._subscribeService.cancel(this.subscribe._id).subscribe(function (data) {
                        $link.innerHTML = '<i>You have successfully unsubscribed!</i>';
                        _this._subsFinished = false;
                    }, function (err) {
                        $link.innerHTML = '<i>Something went wrong. Try again later.</i>';
                    });
                    return false;
                };
                TripsComponent = __decorate([
                    core_1.Component({
                        templateUrl: '/client_src/tmpls/trips.html',
                        directives: [gm_autocomplite_component_1.GmAutocompliteComponent, router_1.ROUTER_DIRECTIVES, trip_card_component_1.TripCardComponent, captcha_component_1.CaptchaComponent],
                        pipes: [to_date_pipe_1.ToDatePipe]
                    }),
                    __param(11, core_1.Inject('config.user')), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _a) || Object, (typeof (_b = typeof router_1.Location !== 'undefined' && router_1.Location) === 'function' && _b) || Object, (typeof (_c = typeof modal_service_1.ModalService !== 'undefined' && modal_service_1.ModalService) === 'function' && _c) || Object, (typeof (_d = typeof order_service_1.OrderService !== 'undefined' && order_service_1.OrderService) === 'function' && _d) || Object, (typeof (_e = typeof trip_service_1.TripService !== 'undefined' && trip_service_1.TripService) === 'function' && _e) || Object, (typeof (_f = typeof subscribe_service_1.SubscribeService !== 'undefined' && subscribe_service_1.SubscribeService) === 'function' && _f) || Object, (typeof (_g = typeof common_1.FormBuilder !== 'undefined' && common_1.FormBuilder) === 'function' && _g) || Object, (typeof (_h = typeof router_1.RouteParams !== 'undefined' && router_1.RouteParams) === 'function' && _h) || Object, (typeof (_j = typeof router_1.RouteData !== 'undefined' && router_1.RouteData) === 'function' && _j) || Object, (typeof (_k = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _k) || Object, (typeof (_l = typeof core_1.ApplicationRef !== 'undefined' && core_1.ApplicationRef) === 'function' && _l) || Object, Object])
                ], TripsComponent);
                return TripsComponent;
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            }());
            exports_1("TripsComponent", TripsComponent);
        }
    }
});