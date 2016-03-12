System.register(['angular2/core', 'angular2/common', 'angular2/router', '../services/user/user.service', '../services/review/review.service', './user-card.component', '../pipes/to-date.pipe'], function(exports_1) {
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
                    this.limit = 2;
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
                        template: "\n\n   <div *ngIf=\"!(configUser && configUser.id)\" class=\"container\">\n   \t<div class=\"page-header\">\n   \t\t<h2>User profile</h2>\n   \t</div>\n\t\n   \t<p>\n   \t\tYou are not authorized. <a [routerLink]=\"['Join']\">Create An Account</a> or <a [routerLink]=\"['Login']\">Log in</a> to an existing.\n   \t</p>\t\n   </div>\n\t\n   <div *ngIf=\"(configUser && configUser.id)\" class=\"container\">\n   \t<div class=\"page-header\">\n   \t\t<h2>Profile of <span *ngIf=\"user && user._id\">{{ user.name }}</span></h2>\n   \t</div>\n\t\n   \t<p *ngIf=\"!_inited\">Loading...</p>\n\n   \t<div *ngIf=\"user && user._id\" class=\"row\">\n   \t\t<div class=\"col-sm-3 col-xs-12\">\t\n   \t\t\t<p>\n   \t\t\t\t<img src=\"http://gravatar.com/avatar/{{ user.gravatar_hash }}?d=monsterid&s=200\" alt=\"{{ user.name }}\" width=\"100%\" />\n   \t\t\t</p>\n   \t\t\t<p>\n   \t\t\t\t<span class=\"text-muted\">Joined: {{ user.created_at | toDate | date: 'longDate' }}</span>\n   \t\t\t</p>\n   \t\t\t<p *ngIf=\"configUser.id === user._id\">\n   \t\t\t\t<a href=\"https://gravatar.com\" target=\"_blank\">Change Gravatar</a>\n   \t\t\t</p>\n\t\t\t\n   \t\t\t<p *ngIf=\"configUser.id !== user._id\">\n   \t\t\t\t<span class=\"glyphicon glyphicon-envelope\"></span>\n   \t\t\t\t<a [routerLink]=\"['Messages', {id: user._id}]\"> Send a message</a>\n   \t\t\t</p>\n\t\t\t\n   \t\t\t<p *ngIf=\"configUser.id === user._id\">\n   \t\t\t\t<span class=\"glyphicon glyphicon-envelope\"></span>\n   \t\t\t\t<a [routerLink]=\"['Dialogs']\"> My Dialogs</a>\n   \t\t\t</p>\n\n   \t\t</div>\n   \t\t<div class=\"col-sm-9 col-xs-12\">\n\n   \t\t\t<div *ngIf=\"user.stats\">\n   \t\t\t\t<h4>Statistic:</h4>\n\n   \t\t\t\t<table class=\"table\">\n   \t\t\t\t\t<tr>\n   \t\t\t\t\t\t<th colspan=\"2\">As a traveler:</th>\n   \t\t\t\t\t</tr>\n   \t\t\t\t\t<tr>\n   \t\t\t\t\t\t<td>Trips</td>\n   \t\t\t\t\t\t<td>{{ user.stats.t_cnt }}</td>\n   \t\t\t\t\t</tr>\n   \t\t\t\t\t<tr>\n   \t\t\t\t\t\t<td>Requests on delivery</td>\n   \t\t\t\t\t\t<td>{{ user.stats.t_order }}</td>\n   \t\t\t\t\t</tr>\n   \t\t\t\t\t<tr>\n   \t\t\t\t\t\t<td>Processed requests</td>\n   \t\t\t\t\t\t<td>{{ user.stats.t_proc }}</td>\n   \t\t\t\t\t</tr>\n   \t\t\t\t\t<tr>\n   \t\t\t\t\t\t<td>Rating</td>\n   \t\t\t\t\t\t<td>\n   \t\t\t\t\t\t\t {{tRating[1]}} <span class=\"star glyphicon glyphicon-star\"></span> <small>from {{tRating[0]}} rates</small>\n   \t\t\t\t\t\t</td>\n   \t\t\t\t\t</tr>\n\n   \t\t\t\t\t<tr>\n   \t\t\t\t\t\t<th colspan=\"2\">As a customer:</th>\n   \t\t\t\t\t</tr>\n   \t\t\t\t\t<tr>\n   \t\t\t\t\t\t<td>Requests on delivery</td>\n   \t\t\t\t\t\t<td>{{ user.stats.r_cnt }}</td>\n   \t\t\t\t\t</tr>\n   \t\t\t\t\t<tr>\n   \t\t\t\t\t\t<td>Processed requests</td>\n   \t\t\t\t\t\t<td>{{ user.stats.r_proc }}</td>\n   \t\t\t\t\t</tr>\n   \t\t\t\t\t<tr>\n   \t\t\t\t\t\t<td>Rating</td>\n   \t\t\t\t\t\t<td>\n   \t\t\t\t\t\t\t{{rRating[1]}} <span class=\"star glyphicon glyphicon-star\"></span> <small>from {{rRating[0]}} rates</small>\n   \t\t\t\t\t\t</td>\n   \t\t\t\t\t</tr>\n   \t\t\t\t</table>\n   \t\t\t</div>\n   \t\t</div>\n\t\t\n   \t\t<div class=\"col-xs-12\">\n   \t\t\t<h3 *ngIf=\"user && user._id && (user.about || configUser.id === user._id)\">About me</h3>\n\t\t\t\n   \t\t\t<p *ngIf=\"!editMode\" class=\"pre-wrap\">{{ user.about }}</p>\n\t\t\t\n   \t\t\t<form *ngIf=\"editMode\" action=\"/users/edit\" method=\"post\" [ngFormModel]=\"form\" (submit)=\"onSubmit()\">\n   \t\t\t\t<div class=\"form-group\">\t\t\t\t\n   \t\t\t\t\t<textarea class=\"form-control\" name=\"about\" [(ngModel)]=\"formModel.about\" [ngFormControl]=\"form.controls.about\"  maxlength=\"2000\" placeholder=\"About me\"></textarea>\n   \t\t\t\t</div>\n\t\t\t\t\n   \t\t\t\t<p class=\"text-right\">\n   \t\t\t\t\t<button class=\"btn btn-warning btn-lg\" type=\"submit\" [disabled]=\"_busy\">{{ _busy ? 'Wait...' : 'Update' }}</button>\n   \t\t\t\t\t<button class=\"btn btn-default btn-lg\" type=\"submit\" (click)=\"editMode = false\" [disabled]=\"_busy\">Cancel</button>\n   \t\t\t\t</p>\n   \t\t\t</form>\n\t\t\t\n   \t\t\t<p *ngIf=\"!editMode && configUser.id === user._id\" class=\"text-right\">\n   \t\t\t\t<button class=\"btn btn-default btn-lg\" (click)=\"editMode = true\">Edit</button>\n   \t\t\t</p>\n\t\t\n   \t\t\t<h3>Reviews</h3>\n\t\t\t\n   \t\t\t<p *ngIf=\"reviews && !reviews.length\">There are no reviews yet.</p>\n\t\t\t\n   \t\t\t<!-- <div class=\"row\" *ngFor=\"#review of reviews\">\n   \t\t\t\t<div class=\"col-xs-12\">\n\t\t\t\t\n\n\t\t\t\t\t\n   \t\t\t\t</div>\n   \t\t\t</div> -->\n\t\t\t\n   \t\t\t<table class=\"table\">\n   \t\t\t\t<tr *ngFor=\"#review of reviews\">\n   \t\t\t\t\t<td>\n   \t\t\t\t\t\t<span *ngFor=\"#rating of _ratings\" class=\"star glyphicon glyphicon-star{{ review.rating >= rating ? '' : '-empty' }}\"></span>\n\t\t\t\t\t\t\n   \t\t\t\t\t\t<p>\n   \t\t\t\t\t\t\t<user-card [user]=\"review.user\"></user-card>\n\t\t\t\t\t\t\t\n   \t\t\t\t\t\t\t<strong *ngIf=\"user._id === review.user._id\"> ({{ review.isUserTripper ? 'traveler' : 'customer' }}) </strong>\n\t\t\t\t\t\t\t\n   \t\t\t\t\t\t\tabout \n\t\t\t\t\t\t\t \n   \t\t\t\t\t\t\t<user-card [user]=\"review.corr\"></user-card>\n\t\t\t\t\t\t\t\n   \t\t\t\t\t\t\t<strong *ngIf=\"user._id === review.corr._id\"> ({{ review.isUserTripper ? 'traveler' : 'customer' }}) </strong>\t\t\t\t\t\t\n   \t\t\t\t\t\t</p>\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n   \t\t\t\t\t\t<span class=\"text-muted\">{{ review.created_at | toDate | date: 'longDate' }}</span>\t\t\t\n\n   \t\t\t\t\t\t<p class=\"pre-wrap\">{{ review.comment }}</p>\n\t\t\t\t\t\t\n   \t\t\t\t\t\t<p *ngIf=\"configUser.id === user._id\">\n   \t\t\t\t\t\t\t<a [routerLink]=\"['Order', {id: review.order}]\"> Go to the order</a>\n   \t\t\t\t\t\t</p>\n   \t\t\t\t\t</td>\n   \t\t\t\t</tr>\n   \t\t\t</table>\n\t\t\t\n   \t\t\t<p *ngIf=\"_inited && !fullPage\" class=\"text-center\">\n   \t\t\t\t<button class=\"btn btn-default btn-lg\" (click)=\"_busyPaging ? false : loadNext()\">{{ _busyPaging ? 'Wait...' : 'Load more' }}</button>\n   \t\t\t</p>\n   \t\t</div>\n   \t</div>\n   </div>\n\t",
                        directives: [router_1.ROUTER_DIRECTIVES, user_card_component_1.UserCardComponent],
                        pipes: [to_date_pipe_1.ToDatePipe]
                    }),
                    __param(4, core_1.Inject('config.user')), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof common_1.FormBuilder !== 'undefined' && common_1.FormBuilder) === 'function' && _a) || Object, (typeof (_b = typeof user_service_1.UserService !== 'undefined' && user_service_1.UserService) === 'function' && _b) || Object, (typeof (_c = typeof review_service_1.ReviewService !== 'undefined' && review_service_1.ReviewService) === 'function' && _c) || Object, (typeof (_d = typeof router_1.RouteParams !== 'undefined' && router_1.RouteParams) === 'function' && _d) || Object, Object])
                ], UserComponent);
                return UserComponent;
                var _a, _b, _c, _d;
            })();
            exports_1("UserComponent", UserComponent);
        }
    }
});