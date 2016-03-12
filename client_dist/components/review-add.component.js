System.register(['angular2/core', 'angular2/common', '../services/review/review.service'], function(exports_1) {
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
    var core_1, common_1, review_service_1;
    var ReviewAddComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (review_service_1_1) {
                review_service_1 = review_service_1_1;
            }],
        execute: function() {
            ReviewAddComponent = (function () {
                function ReviewAddComponent(_fb, _reviewService, orderId, onReviewAdd) {
                    var _this = this;
                    this._fb = _fb;
                    this._reviewService = _reviewService;
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
                }
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
                        this._reviewService.add(this.formModel).subscribe(function (data) {
                            _this.closeModal();
                            _this.onReviewAdd();
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
                ReviewAddComponent = __decorate([
                    core_1.Component({
                        template: "\n   <div class=\"page-header\">\n   \t<h2>Review on the delivery</h2>\n   </div>\n\n   <form action=\"/reviews/add\" method=\"post\" [ngFormModel]=\"form\" (submit)=\"_busy ? false : onSubmit(comment)\">\n   \t<input type=\"hidden\" name=\"order\" value=\"\" [(ngModel)]=\"formModel.order\" [ngFormControl]=\"form.controls.order\" />\n   \t<!-- http://stackoverflow.com/questions/33986633/angular-2-dependency-injection-error-on-ngfor-in-dynamically-created-component -->\n   \t<div class=\"form-group text-center\">\n   \t\t<span *ngFor=\"#rating of _ratings\" class=\"star-clickable glyphicon glyphicon-star{{ formModel.rating >= rating ? '' : '-empty' }}\" (click)=\"formModel.rating = rating\"></span>\n\t\t\n   \t\t<input type=\"hidden\" name=\"rating\" value=\"\" [(ngModel)]=\"formModel.rating\" [ngFormControl]=\"form.controls.rating\" />\n\t\n   \t\t <!-- <label class=\"radio-inline\">\n   \t\t\t<input type=\"radio\" name=\"rating\" value=\"-1\" (change)=\"onChangeRating(rate1)\" [checked]=\"formModel.rating === -1\" #rate1 /> <span class=\"glyphicon glyphicon-thumbs-down\"></span> \n   \t\t</label>\n\t\t\n   \t\t<label class=\"radio-inline\">\n   \t\t\t<input type=\"radio\" name=\"rating\" value=\"1\" (change)=\"onChangeRating(rate2)\" [checked]=\"formModel.rating === 1\" #rate2 /> <span class=\"glyphicon glyphicon-thumbs-up\"></span> \n   \t\t</label>\t\n\t\t\n   \t\t<select class=\"form-control\" required [(ngModel)]=\"formModel.order\" [ngFormControl]=\"form.controls.rating\">\n   \t\t\t<option *ngFor=\"#r of ratings\" [value]=\"r\">{{r}}</option>\n   \t\t</select>-->\t\t\n\n   \t</div>\n\t\n   \t<div class=\"form-group\">\t\t\n   \t\t<textarea class=\"form-control\" name=\"comment\" placeholder=\"Comment\" [(ngModel)]=\"formModel.comment\" [ngFormControl]=\"form.controls.comment\" maxlength=\"2000\" #comment></textarea>\n   \t</div>\n\t\n   \t<p class=\"text-right\">\n   \t\t<button type=\"submit\" class=\"btn btn-warning btn-lg\">{{ _busy ? 'Wait...' : 'Send' }}</button><!--  [disabled]=\"{{ _busy }}\" [ngFormControl]=\"form.controls.rating\"-->\n   \t\t<button class=\"btn btn-default btn-lg\" (click)=\"closeModal()\" [disabled]=\"_busy\">Cancel</button>\n   \t</p>\n\t\n   \t<div *ngIf=\"error\" class=\"help-block text-right {{error ? 'has-error' : ''}}\">\n   \t\t{{ error }}\n   \t</div>\n   </form>\n\t",
                        providers: [common_1.FormBuilder]
                    }),
                    __param(2, core_1.Inject('orderId')),
                    __param(3, core_1.Inject('onReviewAdd')), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof common_1.FormBuilder !== 'undefined' && common_1.FormBuilder) === 'function' && _a) || Object, (typeof (_b = typeof review_service_1.ReviewService !== 'undefined' && review_service_1.ReviewService) === 'function' && _b) || Object, String, Object])
                ], ReviewAddComponent);
                return ReviewAddComponent;
                var _a, _b;
            })();
            exports_1("ReviewAddComponent", ReviewAddComponent);
        }
    }
});