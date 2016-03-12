System.register(['angular2/core', 'angular2/common', 'angular2/router', '../services/order/order.service', '../pipes/to-date.pipe'], function(exports_1) {
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
                    this._location.subscribe(function () {
                        _this.closeModal();
                    });
                    this.showModal();
                }
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
                            catch (e) {
                                _this.error = err.text() || _this.error;
                            }
                            _this._busy = false;
                        });
                    }
                };
                OrderAddComponent = __decorate([
                    core_1.Component({
                        template: "\n   <div (window:keydown)=\"$event.keyCode == 27 ? closeModal() : true\">\n   \t<div *ngIf=\"!_checked\">\n   \t\tLoading...\n   \t</div>\n\t\n   \t<div *ngIf=\"!(configUser && configUser.id)\">\n   \t\t<div class=\"page-header\">\n   \t\t\t<h2>Request for delivery</h2>\n   \t\t</div>\n   \t\t<p>\n   \t\t\tYou are not authorized. <a [routerLink]=\"['Join']\" (click)=\"closeModal()\">Create An Account</a> or <a [routerLink]=\"['Login']\" (click)=\"closeModal()\">Log in</a> to an existing.\n   \t\t</p>\n   \t</div>\n\n   \t<div *ngIf=\"_checked && order && order._id\">\n   \t\t<p>\n   \t\t\t<span class=\"text-muted\">{{ order.created_at | toDate | date: 'longDate' }}</span>\n   \t\t</p>\t\n\t\t\n   \t\t<p class=\"order-message\">\n   \t\t\t{{ order.message }}\n   \t\t</p>\n\t\t\n   \t\t<div class=\"text-right\">\n   \t\t\t<a [routerLink]=\"['Order', {id: order._id}]\" (click)=\"closeModal()\">Go to negotiation <span *ngIf=\"order.msg_cnt\">({{ order.msg_cnt }})</span> </a>\n   \t\t</div>\n   \t</div>\n\n   \t<div *ngIf=\"(configUser && configUser.id) && _checked && (!order || !order._id)\">\n   \t\t<div class=\"page-header\">\n   \t\t\t<h2>Add a Request for delivery</h2>\n   \t\t</div>\n\n   \t\t<form action=\"/orders/add\" method=\"post\" [ngFormModel]=\"form\" (submit)=\"_busy ? false : onSubmit(textarea)\">\n   \t\t\t<input type=\"hidden\" name=\"trip\" value=\"\" [(ngModel)]=\"model.trip\" [ngFormControl]=\"form.controls.trip\" />\n\n   \t\t\t<div class=\"form-group\">\t\n   \t\t\t\t<textarea class=\"form-control\" name=\"message\" [(ngModel)]=\"model.message\" [ngFormControl]=\"form.controls.message\" placeholder=\"Description\" maxlength=\"2000\" #textarea></textarea>\n   \t\t\t</div>\n\t\t\t\n   \t\t\t<br />\n\t\t\t\n   \t\t\t<p class=\"text-right\">\n   \t\t\t\t<button type=\"submit\" class=\"btn btn-warning btn-lg\">{{ _busy ? 'Wait...' : 'Send' }}</button>\n   \t\t\t\t<button class=\"btn btn-default btn-lg\" (click)=\"closeModal()\" [disabled]=\"_busy\">Cancel</button>\n   \t\t\t</p>\n\t\t\t\n   \t\t\t<div *ngIf=\"error\" class=\"help-block text-right {{error ? 'has-error' : ''}}\">\n   \t\t\t\t{{ error }}\n   \t\t\t</div>\n   \t\t</form>\n   \t</div>\n   </div>\n\t",
                        directives: [router_1.ROUTER_DIRECTIVES],
                        providers: [common_1.FormBuilder],
                        pipes: [to_date_pipe_1.ToDatePipe]
                    }),
                    __param(3, core_1.Inject(common_1.FormBuilder)),
                    __param(4, core_1.Inject('trip')),
                    __param(5, core_1.Inject('config.user')), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof order_service_1.OrderService !== 'undefined' && order_service_1.OrderService) === 'function' && _a) || Object, (typeof (_b = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _b) || Object, (typeof (_c = typeof router_1.Location !== 'undefined' && router_1.Location) === 'function' && _c) || Object, (typeof (_d = typeof common_1.FormBuilder !== 'undefined' && common_1.FormBuilder) === 'function' && _d) || Object, Object, Object])
                ], OrderAddComponent);
                return OrderAddComponent;
                var _a, _b, _c, _d;
            })();
            exports_1("OrderAddComponent", OrderAddComponent);
        }
    }
});