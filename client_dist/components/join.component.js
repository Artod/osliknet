System.register(['angular2/core', 'angular2/common', 'angular2/router', './captcha.component', '../services/user/user.service'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, router_1, captcha_component_1, user_service_1;
    var JoinComponent;
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
            function (captcha_component_1_1) {
                captcha_component_1 = captcha_component_1_1;
            },
            function (user_service_1_1) {
                user_service_1 = user_service_1_1;
            }],
        execute: function() {
            JoinComponent = (function () {
                function JoinComponent(_fb, _userService) {
                    this._fb = _fb;
                    this._userService = _userService;
                    this.model = {};
                    this._busy = false;
                    this.submitted = false;
                    this.success = false;
                    this.error = '';
                    this.form = _fb.group({
                        name: ['', common_1.Validators.compose([
                                function (ctrl) {
                                    if (ctrl.value && ctrl.value.replace(/^\s\s*/, '').replace(/\s\s*$/, '') === '') {
                                        return { emptyName: true };
                                    }
                                    return null;
                                },
                                common_1.Validators.required,
                                function (ctrl) {
                                    if (ctrl.value && !/^[a-z0-9-_ ]+$/i.test(ctrl.value)) {
                                        return { invalidName: true };
                                    }
                                    return null;
                                }
                            ])],
                        email: ['', common_1.Validators.compose([
                                common_1.Validators.required,
                                function (ctrl) {
                                    if (ctrl.value && !/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(ctrl.value)) {
                                        return { invalidEmail: true };
                                    }
                                    return null;
                                }])],
                        recaptcha: ['', common_1.Validators.required]
                    });
                }
                JoinComponent.prototype.onSubmit = function ($name, $email) {
                    var _this = this;
                    this.submitted = true;
                    if (!this.form.controls.name.valid) {
                        $name.focus();
                        return;
                    }
                    if (!this.form.controls.email.valid) {
                        $email.focus();
                        return;
                    }
                    if (this.form.valid) {
                        this._busy = true;
                        this._userService.signup(this.model).subscribe(function (res) {
                            _this.success = true;
                            _this.error = '';
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
                JoinComponent = __decorate([
                    core_1.Component({
                        selector: 'join',
                        template: "\n   <div class=\"container container-join\">\n   \t<div class=\"page-header\">\n   \t\t<h2>Sign up</h2>\n   \t</div>\n\t\n   \t<p *ngIf=\"success\">\n   \t\t<i>A link to access has been sent to your email address. Please check your email inbox.</i>\n   \t</p>\n\n   \t<form *ngIf=\"!success\" method=\"post\" [ngFormModel]=\"form\" (submit)=\"_busy ? false : onSubmit(name, email)\" novalidate>\n   \t\t<div class=\"form-group {{form.controls.name.touched && !form.controls.name.valid ? 'has-error' : ''}}\">\n   \t\t\t<label class=\"sr-only\">Name</label>\n\t\t\t\n   \t\t\t<input class=\"form-control input-lg\" type=\"text\" name=\"name\" [(ngModel)]=\"model.name\" [ngFormControl]=\"form.controls.name\" placeholder=\"Name (latin letters only)\" maxlength=\"50\" #name />\n\t\t\t\n   \t\t\t<p *ngIf=\"form.controls.name.errors && form.controls.name.errors.invalidName\" class=\"help-block\">\n   \t\t\t\tLatin letters only.\n   \t\t\t</p>\n\t\t\t\n   \t\t\t<p *ngIf=\"form.controls.name.errors && form.controls.name.errors.emptyName\" class=\"help-block\">\n   \t\t\t\tEmpty name\n   \t\t\t</p>\n\t\t\t\n   \t\t</div>\n\n   \t\t<div class=\"form-group {{form.controls.email.touched && !form.controls.email.valid ? 'has-error' : ''}}\">\n   \t\t\t<label class=\"sr-only\">E-mail</label>\n\n   \t\t\t<input class=\"form-control input-lg\" type=\"email\" name=\"email\" [(ngModel)]=\"model.email\" [ngFormControl]=\"form.controls.email\" placeholder=\"E-mail\" #email />\n\t\t\t\n   \t\t\t<p *ngIf=\"form.controls.email.touched && form.controls.email.errors && form.controls.email.errors.invalidEmail\" class=\"help-block\">\n   \t\t\t\tE-mail is not valid.\n   \t\t\t</p>\n   \t\t</div>\n\t\t\n   \t\t<div class=\"form-group text-right {{submitted && model.recaptcha === '' ? 'has-error' : ''}}\">\n   \t\t\t<captcha [ctrl]=\"form.controls.recaptcha\" [(model)]=\"model.recaptcha\"></captcha>\n   \t\t</div>\n   \t\t<div class=\"help-block text-right\">\n   \t\t\tAlready have an account? - <a [routerLink]=\"['Login']\">Log in \u00BB</a>\n   \t\t</div>\t\t\n   \t\t<div class=\"form-group text-right\">\n   \t\t\t<button type=\"submit\" class=\"btn btn-warning btn-lg\">{{ _busy ? 'Wait..' : 'Sign up' }}</button>\n   \t\t</div>\n\t\t\n   \t\t<div *ngIf=\"error\" class=\"help-block text-right {{error ? 'has-error' : ''}}\">\n   \t\t\t{{ error }}\n   \t\t</div>\n\t\t\n\n\t\t\n   \t</form>\n   </div>\n\t",
                        directives: [router_1.ROUTER_DIRECTIVES, captcha_component_1.CaptchaComponent],
                        pipes: []
                    }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof common_1.FormBuilder !== 'undefined' && common_1.FormBuilder) === 'function' && _a) || Object, (typeof (_b = typeof user_service_1.UserService !== 'undefined' && user_service_1.UserService) === 'function' && _b) || Object])
                ], JoinComponent);
                return JoinComponent;
                var _a, _b;
            })();
            exports_1("JoinComponent", JoinComponent);
        }
    }
});