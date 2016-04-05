System.register(['angular2/core', 'angular2/router', 'angular2/common', '../services/message/message.service', '../services/notification/notification.service', '../pipes/to-date.pipe'], function(exports_1, context_1) {
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
    var core_1, router_1, common_1, message_service_1, notification_service_1, to_date_pipe_1;
    var ChatComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (message_service_1_1) {
                message_service_1 = message_service_1_1;
            },
            function (notification_service_1_1) {
                notification_service_1 = notification_service_1_1;
            },
            function (to_date_pipe_1_1) {
                to_date_pipe_1 = to_date_pipe_1_1;
            }],
        execute: function() {
            ChatComponent = (function () {
                function ChatComponent(_messageService, _notificationService, _fb, _el, _appRef, configUser) {
                    this._messageService = _messageService;
                    this._notificationService = _notificationService;
                    this._fb = _fb;
                    this._el = _el;
                    this._appRef = _appRef;
                    this.configUser = configUser;
                    this.isChatActual = false;
                    this.isChatActualChange = new core_1.EventEmitter();
                    this.userOutput = new core_1.EventEmitter();
                    this.orderOutput = new core_1.EventEmitter();
                    this.orderStatusOutput = new core_1.EventEmitter();
                    this.messages = [];
                    this.lastId = '0';
                    this.formModel = {};
                    this._chatHeight = 0;
                    this._busy = true;
                    this.form = _fb.group({
                        message: ['', common_1.Validators.required]
                    });
                }
                ChatComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.elChatList = this._el.nativeElement.querySelector('.chat-list');
                    this._notifSub = this._notificationService.start(3000).subscribe(function (data) {
                        if ((_this.orderId && data.newMessages && data.newMessages[_this.orderId] && (data.newMessages[_this.orderId][0] || data.newMessages[_this.orderId][1] !== _this.lastId)) ||
                            (_this.corrId && data.newPrivMessages && data.newPrivMessages[_this.corrId] && (data.newPrivMessages[_this.corrId][0] || data.newPrivMessages[_this.corrId][1] !== _this.lastId))) {
                            _this.getLastMessages();
                        }
                    });
                    if (this.orderId) {
                        this.form.controls.order = new common_1.Control('order', common_1.Validators.required);
                        this.formModel.order = this.orderId;
                    }
                    else if (this.corrId) {
                        this.form.controls.corr = new common_1.Control('corr', common_1.Validators.required);
                        this.formModel.corr = this.corrId;
                    }
                    this.getMessages();
                };
                ChatComponent.prototype.ngOnChanges = function (changes) {
                    if (changes.isChatActual && !changes.isChatActual.currentValue && !changes.isChatActual.isFirstChange()) {
                        this.getLastMessages();
                    }
                };
                ChatComponent.prototype.ngOnDestroy = function () {
                    this._notificationService.changeTimeout();
                    this._notifSub.unsubscribe();
                };
                ChatComponent.prototype.ngAfterViewChecked = function () {
                    var listTop = Math.round(this.elChatList.getBoundingClientRect().top + (window.document.documentElement.scrollTop || window.document.body.scrollTop));
                    if (this._listTop !== listTop) {
                        this._listTop = listTop;
                        this.expand(listTop);
                    }
                    if (this._chatHeight !== this.elChatList.scrollHeight) {
                        this._chatHeight = this.elChatList.scrollHeight;
                        this.scrollDown();
                    }
                };
                ChatComponent.prototype.scrollDown = function () {
                    this.elChatList.scrollTop = this.elChatList.scrollHeight;
                };
                ChatComponent.prototype.expand = function (listTop) {
                    var windowHeight = window.innerHeight || window.document.document.documentElement.clientHeight || window.document.documentElement.clientHeight;
                    listTop = listTop || (this.elChatList.getBoundingClientRect().top + (window.document.documentElement.scrollTop || window.document.body.scrollTop));
                    var height = windowHeight - listTop - 160;
                    this.elChatList.style.maxHeight = (height < 200 ? 200 : height) + 'px';
                };
                ChatComponent.prototype.onResize = function () {
                    this.expand();
                };
                ChatComponent.prototype.getMessages = function () {
                    var _this = this;
                    this._messageService.getAll(this.orderId, this.corrId).subscribe(function (res) {
                        if (res.messages && res.messages.length) {
                            _this.messages = res.messages;
                            _this.lastId = res.messages[res.messages.length - 1]._id;
                        }
                        if (_this.orderId) {
                            _this.orderOutput.emit(res.order || {});
                        }
                        else {
                            _this.userOutput.emit(res.user || {});
                        }
                        _this.isChatActual = true;
                        _this.isChatActualChange.emit(_this.isChatActual);
                        _this._busy = false;
                    }, function (error) {
                        _this._busy = false;
                    });
                };
                ChatComponent.prototype.getLastMessages = function () {
                    var _this = this;
                    this._messageService.getLastMessages(this.lastId, this.orderId, this.corrId).subscribe(function (res) {
                        if (res.messages && res.messages.length) {
                            _this.lastId = res.messages[res.messages.length - 1]._id;
                            res.messages.forEach(function (message) { return _this.messages.push(message); });
                        }
                        if (_this.orderId && res.order) {
                            _this.orderStatusOutput.emit(res.order.status);
                        }
                        _this.isChatActual = true;
                        _this.isChatActualChange.emit(_this.isChatActual);
                        _this._appRef.tick();
                    }, function (error) {
                    });
                };
                ChatComponent.prototype.onSubmit = function (elComment) {
                    var _this = this;
                    if (!this.form.valid) {
                        elComment.focus();
                    }
                    if (this.form.valid && !this._busy) {
                        this._busy = true;
                        this._messageService.add(this.formModel).subscribe(function (message) {
                            _this._busy = false;
                            _this.formModel.message = '';
                            _this.getLastMessages();
                        }, function (err) {
                            _this._busy = false;
                        });
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], ChatComponent.prototype, "orderId", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], ChatComponent.prototype, "corrId", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], ChatComponent.prototype, "isChatActual", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], ChatComponent.prototype, "isChatActualChange", void 0);
                __decorate([
                    core_1.Output('user'), 
                    __metadata('design:type', core_1.EventEmitter)
                ], ChatComponent.prototype, "userOutput", void 0);
                __decorate([
                    core_1.Output('order'), 
                    __metadata('design:type', core_1.EventEmitter)
                ], ChatComponent.prototype, "orderOutput", void 0);
                __decorate([
                    core_1.Output('orderStatus'), 
                    __metadata('design:type', core_1.EventEmitter)
                ], ChatComponent.prototype, "orderStatusOutput", void 0);
                ChatComponent = __decorate([
                    core_1.Component({
                        selector: 'chat',
                        templateUrl: '/client_src/tmpls/chat.html',
                        pipes: [to_date_pipe_1.ToDatePipe],
                        directives: [router_1.ROUTER_DIRECTIVES]
                    }),
                    __param(5, core_1.Inject('config.user')), 
                    __metadata('design:paramtypes', [message_service_1.MessageService, notification_service_1.NotificationService, common_1.FormBuilder, core_1.ElementRef, core_1.ApplicationRef, Object])
                ], ChatComponent);
                return ChatComponent;
            }());
            exports_1("ChatComponent", ChatComponent);
        }
    }
});
