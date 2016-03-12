System.register(['angular2/core', 'angular2/common', 'angular2/router', '../services/datepicker/mydatepicker', '../services/trip/trip.service', './gm-autocomplite.component'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, router_1, mydatepicker_1, trip_service_1, gm_autocomplite_component_1;
    var TripAddComponent;
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
            function (mydatepicker_1_1) {
                mydatepicker_1 = mydatepicker_1_1;
            },
            function (trip_service_1_1) {
                trip_service_1 = trip_service_1_1;
            },
            function (gm_autocomplite_component_1_1) {
                gm_autocomplite_component_1 = gm_autocomplite_component_1_1;
            }],
        execute: function() {
            TripAddComponent = (function () {
                function TripAddComponent(_fb, _router, _tripService) {
                    this._fb = _fb;
                    this._router = _router;
                    this._tripService = _tripService;
                    this.model = {};
                    this.myDatePickerOptions = {
                        dateFormat: 'dd.mm.yyyy',
                        firstDayOfWeek: 'mo',
                        sunHighlight: true,
                        minDate: new Date()
                    };
                    this.selectedDate = '';
                    this._busy = false;
                    this.error = '';
                    this.form = _fb.group({
                        from: ['', common_1.Validators.required],
                        from_id: ['', common_1.Validators.required],
                        to: ['', common_1.Validators.required],
                        to_id: ['', common_1.Validators.required],
                        when: ['', common_1.Validators.required],
                        description: ['', common_1.Validators.required]
                    });
                }
                TripAddComponent.prototype.onSubmit = function ($from, $to, $when, $description) {
                    var _this = this;
                    console.dir($from);
                    if (!this.model.from_id) {
                        $from.querySelector('input[type="text"]').focus();
                        return;
                    }
                    if (!this.model.to_id) {
                        $to.querySelector('input[type="text"]').focus();
                        return;
                    }
                    if (!this.model.when) {
                        $when.querySelector('input[type="text"]').focus();
                        return;
                    }
                    if (!this.model.description) {
                        $description.focus();
                        return;
                    }
                    if (this.form.valid) {
                        this._busy = true;
                        this._tripService.addTrips(this.model).subscribe(function (res) {
                            if (res.trip && res.trip._id)
                                _this._router.navigate(['Trip', { id: res.trip._id }]);
                            else
                                _this.error = 'Unexpected error. Try again later.';
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
                TripAddComponent.prototype.onDateChanged = function (event) {
                    this.form.controls.when._touched = true;
                    this.model.when = event.epoc * 1000;
                };
                TripAddComponent = __decorate([
                    core_1.Component({
                        template: "\n   <div class=\"container container-trips-add\">\n   \t<div class=\"page-header\">\n   \t\t<h2>Add a Trip</h2>\n   \t</div>\n\n   \t<form class=\"trips-add-form\" method=\"post\" [ngFormModel]=\"form\" (submit)=\"_busy ? false : onSubmit(from, to, when, description)\">\n\t\t\n   \t\t<div class=\"form-group\">\n   \t\t\t<label>Trip:</label>\n\n   \t\t\t<div class=\"form-inline\">\n   \t\t\t\t<div class=\"form-group\" #from><!--  {{form.controls.from.touched && model.from_id === '' ? 'has-error' : ''}} -->\n   \t\t\t\t\t<gm-autocomplite [class]=\"'form-control input-lg'\" [name_place]=\"'from'\" [name_id]=\"'from_id'\" [form]=\"form\" [model]=\"model\" placeholder=\"From\"></gm-autocomplite>\n   \t\t\t\t</div>\n\t\t\t\t\n   \t\t\t\t<div class=\"arrow-right form-group\">\n   \t\t\t\t\t<span class=\"glyphicon glyphicon-arrow-right\"></span>\n   \t\t\t\t</div>\n\n   \t\t\t\t<div class=\"form-group\" #to>\t<!--  {{form.controls.to.touched && model.to_id === '' ? 'has-error' : ''}} -->\n   \t\t\t\t\t<gm-autocomplite [class]=\"'form-control input-lg'\" [name_place]=\"'to'\" [name_id]=\"'to_id'\" [form]=\"form\" [model]=\"model\" placeholder=\"To\"></gm-autocomplite>\n   \t\t\t\t</div>\t\n   \t\t\t</div>\n   \t\t</div>\n\t\t\n   \t\t<div class=\"form-group\" #when>\t\n   \t\t\t<label>When:</label>\n\t\t\t\n   \t\t\t<my-date-picker [options]=\"myDatePickerOptions\" (dateChanged)=\"onDateChanged($event)\" [selDate]=\"selectedDate\" ></my-date-picker>\n\t\t\t\n   \t\t\t<input type=\"hidden\" [(ngModel)]=\"model.when\" [ngFormControl]=\"form.controls.when\" />\n   \t\t</div>\n\n   \t\t<div class=\"form-group\">\t\n   \t\t\t<label class=\"sr-only\">Description:</label>\n\t\t\t\n   \t\t\t<textarea class=\"form-control\" name=\"description\" [(ngModel)]=\"model.description\" [ngFormControl]=\"form.controls.description\" maxlength=\"2000\" placeholder=\"Description\" #description></textarea>\n   \t\t</div>\n\t\t\n   \t\t<p class=\"text-right\">\n   \t\t\t<button type=\"submit\" class=\"btn btn-warning input-lg\">{{ _busy ? 'Wait...' : 'Add' }}</button>\n   \t\t</p>\n\t\t\n   \t\t<div *ngIf=\"error\" class=\"help-block text-right {{error ? 'has-error' : ''}}\">\n   \t\t\t{{ error }}\n   \t\t</div>\n\t\t\n   \t</form>\n   </div>\n\t",
                        directives: [gm_autocomplite_component_1.GmAutocompliteComponent, common_1.FORM_DIRECTIVES, common_1.CORE_DIRECTIVES, mydatepicker_1.MyDatePicker]
                    }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof common_1.FormBuilder !== 'undefined' && common_1.FormBuilder) === 'function' && _a) || Object, (typeof (_b = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _b) || Object, (typeof (_c = typeof trip_service_1.TripService !== 'undefined' && trip_service_1.TripService) === 'function' && _c) || Object])
                ], TripAddComponent);
                return TripAddComponent;
                var _a, _b, _c;
            })();
            exports_1("TripAddComponent", TripAddComponent);
        }
    }
});