System.register(['angular2/core', 'angular2/common'], function(exports_1, context_1) {
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
    var core_1, common_1;
    var CaptchaComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            }],
        execute: function() {
            CaptchaComponent = (function () {
                function CaptchaComponent(configCaptcha, _el) {
                    this.configCaptcha = configCaptcha;
                    this._el = _el;
                    this.needReloadCaptchaChange = new core_1.EventEmitter();
                    this.modelChange = new core_1.EventEmitter();
                }
                CaptchaComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.interval = window.setInterval(function () {
                        _this.checkLoaded();
                    }, 100);
                    this.checkLoaded();
                };
                CaptchaComponent.prototype.ngOnDestroy = function () {
                    if (this.interval) {
                        window.clearInterval(this.interval);
                    }
                };
                CaptchaComponent.prototype.checkLoaded = function () {
                    if (this.configCaptcha.loaded) {
                        window.clearInterval(this.interval);
                        this.interval = null;
                        this.init();
                    }
                };
                CaptchaComponent.prototype.ngOnChanges = function (changes) {
                    if (changes.needReloadCaptcha && !changes.needReloadCaptcha.isFirstChange()) {
                        this.reset();
                    }
                };
                CaptchaComponent.prototype.reset = function () {
                    window.grecaptcha.reset(this.captchaId);
                    this.needReloadCaptcha = false;
                    this.needReloadCaptchaChange.emit(this.needReloadCaptcha);
                };
                CaptchaComponent.prototype.init = function () {
                    var _this = this;
                    var $el = this._el.nativeElement.querySelector('.g-recaptcha');
                    $el.innerHTML = '';
                    this.modelChange.emit('');
                    this.model = '';
                    this.captchaId = window.grecaptcha.render($el, {
                        sitekey: this.configCaptcha.key,
                        theme: 'light',
                        callback: function (response) {
                            _this.modelChange.emit(response);
                            _this.model = response;
                        },
                        'expired-callback': function (response) {
                            _this.modelChange.emit('');
                            _this.model = response;
                        }
                    });
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', common_1.Control)
                ], CaptchaComponent.prototype, "ctrl", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], CaptchaComponent.prototype, "model", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], CaptchaComponent.prototype, "needReloadCaptcha", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], CaptchaComponent.prototype, "needReloadCaptchaChange", void 0);
                __decorate([
                    core_1.Output('modelChange'), 
                    __metadata('design:type', core_1.EventEmitter)
                ], CaptchaComponent.prototype, "modelChange", void 0);
                CaptchaComponent = __decorate([
                    core_1.Component({
                        selector: 'captcha',
                        template: "\n\t\t<input name=\"recaptcha\" type=\"hidden\" [(ngModel)]=\"model\" [ngFormControl]=\"ctrl\" value=\"\" />\n\t\t<div class=\"g-recaptcha\">Loading captcha...</div>\n\t"
                    }),
                    __param(0, core_1.Inject('config.captcha')), 
                    __metadata('design:paramtypes', [Object, core_1.ElementRef])
                ], CaptchaComponent);
                return CaptchaComponent;
            }());
            exports_1("CaptchaComponent", CaptchaComponent);
        }
    }
});
