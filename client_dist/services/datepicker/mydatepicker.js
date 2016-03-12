System.register(['angular2/core', 'angular2/common'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1;
    var MyDatePicker;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            }],
        execute: function() {
            MyDatePicker = (function () {
                function MyDatePicker(elem) {
                    var _this = this;
                    this.elem = elem;
                    this.dateChanged = new core_1.EventEmitter();
                    this.showSelector = false;
                    this.visibleMonth = { monthTxt: '', monthNbr: 0, year: 0 };
                    this.selectedDate = { year: 0, month: 0, day: 0 };
                    this.weekDays = [];
                    this.dates = [];
                    this.selectionDayTxt = '';
                    this.dayIdx = 0;
                    this.today = null;
                    this.PREV_MONTH = 1;
                    this.CURR_MONTH = 2;
                    this.NEXT_MONTH = 3;
                    this.dayLabels = { su: 'Sun', mo: 'Mon', tu: 'Tue', we: 'Wed', th: 'Thu', fr: 'Fri', sa: 'Sat' };
                    this.monthLabels = { 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec' };
                    this.dateFormat = 'yyyy-mm-dd';
                    this.todayBtnTxt = 'Today';
                    this.firstDayOfWeek = 'mo';
                    this.sunHighlight = true;
                    this.height = '34px';
                    this.width = '100%';
                    this.minDate = 0;
                    this.today = new Date();
                    var doc = document.getElementsByTagName('html')[0];
                    doc.addEventListener('click', function (event) {
                        if (_this.showSelector && event.target && _this.elem.nativeElement !== event.target && !_this.elem.nativeElement.contains(event.target)) {
                            _this.showSelector = false;
                        }
                    }, false);
                }
                MyDatePicker.prototype.ngOnInit = function () {
                    this.dayLabels = this.options.dayLabels !== undefined ? this.options.dayLabels : this.dayLabels;
                    this.monthLabels = this.options.monthLabels !== undefined ? this.options.monthLabels : this.monthLabels;
                    this.dateFormat = this.options.dateFormat !== undefined ? this.options.dateFormat : this.dateFormat;
                    this.todayBtnTxt = this.options.todayBtnTxt !== undefined ? this.options.todayBtnTxt : this.todayBtnTxt;
                    this.firstDayOfWeek = this.options.firstDayOfWeek !== undefined ? this.options.firstDayOfWeek : this.firstDayOfWeek;
                    this.sunHighlight = this.options.sunHighlight !== undefined ? this.options.sunHighlight : this.sunHighlight;
                    this.height = this.options.height !== undefined ? this.options.height : this.height;
                    this.width = this.options.width !== undefined ? this.options.width : this.width;
                    if (this.options.minDate) {
                        this.minDate = (new Date(this.options.minDate.getFullYear(), this.options.minDate.getMonth(), this.options.minDate.getDate())).getTime();
                    }
                    var days = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
                    this.dayIdx = days.indexOf(this.firstDayOfWeek);
                    if (this.dayIdx !== -1) {
                        var idx = this.dayIdx;
                        for (var i = 0; i < days.length; i++) {
                            this.weekDays.push(this.dayLabels[days[idx]]);
                            idx = days[idx] === 'sa' ? 0 : idx + 1;
                        }
                    }
                };
                MyDatePicker.prototype.ngOnChanges = function (changes) {
                    this.selectionDayTxt = changes['selDate'].currentValue;
                    if (this.selectionDayTxt !== '') {
                        var fmt = this.options.dateFormat !== undefined ? this.options.dateFormat : this.dateFormat;
                        var dpos = fmt.indexOf('dd');
                        var mpos = fmt.indexOf('mm');
                        var ypos = fmt.indexOf('yyyy');
                        this.selectedDate = { day: parseInt(this.selectionDayTxt.substring(dpos, dpos + 2)),
                            month: parseInt(this.selectionDayTxt.substring(mpos, mpos + 2)),
                            year: parseInt(this.selectionDayTxt.substring(ypos, ypos + 4)) };
                    }
                };
                MyDatePicker.prototype.removeBtnClicked = function () {
                    this.selectionDayTxt = '';
                    this.selectedDate = { year: 0, month: 0, day: 0 };
                    this.dateChanged.emit({ date: {}, formatted: this.selectionDayTxt, epoc: 0 });
                };
                MyDatePicker.prototype.openBtnClicked = function () {
                    this.showSelector = !this.showSelector;
                    if (this.showSelector) {
                        var y = 0, m = 0;
                        if (this.selectedDate.year === 0 && this.selectedDate.month === 0 && this.selectedDate.day === 0) {
                            y = this.today.getFullYear();
                            m = this.today.getMonth() + 1;
                        }
                        else {
                            y = this.selectedDate.year;
                            m = this.selectedDate.month;
                        }
                        this.visibleMonth = { monthTxt: this.monthLabels[m], monthNbr: m, year: y };
                        this.createMonth(m, y);
                    }
                };
                MyDatePicker.prototype.prevMonth = function () {
                    var m = this.visibleMonth.monthNbr;
                    var y = this.visibleMonth.year;
                    if (m === 1) {
                        m = 12;
                        y--;
                    }
                    else {
                        m--;
                    }
                    this.visibleMonth = { monthTxt: this.monthText(m), monthNbr: m, year: y };
                    this.createMonth(m, y);
                };
                MyDatePicker.prototype.nextMonth = function () {
                    var m = this.visibleMonth.monthNbr;
                    var y = this.visibleMonth.year;
                    if (m === 12) {
                        m = 1;
                        y++;
                    }
                    else {
                        m++;
                    }
                    this.visibleMonth = { monthTxt: this.monthText(m), monthNbr: m, year: y };
                    this.createMonth(m, y);
                };
                MyDatePicker.prototype.prevYear = function () {
                    this.visibleMonth.year--;
                    this.createMonth(this.visibleMonth.monthNbr, this.visibleMonth.year);
                };
                MyDatePicker.prototype.nextYear = function () {
                    this.visibleMonth.year++;
                    this.createMonth(this.visibleMonth.monthNbr, this.visibleMonth.year);
                };
                MyDatePicker.prototype.todayClicked = function () {
                    this.selectDate({ day: this.today.getDate(), month: this.today.getMonth() + 1, year: this.today.getFullYear() });
                };
                MyDatePicker.prototype.cellClicked = function (cell) {
                    if (cell.isOutOfRange) {
                        return;
                    }
                    if (cell.cmo === this.PREV_MONTH) {
                        this.prevMonth();
                        this.selectDate(cell);
                    }
                    else if (cell.cmo === this.CURR_MONTH) {
                        this.selectDate(cell);
                    }
                    else if (cell.cmo === this.NEXT_MONTH) {
                        this.nextMonth();
                        this.selectDate(cell);
                    }
                };
                MyDatePicker.prototype.selectDate = function (date) {
                    this.selectedDate = { day: date.day, month: date.month, year: date.year };
                    this.selectionDayTxt = this.formatDate(date);
                    this.showSelector = false;
                    var epoc = new Date(date.year, date.month - 1, date.day, 0, 0, 0, 0).getTime() / 1000.0;
                    this.dateChanged.emit({ date: this.selectedDate, formatted: this.selectionDayTxt, epoc: epoc });
                };
                MyDatePicker.prototype.preZero = function (val) {
                    return val < 10 ? '0' + val : val;
                };
                MyDatePicker.prototype.formatDate = function (val) {
                    return this.dateFormat.replace('yyyy', val.year)
                        .replace('mm', this.preZero(val.month))
                        .replace('dd', this.preZero(val.day));
                };
                MyDatePicker.prototype.monthText = function (m) {
                    return this.monthLabels[m];
                };
                MyDatePicker.prototype.monthStartIdx = function (y, m) {
                    var d = new Date();
                    d.setDate(1);
                    d.setMonth(m - 1);
                    d.setFullYear(y);
                    var idx = d.getDay() + this.sundayIdx();
                    return idx >= 7 ? idx - 7 : idx;
                };
                MyDatePicker.prototype.daysInMonth = function (m, y) {
                    return new Date(y, m, 0).getDate();
                };
                MyDatePicker.prototype.daysInPrevMonth = function (m, y) {
                    if (m === 1) {
                        m = 12;
                        y--;
                    }
                    else {
                        m--;
                    }
                    return this.daysInMonth(m, y);
                };
                MyDatePicker.prototype.isOutOfRange = function (d, m, y, cmo) {
                    var timestamp = new Date(y, m - 1, d).getTime();
                    return this.minDate && timestamp < this.minDate;
                };
                MyDatePicker.prototype.isCurrDay = function (d, m, y, cmo) {
                    return d === this.today.getDate() && m === this.today.getMonth() + 1 && y === this.today.getFullYear() && cmo === 2;
                };
                MyDatePicker.prototype.sundayIdx = function () {
                    return this.dayIdx > 0 ? 7 - this.dayIdx : 0;
                };
                MyDatePicker.prototype.createMonth = function (m, y) {
                    this.dates.length = 0;
                    var monthStart = this.monthStartIdx(y, m);
                    var dInThisM = this.daysInMonth(m, y);
                    var dInPrevM = this.daysInPrevMonth(m, y);
                    var sunIdx = this.sundayIdx();
                    var dayNbr = 1;
                    var cmo = this.PREV_MONTH;
                    for (var i = 1; i < 7; i++) {
                        var week = [];
                        if (i === 1) {
                            var pm = dInPrevM - monthStart + 1;
                            m--;
                            if (m < 1) {
                                m = 12;
                                y--;
                            }
                            for (var j = pm; j <= dInPrevM; j++) {
                                week.push({ day: j, month: m, year: y, cmo: cmo, isOutOfRange: this.isOutOfRange(j, m, y), currDay: this.isCurrDay(j, m, y, cmo), sun: week.length === sunIdx });
                            }
                            cmo = this.CURR_MONTH;
                            m++;
                            if (m > 12) {
                                m = 1;
                                y++;
                            }
                            var daysLeft = 7 - week.length;
                            for (var j = 0; j < daysLeft; j++) {
                                week.push({ day: dayNbr, month: m, year: y, cmo: cmo, isOutOfRange: this.isOutOfRange(dayNbr, m, y), currDay: this.isCurrDay(dayNbr, m, y, cmo), sun: week.length === sunIdx });
                                dayNbr++;
                            }
                        }
                        else {
                            for (var j = 1; j < 8; j++) {
                                if (dayNbr > dInThisM && cmo !== this.NEXT_MONTH) {
                                    dayNbr = 1;
                                    cmo = this.NEXT_MONTH;
                                    m++;
                                    if (m > 12) {
                                        m = 1;
                                        y++;
                                    }
                                }
                                week.push({ day: dayNbr, month: m, year: y, cmo: cmo, isOutOfRange: this.isOutOfRange(dayNbr, m, y), currDay: this.isCurrDay(dayNbr, m, y, cmo), sun: week.length === sunIdx });
                                dayNbr++;
                            }
                        }
                        this.dates.push(week);
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], MyDatePicker.prototype, "options", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], MyDatePicker.prototype, "selDate", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', (typeof (_a = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _a) || Object)
                ], MyDatePicker.prototype, "dateChanged", void 0);
                MyDatePicker = __decorate([
                    core_1.Component({
                        selector: 'my-date-picker'
                    }),
                    core_1.View({
                        template: "\n      <div class=\"mydp\">\n      \t<!-- [ngStyle]=\"{'height': height, 'width': width}\" -->\n      \t<div class=\"input-group\">\n      \t\t<input readonly class=\"form-control input-lg\" type=\"text\" value=\"{{selectionDayTxt}}\" (focus)=\"showSelector ? false : openBtnClicked()\" placeholder=\"Date\" />\n\t\t\n      \t\t<div class=\"input-group-btn\">\n      \t\t\t<button type=\"button\" class=\"btn btn-default input-lg\" *ngIf=\"selectionDayTxt.length>0\" (click)=\"removeBtnClicked()\">\n      \t\t\t\t<span class=\"glyphicon glyphicon-remove\"></span>\n      \t\t\t</button>\n      \t\t\t<button type=\"button\" class=\"btn btn-default input-lg\" (click)=\"openBtnClicked()\">\n      \t\t\t\t<span class=\"glyphicon glyphicon-calendar\"></span>\n      \t\t\t</button>\n      \t\t</div>\t\t\n      \t</div>\n\n          <!-- <div class=\"selectiongroup\">\t\t\n              <span class=\"selection\" [ngStyle]=\"{'height': height, 'line-height': height}\" (click)=\"openBtnClicked()\">{{selectionDayTxt}}</span> \n      \t\t<span class=\"selbtngroup\" [style.height]=\"height\">\n                  <button type=\"button\" class=\"btnclear\" *ngIf=\"selectionDayTxt.length>0\" (click)=\"removeBtnClicked()\"><span class=\"icon icon-cross\"></span></button>\n                  <button type=\"button\" class=\"btnpicker\" (click)=\"openBtnClicked()\"><span class=\"icon icon-calendar\"></span></button>\n              </span>\t\t\n          </div>-->\n\t\n          <div class=\"selector\" *ngIf=\"showSelector\">\n              <table class=\"header\">\n                  <tr>\n                      <td>\n                          <div style=\"float:left\">\n                              <div class=\"headerbtn\" (click)=\"prevMonth()\"><span class=\"icon icon-left\"></span></div>\n                              <div class=\"headermonthtxt\">{{visibleMonth.monthTxt}}</div>\n                              <div class=\"headerbtn\" (click)=\"nextMonth()\"><span class=\"icon icon-right\"></span></div>\n                          </div>\n                      </td>\n                      <td>\n                          <!-- <button type=\"button\" class=\"headertodaybtn\" (click)=\"todayClicked()\">{{todayBtnTxt}}</button> -->\n                      </td>\n                      <td>\n                          <div style=\"float:right\">\n                              <div class=\"headerbtn\" (click)=\"prevYear()\"><span class=\"icon icon-left\"></span></div>\n                              <div class=\"headeryeartxt\">{{visibleMonth.year}}</div>\n                              <div class=\"headerbtn\" (click)=\"nextYear()\"><span class=\"icon icon-right\"></span></div>\n                          </div>\n                      </td>\n                  </tr>\n              </table>\n              <table class=\"caltable\">\n                  <thead><tr><th *ngFor=\"#d of weekDays\">{{d}}</th></tr></thead>\n                  <tbody>\n                      <tr *ngFor=\"#w of dates\">\n                          <td *ngFor=\"#d of w\"                      [ngClass]=\"{'disabled': d.isOutOfRange, 'prevmonth':d.cmo===PREV_MONTH,'currmonth':d.cmo===CURR_MONTH,'nextmonth':d.cmo===NEXT_MONTH, 'currday':d.currDay, 'selectedday':selectedDate.day===d.day && selectedDate.month===d.month && selectedDate.year===d.year && d.cmo===CURR_MONTH}\" (click)=\"cellClicked(d)\">\n                              <div style=\"background-color:inherit\" [ngClass]=\"{'prevmonth':d.cmo===PREV_MONTH,'currmonth':d.cmo===CURR_MONTH,'nextmonth':d.cmo===NEXT_MONTH,'sunday':d.sun && d.cmo===CURR_MONTH && sunHighlight}\">{{d.day}}</div>\n                          </td>\n                      </tr>\n                  </tbody>\n              </table>\n          </div>\n      </div>\n    ",
                        directives: [common_1.NgIf, common_1.NgFor, common_1.NgClass, common_1.NgStyle]
                    }), 
                    __metadata('design:paramtypes', [(typeof (_b = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _b) || Object])
                ], MyDatePicker);
                return MyDatePicker;
                var _a, _b;
            })();
            exports_1("MyDatePicker", MyDatePicker);
        }
    }
});