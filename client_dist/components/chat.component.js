System.register(['angular2/core', 'angular2/router', 'angular2/common', '../services/message/message.service', '../services/notification/notification.service', '../pipes/to-date.pipe'], function(exports_1) {
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
                        console.log('ngOnChangesngOnChangesngOnChanges', changes.isChatActual);
                        this.getLastMessages();
                    }
                };
                ChatComponent.prototype.ngOnDestroy = function () {
                    this._notificationService.changeTimeout();
                    this._notifSub.unsubscribe();
                };
                ChatComponent.prototype.ngAfterViewChecked = function () {
                    console.log('Chat ngAfterViewChecked');
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
                    console.log('setsetsetsetsetsetsetsetsetsetsetset this.elChatList.scrollHeight = ', this.elChatList.scrollHeight);
                };
                ChatComponent.prototype.expand = function (listTop) {
                    console.log('expandexpandexpandexpandexpandexpandexpan');
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
                        console.dir(error);
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
                    __metadata('design:type', (typeof (_a = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _a) || Object)
                ], ChatComponent.prototype, "isChatActualChange", void 0);
                __decorate([
                    core_1.Output('user'), 
                    __metadata('design:type', (typeof (_b = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _b) || Object)
                ], ChatComponent.prototype, "userOutput", void 0);
                __decorate([
                    core_1.Output('order'), 
                    __metadata('design:type', (typeof (_c = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _c) || Object)
                ], ChatComponent.prototype, "orderOutput", void 0);
                __decorate([
                    core_1.Output('orderStatus'), 
                    __metadata('design:type', (typeof (_d = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _d) || Object)
                ], ChatComponent.prototype, "orderStatusOutput", void 0);
                ChatComponent = __decorate([
                    core_1.Component({
                        selector: 'chat',
                        template: "\n   <div class=\"chat-list\" (window:resize)=\"expand()\"> <!-- [scrollTop]=\"scrollHeight\" [style.maxHeight]=\"height\"  [style.maxHeight]=\"maxHeight\"postRender=\"scrollDown()\"-->\n\t\n   \t<table class=\"table {{ message.user._id === configUser.id ? 'chat-message-my' : '' }}\" *ngFor=\"#message of messages; #idx = index;\" >\n   \t\t<tr>\n   \t\t\t<td class=\"chat-avatar avatar\">\n   \t\t\t\t<img src=\"http://gravatar.com/avatar/{{ message.user.gravatar_hash }}?d=monsterid\" alt=\"{{ message.user.name }}\" width=\"40px\" height=\"40px\" />\n   \t\t\t</td>\n   \t\t\t<td>\n   \t\t\t\t<div class=\"chat-message-info\">\n   \t\t\t\t\t<b>{{ message.user.name }}</b>\n   \t\t\t\t\t<small>\n   \t\t\t\t\t\t<small class=\"text-muted\">{{ message.created_at | toDate | date: 'mm:HH d MMM y' }}</small>\n   \t\t\t\t\t</small>\n   \t\t\t\t</div>\n\n   \t\t\t\t<p class=\"pre-wrap\">{{ message.message }}</p>\n   \t\t\t</td>\n   \t\t</tr>\n   \t</table>\n   </div>\n\n   <div class=\"chat-textarea\">\n   \t<form action=\"/messages/add\" method=\"post\" [ngFormModel]=\"form\" (submit)=\"onSubmit(elComment)\"> <!--  -->\n   \t\t<input *ngIf=\"orderId\" name=\"order\" type=\"hidden\" [(ngModel)]=\"formModel.order\" [ngFormControl]=\"form.controls.order\" />\n   \t\t<input *ngIf=\"corrId\" name=\"corr\" type=\"hidden\" [(ngModel)]=\"formModel.corr\" [ngFormControl]=\"form.controls.corr\" />\n\t\t\n   \t\t<div class=\"form-group\">\t\t\t\n   \t\t\t<textarea class=\"form-control\" name=\"message\" [(ngModel)]=\"formModel.message\" [ngFormControl]=\"form.controls.message\" placeholder=\"Message\" maxlength=\"1000\" #elComment></textarea>\n   \t\t</div>\n\t\t\n   \t\t<p class=\"text-right\">\n   \t\t\t<button type=\"submit\" class=\"btn btn-warning btn-lg\" [disabled]=\"_busy\">{{ _busy ? 'Wait...' : 'Send' }}</button>\n   \t\t</p>\n   \t</form>\n   </div>\n\t",
                        pipes: [to_date_pipe_1.ToDatePipe],
                        directives: [router_1.ROUTER_DIRECTIVES]
                    }),
                    __param(5, core_1.Inject('config.user')), 
                    __metadata('design:paramtypes', [(typeof (_e = typeof message_service_1.MessageService !== 'undefined' && message_service_1.MessageService) === 'function' && _e) || Object, (typeof (_f = typeof notification_service_1.NotificationService !== 'undefined' && notification_service_1.NotificationService) === 'function' && _f) || Object, (typeof (_g = typeof common_1.FormBuilder !== 'undefined' && common_1.FormBuilder) === 'function' && _g) || Object, (typeof (_h = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _h) || Object, (typeof (_j = typeof core_1.ApplicationRef !== 'undefined' && core_1.ApplicationRef) === 'function' && _j) || Object, Object])
                ], ChatComponent);
                return ChatComponent;
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            })();
            exports_1("ChatComponent", ChatComponent);
        }
    }
});