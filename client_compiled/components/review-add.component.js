System.register(['angular2/core', 'angular2/common', 'angular2/router', '../services/review/review.service'], function(exports_1, context_1) {
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
    var core_1, common_1, router_1, review_service_1;
    var ReviewAddComponent;
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
            function (review_service_1_1) {
                review_service_1 = review_service_1_1;
            }],
        execute: function() {
            ReviewAddComponent = (function () {
                function ReviewAddComponent(_fb, _reviewService, _location, orderId, onReviewAdd) {
                    var _this = this;
                    this._fb = _fb;
                    this._reviewService = _reviewService;
                    this._location = _location;
                    this.orderId = orderId;
                    this.onReviewAdd = onReviewAdd;
                    this.formModel = {};
                    this._ratings = [1, 2, 3, 4, 5];
                    this.error = '';
                    this.form = this._fb.group({
                        order: ['', common_1.Validators.required],
                        rating: ['', common_1.Validators.required],
                        comment: ['', common_1.Validators.required]
                    });
                    this.formModel.rating = 5;
                    this.formModel.order = this.orderId;
                    this._busy = true;
                    this._reviewService.getByOrderId(this.orderId).subscribe(function (data) {
                        if (data.review && data.review._id) {
                            _this.formModel = data.review;
                        }
                        _this._busy = false;
                    }, function (err) {
                        _this._busy = false;
                    });
                    this._locationSubscribe = this._location.subscribe(function () {
                        _this.closeModal();
                    });
                }
                ReviewAddComponent.prototype.ngOnDestroy = function () {
                    this._locationSubscribe.unsubscribe();
                };
                ReviewAddComponent.prototype.closeModal = function () {
                    this._modalComponent && this._modalComponent.close();
                };
                ReviewAddComponent.prototype.onChangeRating = function (el) {
                    if (el.checked) {
                        this.formModel.rating = el.value;
                    }
                };
                ReviewAddComponent.prototype.onSubmit = function (elComment) {
                    var _this = this;
                    if (!this.form.valid) {
                        elComment.focus();
                    }
                    if (this.form.valid && !this._busy) {
                        this._busy = true;
                        this.error = '';
                        this._reviewService.add(this.formModel).subscribe(function (data) {
                            _this.closeModal();
                            _this.onReviewAdd();
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
                };
                ReviewAddComponent = __decorate([
                    core_1.Component({
                        templateUrl: '/client_src/tmpls/review-add.html',
                        providers: [common_1.FormBuilder]
                    }),
                    __param(3, core_1.Inject('orderId')),
                    __param(4, core_1.Inject('onReviewAdd')), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof common_1.FormBuilder !== 'undefined' && common_1.FormBuilder) === 'function' && _a) || Object, (typeof (_b = typeof review_service_1.ReviewService !== 'undefined' && review_service_1.ReviewService) === 'function' && _b) || Object, (typeof (_c = typeof router_1.Location !== 'undefined' && router_1.Location) === 'function' && _c) || Object, String, Object])
                ], ReviewAddComponent);
                return ReviewAddComponent;
                var _a, _b, _c;
            }());
            exports_1("ReviewAddComponent", ReviewAddComponent);
        }
    }
});