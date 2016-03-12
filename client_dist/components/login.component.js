System.register(['angular2/core', 'angular2/common', 'angular2/router', '../services/user/user.service'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, router_1, user_service_1;
    var LoginComponent;
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
            function (user_service_1_1) {
                user_service_1 = user_service_1_1;
            }],
        execute: function() {
            LoginComponent = (function () {
                function LoginComponent(_fb, _userService) {
                    this._fb = _fb;
                    this._userService = _userService;
                    this.model = {};
                    this._busy = false;
                    this.success = false;
                    this.error = '';
                    this.form = _fb.group({
                        email: ['', common_1.Validators.compose([
                                function (ctrl) {
                                    if (!/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(ctrl.value)) {
                                        return { invalidEmail: true };
                                    }
                                    return null;
                                },
                                common_1.Validators.required])]
                    });
                }
                LoginComponent.prototype.onSubmit = function ($email) {
                    var _this = this;
                    if (this.form.valid) {
                        this._busy = true;
                        this._userService.login(this.model).subscribe(function (res) {
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
                    else {
                        $email.focus();
                    }
                };
                LoginComponent = __decorate([
                    core_1.Component({
                        selector: 'login',
                        template: "\n   <div class=\"container container-join\">\n   \t<div class=\"page-header\">\n   \t\t<h2>Log in</h2>\n   \t</div>\n\t\n   \t<p *ngIf=\"success\">\n   \t\t<i>A link to access has been sent to your email address. Please check your email inbox.</i>\n   \t</p>\n\n   \t<form *ngIf=\"!success\" class=\"{{error ? 'has-error' : ''}}\" method=\"post\" [ngFormModel]=\"form\" (submit)=\"_busy ? false : onSubmit(email)\" novalidate>\n   \t\t<div class=\"form-group\">\n   \t\t\t<label class=\"sr-only\">E-mail</label>\n   \t\t\t<input class=\"form-control input-lg email\" type=\"email\" name=\"email\" [(ngModel)]=\"model.email\" [ngFormControl]=\"form.controls.email\" placeholder=\"E-mail\" #email />\n   \t\t</div>\n   \t\t<div class=\"help-block text-right\">\n   \t\t\tDon't have an account? - <a [routerLink]=\"['Join']\">Sign up \u00BB</a>\n   \t\t</div>\t\t\n   \t\t<div *ngIf=\"error\" class=\"help-block\">\n   \t\t\t{{ error }}\n   \t\t</div>\n\t\t\n   \t\t<div class=\"form-group text-right\">\n   \t\t\t<button type=\"submit\" class=\"btn btn-warning btn-lg\">{{ _busy ? 'Wait..' : 'Log in' }}</button>\n   \t\t</div>\n\t\t\n\n   \t</form>\n   </div>\n\t",
                        directives: [router_1.ROUTER_DIRECTIVES],
                        pipes: []
                    }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof common_1.FormBuilder !== 'undefined' && common_1.FormBuilder) === 'function' && _a) || Object, (typeof (_b = typeof user_service_1.UserService !== 'undefined' && user_service_1.UserService) === 'function' && _b) || Object])
                ], LoginComponent);
                return LoginComponent;
                var _a, _b;
            })();
            exports_1("LoginComponent", LoginComponent);
        }
    }
});