System.register(['angular2/core', '../services/invoice/invoice.service'], function(exports_1) {
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
    var core_1, invoice_service_1;
    var InvoiceCardComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (invoice_service_1_1) {
                invoice_service_1 = invoice_service_1_1;
            }],
        execute: function() {
            InvoiceCardComponent = (function () {
                function InvoiceCardComponent(_invoiceService, configUser, invoiceStatus) {
                    this._invoiceService = _invoiceService;
                    this.configUser = configUser;
                    this.invoiceStatus = invoiceStatus;
                    this.invoice = {};
                }
                InvoiceCardComponent.prototype.ngOnInit = function () {
                };
                InvoiceCardComponent.prototype.ngOnChanges = function (changes) {
                    if (changes.invoice) {
                        this.fees = this._invoiceService.getFees(this.invoice.amount, this.invoice.currency);
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], InvoiceCardComponent.prototype, "invoice", void 0);
                InvoiceCardComponent = __decorate([
                    core_1.Component({
                        selector: 'invoice-card',
                        templateUrl: '/client_src/tmpls/invoice-card.html'
                    }),
                    __param(1, core_1.Inject('config.user')),
                    __param(2, core_1.Inject('config.invoiceStatus')), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof invoice_service_1.InvoiceService !== 'undefined' && invoice_service_1.InvoiceService) === 'function' && _a) || Object, Object, Object])
                ], InvoiceCardComponent);
                return InvoiceCardComponent;
                var _a;
            }());
            exports_1("InvoiceCardComponent", InvoiceCardComponent);
        }
    }
});