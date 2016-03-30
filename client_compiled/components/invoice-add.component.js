System.register(['angular2/core', 'angular2/common', '../components/invoice-card.component', '../services/invoice/invoice.service'], function(exports_1) {
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
                function InvoiceAddComponent(_fb, _invoiceService, orderId, onInvoiceAdd) {
                    var _this = this;
                    this._fb = _fb;
                    this._invoiceService = _invoiceService;
                    this.orderId = orderId;
                    this.onInvoiceAdd = onInvoiceAdd;
                    this.invoices = [];
                    this.model = {
                        currency: 'USD',
                        amount: 25.00
                    };
                    this.error = '';
                    this.form = this._fb.group({
                        order: ['', common_1.Validators.required],
                        amount: ['', common_1.Validators.compose([
                                function (ctrl) {
                                    var amount = Number(ctrl.value);
                                    if (ctrl.value && (!amount || amount < 0.01)) {
                                        return { invalidAmount: true };
                                    }
                                    return null;
                                },
                                common_1.Validators.required])],
                        currency: ['', common_1.Validators.required],
                        dest_id: ['', common_1.Validators.compose([
                                function (ctrl) {
                                    if (!/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(ctrl.value)) {
                                        return { invalidEmail: true };
                                    }
                                    return null;
                                },
                                common_1.Validators.required])],
                        comment: '',
                        agree: ['', common_1.Validators.required]
                    });
                    this.model.order = this.orderId;
                    this._busy = true;
                    this._invoiceService.getByOrderId(this.orderId).subscribe(function (data) {
                        _this.invoices = data && data.invoices || [];
                        var last = _this.invoices[_this.invoices.length - 1];
                        if (last) {
                            _this.model.dest_id = last.dest_id;
                            _this.model.amount = last.amount;
                            _this.model.currency = last.currency;
                        }
                        _this._busy = false;
                    }, function (err) {
                        _this._busy = false;
                    });
                }
                InvoiceAddComponent.prototype.closeModal = function () {
                    this._modalComponent && this._modalComponent.close();
                };
                InvoiceAddComponent.prototype.onChangeRating = function (el) {
                    if (el.checked) {
                        this.model.rating = el.value;
                    }
                };
                InvoiceAddComponent.prototype.onSubmit = function (elComment) {
                    var _this = this;
                    if (!this.form.valid) {
                        elComment.focus();
                    }
                    if (this.form.valid && !this._busy) {
                        this._busy = true;
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
                    }
                };
                InvoiceAddComponent = __decorate([
                    core_1.Component({
                        templateUrl: '/client_src/tmpls/invoice-add.html',
                        providers: [common_1.FormBuilder],
                        directives: [invoice_card_component_1.InvoiceCardComponent]
                    }),
                    __param(2, core_1.Inject('orderId')),
                    __param(3, core_1.Inject('onInvoiceAdd')), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof common_1.FormBuilder !== 'undefined' && common_1.FormBuilder) === 'function' && _a) || Object, (typeof (_b = typeof invoice_service_1.InvoiceService !== 'undefined' && invoice_service_1.InvoiceService) === 'function' && _b) || Object, String, Object])
                ], InvoiceAddComponent);
                return InvoiceAddComponent;
                var _a, _b;
            }());
            exports_1("InvoiceAddComponent", InvoiceAddComponent);
        }
    }
});