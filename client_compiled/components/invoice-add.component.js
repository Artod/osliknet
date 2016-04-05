System.register(['angular2/core', 'angular2/common', '../components/invoice-card.component', '../services/invoice/invoice.service'], function(exports_1, context_1) {
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
    var core_1, common_1, invoice_card_component_1, invoice_service_1;
    var InvoiceAddComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (invoice_card_component_1_1) {
                invoice_card_component_1 = invoice_card_component_1_1;
            },
            function (invoice_service_1_1) {
                invoice_service_1 = invoice_service_1_1;
            }],
        execute: function() {
            InvoiceAddComponent = (function () {
                function InvoiceAddComponent(_fb, _invoiceService, order, onInvoiceAdd, configUser, sts) {
                    var _this = this;
                    this._fb = _fb;
                    this._invoiceService = _invoiceService;
                    this.order = order;
                    this.onInvoiceAdd = onInvoiceAdd;
                    this.configUser = configUser;
                    this.sts = sts;
                    this.invoices = [];
                    this.model = {
                        currency: 'USD',
                        amount: 25.00,
                        agree: true
                    };
                    this.error = '';
                    this._busy = false;
                    this._busyInvoice = [];
                    this.errorInvoice = [];
                    this.form = this._fb.group({
                        order: ['', common_1.Validators.required],
                        amount: ['', function (ctrl) {
                                var amount = Number(ctrl.value);
                                if (!amount && (!amount || amount < 0.01)) {
                                    return { invalidAmount: true };
                                }
                                return null;
                            }],
                        currency: ['', common_1.Validators.required],
                        dest_id: ['', function (ctrl) {
                                if (!/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(ctrl.value)) {
                                    return { invalidEmail: true };
                                }
                                return null;
                            }],
                        comment: '',
                        agree: ['', function (ctrl) {
                                if (!ctrl.value) {
                                    return { invalidAgree: true };
                                }
                                return null;
                            }]
                    });
                    this.model.order = this.order._id;
                    this.model.dest_id = this.order.trip.user.email;
                    this._loaded = false;
                    this._invoiceService.getByOrderId(this.order._id).subscribe(function (data) {
                        _this.invoices = data && data.invoices || [];
                        var first = _this.invoices[0];
                        if (first) {
                            _this.model.dest_id = first.dest_id;
                            _this.model.amount = first.amount;
                            _this.model.currency = first.currency;
                        }
                        _this._loaded = true;
                    }, function (err) {
                        _this._loaded = true;
                    });
                }
                InvoiceAddComponent.prototype.onSubmit = function ($dest_id, $amount, $agree) {
                    var _this = this;
                    if (!this.form.controls.dest_id.valid) {
                        $dest_id.focus();
                        return;
                    }
                    if (!this.form.controls.amount.valid) {
                        $amount.focus();
                        return;
                    }
                    if (!this.form.controls.agree.valid) {
                        $agree.focus();
                        return;
                    }
                    if (!this.form.valid) {
                        return;
                    }
                    this._busy = true;
                    this.error = '';
                    this._invoiceService.add(this.model).subscribe(function (data) {
                        _this.closeModal();
                        _this.onInvoiceAdd();
                        _this._busy = false;
                    }, function (err) {
                        _this.error = 'Unexpected error. Try again later.';
                        try {
                            _this.error = err.json().error || _this.error;
                        }
                        catch (e) { }
                        _this._busy = false;
                    });
                };
                InvoiceAddComponent.prototype.closeModal = function () {
                    this._modalComponent && this._modalComponent.close();
                };
                InvoiceAddComponent.prototype.onChangeRating = function (el) {
                    if (el.checked) {
                        this.model.rating = el.value;
                    }
                };
                InvoiceAddComponent.prototype.payInvoice = function (invoiceId, $agree) {
                    var _this = this;
                    if (!$agree.checked) {
                        $agree.focus();
                        return;
                    }
                    this.errorInvoice[invoiceId] = '';
                    this._busyInvoice[invoiceId] = true;
                    this._invoiceService.pay(invoiceId).subscribe(function (data) {
                        if (data.redirectUrl) {
                            window.location = data.redirectUrl;
                        }
                        else {
                            _this._busyInvoice[invoiceId] = false;
                            _this.errorInvoice[invoiceId] = 'Unexpected error. Try again later.';
                        }
                    }, function (err) {
                        _this.errorInvoice[invoiceId] = 'Unexpected error. Try again later.';
                        try {
                            _this.errorInvoice[invoiceId] = err.json().error || _this.errorInvoice[invoiceId];
                        }
                        catch (e) { }
                        _this._busyInvoice[invoiceId] = false;
                    });
                };
                InvoiceAddComponent.prototype.invoiceAct = function (act, invoiceId, $agree) {
                    var _this = this;
                    if (!$agree.checked) {
                        $agree.focus();
                        return;
                    }
                    if (!confirm('Are you sure?')) {
                        return;
                    }
                    this.errorInvoice[invoiceId] = '';
                    this._busyInvoice[invoiceId] = true;
                    this._invoiceService[act](invoiceId).subscribe(function (data) {
                        _this.closeModal();
                        _this.onInvoiceAdd();
                    }, function (err) {
                        _this.errorInvoice[invoiceId] = 'Unexpected error. Try again later.';
                        try {
                            _this.errorInvoice[invoiceId] = err.json().error || _this.errorInvoice;
                        }
                        catch (e) { }
                        _this._busyInvoice[invoiceId] = false;
                    });
                };
                InvoiceAddComponent = __decorate([
                    core_1.Component({
                        templateUrl: '/client_src/tmpls/invoice-add.html',
                        providers: [common_1.FormBuilder],
                        directives: [invoice_card_component_1.InvoiceCardComponent]
                    }),
                    __param(2, core_1.Inject('order')),
                    __param(3, core_1.Inject('onInvoiceAdd')),
                    __param(4, core_1.Inject('config.user')),
                    __param(5, core_1.Inject('config.invoiceStatusConst')), 
                    __metadata('design:paramtypes', [common_1.FormBuilder, invoice_service_1.InvoiceService, Object, Function, Object, Object])
                ], InvoiceAddComponent);
                return InvoiceAddComponent;
            }());
            exports_1("InvoiceAddComponent", InvoiceAddComponent);
        }
    }
});
