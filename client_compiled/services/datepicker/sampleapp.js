System.register(['angular2/platform/browser', 'angular2/core', './mydatepicker'], function(exports_1, context_1) {
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
    var browser_1, core_1, mydatepicker_1;
    var SampleDatePicker;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (mydatepicker_1_1) {
                mydatepicker_1 = mydatepicker_1_1;
            }],
        execute: function() {
            SampleDatePicker = (function () {
                function SampleDatePicker() {
                    this.myDatePickerOptions = {
                        todayBtnTxt: 'Today',
                        dateFormat: 'dd.mm.yyyy',
                        firstDayOfWeek: 'mo',
                        sunHighlight: true,
                        height: '34px',
                        width: '260px'
                    };
                    this.selectedDate = '20.12.2015';
                }
                SampleDatePicker.prototype.ngOnInit = function () {
                    console.log('onInit(): SampleDatePicker');
                };
                SampleDatePicker.prototype.onDateChanged = function (event) {
                    console.log('onDateChanged(): ', event.date, ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
                };
                SampleDatePicker = __decorate([
                    core_1.Component({
                        selector: 'sample-date-picker',
                        template: "<my-date-picker [options]=\"myDatePickerOptions\" (dateChanged)=\"onDateChanged($event)\" [selDate]=\"selectedDate\"></my-date-picker>",
                        directives: [mydatepicker_1.MyDatePicker]
                    }), 
                    __metadata('design:paramtypes', [])
                ], SampleDatePicker);
                return SampleDatePicker;
            }());
            browser_1.bootstrap(SampleDatePicker);
        }
    }
});