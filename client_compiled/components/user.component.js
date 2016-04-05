System.register(['angular2/core', 'angular2/common', 'angular2/router', '../services/user/user.service', '../services/review/review.service', './user-card.component', '../pipes/to-date.pipe'], function(exports_1, context_1) {
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
    var core_1, common_1, router_1, user_service_1, review_service_1, user_card_component_1, to_date_pipe_1;
    var UserComponent;
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
            },
            function (review_service_1_1) {
                review_service_1 = review_service_1_1;
            },
            function (user_card_component_1_1) {
                user_card_component_1 = user_card_component_1_1;
            },
            function (to_date_pipe_1_1) {
                to_date_pipe_1 = to_date_pipe_1_1;
            }],
        execute: function() {
            UserComponent = (function () {
                function UserComponent(_fb, _userService, _reviewService, _routeParams, configUser) {
                    var _this = this;
                    this._fb = _fb;
                    this._userService = _userService;
                    this._reviewService = _reviewService;
                    this._routeParams = _routeParams;
                    this.configUser = configUser;
                    this.uid = '';
                    this.adminUid = '5702b5d213e381b973f9a9f8';
                    this.user = {};
                    this.reviews = [];
                    this.formModel = {};
                    this._ratings = [1, 2, 3, 4, 5];
                    this.tRating = [0, 0];
                    this.rRating = [0, 0];
                    this._inited = false;
                    this._busy = false;
                    this.editMode = false;
                    this.page = 0;
                    this.limit = 15;
                    this.fullPage = false;
                    this._busyPaging = false;
                    this.uid = this._routeParams.get('id') || '';
                    this.form = this._fb.group({
                        about: ''
                    });
                    this._userService.getById(this.uid).subscribe(function (res) {
                        _this.user = res.user || {};
                        _this.user && (_this.formModel.about = (_this.user.about || ''));
                        if (_this.user && _this.user.stats) {
                            _this.tRating = _this._reviewService.calculateRating(_this.user.stats.t_rate);
                            _this.rRating = _this._reviewService.calculateRating(_this.user.stats.r_rate);
                        }
                    }, function (error) {
                    });
                    this.loadNext();
                }
                UserComponent.prototype.onSubmit = function () {
                    var _this = this;
                    if (this.form.valid && !this._busy) {
                        this._busy = true;
                        this._userService.update(this.formModel).subscribe(function (data) {
                            if (data.user) {
                                _this.user.about = data.user.about;
                            }
                            _this._busy = false;
                            _this.editMode = false;
                        }, function (err) {
                            _this._busy = false;
                            _this.editMode = false;
                        });
                    }
                };
                UserComponent.prototype.loadNext = function () {
                    var _this = this;
                    this._busyPaging = true;
                    this._reviewService.get(this.limit, this.page).subscribe(function (data) {
                        (data.reviews || []).forEach(function (review) {
                            _this.reviews.push(review);
                        });
                        if ((data.reviews || [])[_this.limit - 1]) {
                            _this.page++;
                        }
                        else {
                            _this.fullPage = true;
                        }
                        _this._busyPaging = false;
                        _this._inited = true;
                    }, function (error) {
                        _this._busyPaging = false;
                        _this._inited = true;
                    });
                };
                UserComponent = __decorate([
                    core_1.Component({
                        templateUrl: '/client_src/tmpls/user.html',
                        directives: [router_1.ROUTER_DIRECTIVES, user_card_component_1.UserCardComponent],
                        pipes: [to_date_pipe_1.ToDatePipe]
                    }),
                    __param(4, core_1.Inject('config.user')), 
                    __metadata('design:paramtypes', [common_1.FormBuilder, user_service_1.UserService, review_service_1.ReviewService, router_1.RouteParams, Object])
                ], UserComponent);
                return UserComponent;
            }());
            exports_1("UserComponent", UserComponent);
        }
    }
});
