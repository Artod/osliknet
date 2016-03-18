System.register(['angular2/core', 'angular2/common', 'angular2/router', '../services/order/order.service', '../pipes/to-date.pipe'], function(exports_1) {
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
    var core_1, common_1, router_1, order_service_1, to_date_pipe_1;
    var OrderAddComponent;
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
            function (order_service_1_1) {
                order_service_1 = order_service_1_1;
            },
            function (to_date_pipe_1_1) {
                to_date_pipe_1 = to_date_pipe_1_1;
            }],
        execute: function() {
            OrderAddComponent = (function () {
                function OrderAddComponent(_orderService, _router, _location, _fb, trip, configUser) {
                    var _this = this;
                    this._orderService = _orderService;
                    this._router = _router;
                    this._location = _location;
                    this._fb = _fb;
                    this.trip = trip;
                    this.configUser = configUser;
                    this.model = {};
                    this.order = {};
                    this._checked = false;
                    this._busy = false;
                    this.error = '';
                    this.form = _fb.group({
                        trip: ['', common_1.Validators.required],
                        message: ['', common_1.Validators.required]
                    });
                    this.model.trip = trip._id;
                    this._orderService.getByTripId(trip._id).subscribe(function (data) {
                        _this.order = data.order || {};
                        _this._checked = true;
                    }, function (err) {
                        _this._checked = true;
                    });
                    this._locationSubscribe = this._location.subscribe(function () {
                        _this.closeModal();
                    });
                    this.showModal();
                }
                OrderAddComponent.prototype.ngOnDestroy = function () {
                    this._locationSubscribe.unsubscribe();
                };
                OrderAddComponent.prototype.showModal = function () {
                    this._modalComponent && this._modalComponent.show();
                };
                OrderAddComponent.prototype.closeModal = function () {
                    this._modalComponent && this._modalComponent.close();
                };
                OrderAddComponent.prototype.onSubmit = function ($textarea) {
                    var _this = this;
                    if (!this.form.controls.message.valid) {
                        $textarea.focus();
                        return;
                    }
                    if (this.form.valid && !this._busy) {
                        this._busy = true;
                        this._orderService.add(this.model).subscribe(function (data) {
                            _this.error = '';
                            _this.order = data.order || {};
                            _this._busy = false;
                        }, function (err) {
                            _this.error = 'Unexpected error. Try again later.';
                            try {
                                _this.error = err.json().error || _this.error;
                            }
                            catch (e) { }
                            _this._busy = false;
                        });
                    }
                };
                OrderAddComponent = __decorate([
                    core_1.Component({
                        templateUrl: '/client_src/tmpls/order-add.html',
                        directives: [router_1.ROUTER_DIRECTIVES],
                        providers: [common_1.FormBuilder],
                        pipes: [to_date_pipe_1.ToDatePipe]
                    }),
                    __param(3, core_1.Inject(common_1.FormBuilder)),
                    __param(4, core_1.Inject('trip')),
                    __param(5, core_1.Inject('config.user')), 
                    __metadata('design:paramtypes', [order_service_1.OrderService, router_1.Router, router_1.Location, common_1.FormBuilder, Object, Object])
                ], OrderAddComponent);
                return OrderAddComponent;
            }());
            exports_1("OrderAddComponent", OrderAddComponent);
        }
    }
});
