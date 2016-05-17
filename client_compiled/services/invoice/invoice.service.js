System.register(['angular2/core', 'angular2/http'], function(exports_1, context_1) {
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
    var core_1, http_1;
    var InvoiceService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            InvoiceService = (function () {
                function InvoiceService(http, configFees) {
                    this.http = http;
                    this.configFees = configFees;
                }
                InvoiceService.prototype.add = function (data) {
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    headers.append('X-Requested-With', 'XMLHttpRequest');
                    return this.http.post('/invoices/add?xhr', JSON.stringify(data), {
                        headers: headers
                    }).map(function (res) { return res.json(); });
                };
                InvoiceService.prototype.pay = function (invoiceId) {
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    headers.append('X-Requested-With', 'XMLHttpRequest');
                    return this.http.post('/invoices/pay?xhr', JSON.stringify({ invoiceId: invoiceId }), {
                        headers: headers
                    }).map(function (res) { return res.json(); });
                };
                InvoiceService.prototype.unhold = function (invoiceId) {
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    headers.append('X-Requested-With', 'XMLHttpRequest');
                    return this.http.post('/invoices/unhold?xhr', JSON.stringify({ invoiceId: invoiceId }), {
                        headers: headers
                    }).map(function (res) { return res.json(); });
                };
                InvoiceService.prototype.refund = function (invoiceId) {
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    headers.append('X-Requested-With', 'XMLHttpRequest');
                    return this.http.post('/invoices/refund?xhr', JSON.stringify({ invoiceId: invoiceId }), {
                        headers: headers
                    }).map(function (res) { return res.json(); });
                };
                InvoiceService.prototype.getByOrderId = function (id) {
                    var headers = new http_1.Headers();
                    headers.append('X-Requested-With', 'XMLHttpRequest');
                    return this.http.get('/invoices/order/' + id + '?xhr', {
                        headers: headers
                    }).map(function (res) { return res.json(); });
                };
                InvoiceService.prototype.check = function (id) {
                    var headers = new http_1.Headers();
                    headers.append('X-Requested-With', 'XMLHttpRequest');
                    return this.http.get('/invoices/check/' + id + '?xhr', {
                        headers: headers
                    }).map(function (res) { return res.json(); });
                };
                InvoiceService.prototype.getFees = function (amount, currency) {
                    var confPayment = this.configFees;
                    var safe = 1 * (Number(amount) || 0).toFixed(2);
                    var curConfig = confPayment.cur[currency];
                    if (safe < 0.01 || !curConfig) {
                        return false;
                    }
                    var oslikiFix = curConfig.oslikiFix, paypalFix = curConfig.paypalFix, oslikiPr = confPayment.oslikiPr, paypalPr = confPayment.paypalPr, fixes = oslikiFix + paypalFix;
                    var p = {
                        safe: safe
                    };
                    p.oslikiFee = oslikiFix + (p.safe / 100) * oslikiPr;
                    p.total = ((p.safe + paypalFix + p.oslikiFee) * 100) / (100 - paypalPr);
                    p.paypalFee = 1 * (paypalFix + (p.total / 100) * paypalPr).toFixed(2);
                    p.oslikiFee = 1 * p.oslikiFee.toFixed(2);
                    p.total = p.safe + p.oslikiFee + p.paypalFee;
                    p.nonRefundable = fixes + fixes / 100 * paypalPr;
                    p.refundable = p.total - p.nonRefundable;
                    p.nonRefundableOsliki = oslikiFix;
                    p.nonRefundablePaypal = p.nonRefundable - p.nonRefundableOsliki;
                    Object.keys(p).forEach(function (key) {
                        p[key] = p[key].toFixed(2);
                    });
                    return p;
                };
                InvoiceService = __decorate([
                    core_1.Injectable(),
                    __param(1, core_1.Inject('config.fees')), 
                    __metadata('design:paramtypes', [http_1.Http, Object])
                ], InvoiceService);
                return InvoiceService;
            }());
            exports_1("InvoiceService", InvoiceService);
        }
    }
});
