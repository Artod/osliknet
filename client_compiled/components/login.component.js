System.register(['angular2/core', 'angular2/common', 'angular2/router', '../services/user/user.service'], function(exports_1, context_1) {
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
                        this.error = '';
                        this._userService.login(this.model).subscribe(function (res) {
                            _this.success = true;
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
                    else {
                        $email.focus();
                    }
                };
                LoginComponent = __decorate([
                    core_1.Component({
                        selector: 'login',
                        templateUrl: '/client_src/tmpls/login.html',
                        directives: [router_1.ROUTER_DIRECTIVES],
                        pipes: []
                    }), 
                    __metadata('design:paramtypes', [common_1.FormBuilder, user_service_1.UserService])
                ], LoginComponent);
                return LoginComponent;
            }());
            exports_1("LoginComponent", LoginComponent);
        }
    }
});
