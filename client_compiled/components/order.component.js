System.register(['angular2/core', 'angular2/router', '../services/order/order.service', '../services/modal/modal.service', '../services/review/review.service', '../services/invoice/invoice.service', '../pipes/to-date.pipe', './trip-card.component', './order-card.component', './review-add.component', './invoice-add.component', './chat.component'], function(exports_1) {
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
    var core_1, router_1, order_service_1, modal_service_1, review_service_1, invoice_service_1, to_date_pipe_1, trip_card_component_1, order_card_component_1, review_add_component_1, invoice_add_component_1, chat_component_1;
    var OrderComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (order_service_1_1) {
                order_service_1 = order_service_1_1;
            },
            function (modal_service_1_1) {
                modal_service_1 = modal_service_1_1;
            },
            function (review_service_1_1) {
                review_service_1 = review_service_1_1;
            },
            function (invoice_service_1_1) {
                invoice_service_1 = invoice_service_1_1;
            },
            function (to_date_pipe_1_1) {
                to_date_pipe_1 = to_date_pipe_1_1;
            },
            function (trip_card_component_1_1) {
                trip_card_component_1 = trip_card_component_1_1;
            },
            function (order_card_component_1_1) {
                order_card_component_1 = order_card_component_1_1;
            },
            function (review_add_component_1_1) {
                review_add_component_1 = review_add_component_1_1;
            },
            function (invoice_add_component_1_1) {
                invoice_add_component_1 = invoice_add_component_1_1;
            },
            function (chat_component_1_1) {
                chat_component_1 = chat_component_1_1;
            }],
        execute: function() {
            OrderComponent = (function () {
                function OrderComponent(_orderService, _modalService, _reviewService, _invoiceService, _routeParams, _appRef, configOrderStatus, sts, configUser) {
                    this._orderService = _orderService;
                    this._modalService = _modalService;
                    this._reviewService = _reviewService;
                    this._invoiceService = _invoiceService;
                    this._routeParams = _routeParams;
                    this._appRef = _appRef;
                    this.configOrderStatus = configOrderStatus;
                    this.sts = sts;
                    this.configUser = configUser;
                    this.isChatActual = false;
                    this.isTripPassed = false;
                    this.order = {};
                    this._changeStatusBusy = false;
                    this.orderId = this._routeParams.get('id');
                }
                OrderComponent.prototype.changeStatus = function (status) {
                    var _this = this;
                    if (this._changeStatusBusy) {
                        return;
                    }
                    this._changeStatusBusy = true;
                    this._orderService.changeStatus(status, this.orderId).subscribe(function (data) {
                        _this.isChatActual = false;
                        _this._changeStatusBusy = false;
                    }, function (err) {
                        console.dir(err);
                        _this._changeStatusBusy = false;
                    });
                };
                OrderComponent.prototype.sendInvoice = function () {
                    var _this = this;
                    this._modalService.show(invoice_add_component_1.InvoiceAddComponent, core_1.Injector.resolve([
                        core_1.provide(invoice_service_1.InvoiceService, { useValue: this._invoiceService }),
                        core_1.provide('orderId', { useValue: this.orderId }),
                        core_1.provide('onInvoiceAdd', {
                            useValue: function () {
                                _this.isChatActual = false;
                            }
                        })
                    ]));
                };
                OrderComponent.prototype.sendReview = function () {
                    var _this = this;
                    this._modalService.show(review_add_component_1.ReviewAddComponent, core_1.Injector.resolve([
                        core_1.provide(review_service_1.ReviewService, { useValue: this._reviewService }),
                        core_1.provide('orderId', { useValue: this.orderId }),
                        core_1.provide('onReviewAdd', {
                            useValue: function () {
                                _this.isChatActual = false;
                            }
                        })
                    ]));
                };
                OrderComponent.prototype.onOrder = function (order) {
                    this.order = order;
                    if (this.order && this.order.trip) {
                        var now = (new Date()).getTime() - 1000 * 60 * 60 * 24;
                        this.isTripPassed = (new Date(this.order.trip.when)) < now;
                    }
                };
                OrderComponent.prototype.onOrderStatus = function (status) {
                    this.order.status = status;
                    this._appRef.tick();
                };
                OrderComponent = __decorate([
                    core_1.Component({
                        selector: 'order',
                        templateUrl: '/client_src/tmpls/order.html',
                        pipes: [to_date_pipe_1.ToDatePipe],
                        directives: [router_1.ROUTER_DIRECTIVES, trip_card_component_1.TripCardComponent, order_card_component_1.OrderCardComponent, chat_component_1.ChatComponent]
                    }),
                    __param(6, core_1.Inject('config.orderStatus')),
                    __param(7, core_1.Inject('config.orderStatusConst')),
                    __param(8, core_1.Inject('config.user')), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof order_service_1.OrderService !== 'undefined' && order_service_1.OrderService) === 'function' && _a) || Object, (typeof (_b = typeof modal_service_1.ModalService !== 'undefined' && modal_service_1.ModalService) === 'function' && _b) || Object, (typeof (_c = typeof review_service_1.ReviewService !== 'undefined' && review_service_1.ReviewService) === 'function' && _c) || Object, (typeof (_d = typeof invoice_service_1.InvoiceService !== 'undefined' && invoice_service_1.InvoiceService) === 'function' && _d) || Object, (typeof (_e = typeof router_1.RouteParams !== 'undefined' && router_1.RouteParams) === 'function' && _e) || Object, (typeof (_f = typeof core_1.ApplicationRef !== 'undefined' && core_1.ApplicationRef) === 'function' && _f) || Object, Object, Object, Object])
                ], OrderComponent);
                return OrderComponent;
                var _a, _b, _c, _d, _e, _f;
            }());
            exports_1("OrderComponent", OrderComponent);
        }
    }
});