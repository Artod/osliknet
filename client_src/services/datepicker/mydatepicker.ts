/** http://kekeh.github.io/mydatepicker/ */

import {Component, View, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChange, ElementRef} from 'angular2/core';
import {NgIf, NgFor, NgClass, NgStyle, NgModel} from 'angular2/common';
import {MyDate, MyMonth} from './interfaces';

@Component({
    selector: 'my-date-picker'
})
@View({
    templateUrl: '/client_src/services/datepicker/template/mydatepicker.html',
    directives: [NgIf, NgFor, NgClass, NgStyle]
})

export class MyDatePicker implements OnInit, OnChanges {
    @Input() options:any;
    @Input() selDate:string;
    @Output() dateChanged:EventEmitter<Object> = new EventEmitter();

    showSelector:boolean = false;
    visibleMonth:MyMonth = {monthTxt: '', monthNbr: 0, year: 0};
    selectedDate:MyDate = {year: 0, month: 0, day: 0};
    weekDays:Array<string> = [];
    dates:Array<Object> = [];
    selectionDayTxt:string = '';
    dayIdx:number = 0;
    today:Date = null;

    PREV_MONTH:number = 1;
    CURR_MONTH:number = 2;
    NEXT_MONTH:number = 3;

    // Default options
    dayLabels = {su: 'Sun', mo: 'Mon', tu: 'Tue', we: 'Wed', th: 'Thu', fr: 'Fri', sa: 'Sat'};
    monthLabels = { 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec' };
    dateFormat:string = 'yyyy-mm-dd'
    todayBtnTxt:string = 'Today';
    firstDayOfWeek:string = 'mo';
    sunHighlight:boolean = true;
    height:string = '34px';
    width:string = '100%';
    minDate:number = 0;

    constructor(public elem: ElementRef) {
        this.today = new Date();
        let doc = document.getElementsByTagName('html')[0];
        doc.addEventListener('click', (event) => {
            if (this.showSelector && event.target && this.elem.nativeElement !== event.target && !this.elem.nativeElement.contains(event.target)) {
                this.showSelector = false;
            }
        }, false);
    }

    ngOnInit() {
        this.dayLabels = this.options.dayLabels !== undefined ? this.options.dayLabels : this.dayLabels;
        this.monthLabels = this.options.monthLabels !== undefined ? this.options.monthLabels : this.monthLabels;
        this.dateFormat = this.options.dateFormat !== undefined ? this.options.dateFormat : this.dateFormat;
        this.todayBtnTxt = this.options.todayBtnTxt !== undefined ? this.options.todayBtnTxt : this.todayBtnTxt;
        this.firstDayOfWeek = this.options.firstDayOfWeek !== undefined ? this.options.firstDayOfWeek : this.firstDayOfWeek;
        this.sunHighlight = this.options.sunHighlight !== undefined ? this.options.sunHighlight : this.sunHighlight;
        this.height = this.options.height !== undefined ? this.options.height : this.height;
        this.width = this.options.width !== undefined ? this.options.width : this.width;
        // this.min = this.options.min !== undefined ? this.options.min : this.min;
		
		if (this.options.minDate) {
			this.minDate = ( new Date(
				this.options.minDate.getFullYear(),
				this.options.minDate.getMonth(),
				this.options.minDate.getDate()
			) ).getTime();
			
		
		}

        let days = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
        this.dayIdx = days.indexOf(this.firstDayOfWeek);
        if (this.dayIdx !== -1) {
            let idx = this.dayIdx;
            for (var i = 0; i < days.length; i++) {
                this.weekDays.push(this.dayLabels[days[idx]]);
                idx = days[idx] === 'sa' ? 0 : idx + 1;
            }
        }
    }

    ngOnChanges(changes: {[propName: string]: SimpleChange}) {
        this.selectionDayTxt = changes['selDate'].currentValue;
        if(this.selectionDayTxt !== '') {
            let fmt = this.options.dateFormat !== undefined ? this.options.dateFormat : this.dateFormat;
            let dpos = fmt.indexOf('dd');
            let mpos = fmt.indexOf('mm');
            let ypos = fmt.indexOf('yyyy');
            this.selectedDate = {day: parseInt(this.selectionDayTxt.substring(dpos, dpos + 2)),
                month: parseInt(this.selectionDayTxt.substring(mpos, mpos + 2)),
                year: parseInt(this.selectionDayTxt.substring(ypos, ypos + 4))};
        }
    }

    removeBtnClicked():void {
        this.selectionDayTxt = '';
        this.selectedDate = {year: 0, month: 0, day: 0};
        this.dateChanged.emit({date: {}, formatted: this.selectionDayTxt, epoc: 0});
    }

    openBtnClicked():void {
        this.showSelector = !this.showSelector;
        if (this.showSelector) {
            let y = 0, m = 0;
            if (this.selectedDate.year === 0 && this.selectedDate.month === 0 && this.selectedDate.day === 0) {
                y = this.today.getFullYear();
                m = this.today.getMonth() + 1;
            }
            else {
                y = this.selectedDate.year;
                m = this.selectedDate.month;
            }
            // Set current month
            this.visibleMonth = {monthTxt: this.monthLabels[m], monthNbr: m, year: y};

            // Create current month
            this.createMonth(m, y);
        }
    }

    prevMonth():void {
        let m = this.visibleMonth.monthNbr;
        let y = this.visibleMonth.year;
        if (m === 1) {
            m = 12;
            y--;
        }
        else {
            m--;
        }
        this.visibleMonth = {monthTxt: this.monthText(m), monthNbr: m, year: y};
        this.createMonth(m, y);
    }

    nextMonth():void {
        let m = this.visibleMonth.monthNbr;
        let y = this.visibleMonth.year;
        if (m === 12) {
            m = 1;
            y++;
        }
        else {
            m++;
        }
        this.visibleMonth = {monthTxt: this.monthText(m), monthNbr: m, year: y};
        this.createMonth(m, y);
    }

    prevYear():void {
        this.visibleMonth.year--;
        this.createMonth(this.visibleMonth.monthNbr, this.visibleMonth.year);
    }

    nextYear():void {
        this.visibleMonth.year++;
        this.createMonth(this.visibleMonth.monthNbr, this.visibleMonth.year);
    }

    todayClicked():void {
        // Today selected
        this.selectDate({day: this.today.getDate(), month: this.today.getMonth() + 1, year: this.today.getFullYear()});
    }

    cellClicked(cell:any):void {
		if (cell.isOutOfRange) {
			return;
		}
        // Cell clicked in the selector
        if (cell.cmo === this.PREV_MONTH) {
            // Previous month of day
            this.prevMonth();
			this.selectDate(cell);
        }
        else if (cell.cmo === this.CURR_MONTH) {
            // Current month of day
            this.selectDate(cell);
        }
        else if (cell.cmo === this.NEXT_MONTH) {
            // Next month of day
            this.nextMonth();
			this.selectDate(cell);
        }
    }

    selectDate(date:any):void {
        this.selectedDate = {day: date.day, month: date.month, year: date.year};
        this.selectionDayTxt = this.formatDate(date);
        this.showSelector = false;
        let epoc = new Date(date.year, date.month - 1, date.day, 0, 0, 0, 0).getTime() / 1000.0;
        this.dateChanged.emit({date: this.selectedDate, formatted: this.selectionDayTxt, epoc: epoc});
    }

    preZero(val):string {
        // Prepend zero if smaller than 10
        return val < 10 ? '0' + val : val;
    }

    formatDate(val:any):string {
        return this.dateFormat.replace('yyyy', val.year)
            .replace('mm', this.preZero(val.month))
            .replace('dd', this.preZero(val.day));
    }

    monthText(m:number):string {
        // Returns mont as a text
        return this.monthLabels[m];
    }

    monthStartIdx(y:number, m:number):number {
        // Month start index
        let d = new Date();
        d.setDate(1);
        d.setMonth(m - 1);
        d.setFullYear(y);
        let idx = d.getDay() + this.sundayIdx();
        return idx >= 7 ? idx - 7 : idx;
    }

    daysInMonth(m:number, y:number):number {
        // Return number of days of current month
        return new Date(y, m, 0).getDate();
    }

    daysInPrevMonth(m:number, y:number):number {
        // Return number of days of the previous month
        if (m === 1) {
            m = 12;
            y--;
        }
        else {
            m--;
        }
        return this.daysInMonth(m, y);
    }
	
    isOutOfRange(d:number, m:number, y:number, cmo:any):boolean {

        // Check is a given date the current date		
		let timestamp = new Date(y, m - 1, d).getTime();

		 
		return this.minDate && timestamp < this.minDate
		
        // return d === this.today.getDate() && m === this.today.getMonth() + 1 && y === this.today.getFullYear() && cmo === 2;
    }

    isCurrDay(d:number, m:number, y:number, cmo:any):boolean {
        // Check is a given date the current date
        return d === this.today.getDate() && m === this.today.getMonth() + 1 && y === this.today.getFullYear() && cmo === 2;
    }

    sundayIdx():number {
        // Index of Sunday day
        return this.dayIdx > 0 ? 7 - this.dayIdx : 0;
    }

    createMonth(m:number, y:number): void {
        this.dates.length = 0;
        let monthStart = this.monthStartIdx(y, m);
        let dInThisM = this.daysInMonth(m, y);
        let dInPrevM = this.daysInPrevMonth(m, y);
        let sunIdx = this.sundayIdx();

        let dayNbr = 1;
        let cmo = this.PREV_MONTH;
        for (var i = 1; i < 7; i++) {
            var week = [];
            if (i === 1) {
                // First week
                var pm = dInPrevM - monthStart + 1;
                // Previous month
				m--;
				if (m < 1) {							
					m = 12;
					y--;
				}
				
                for (var j = pm; j <= dInPrevM; j++) {
                    week.push({day: j, month: m, year: y, cmo: cmo, isOutOfRange: this.isOutOfRange(j, m, y), currDay: this.isCurrDay(j, m, y, cmo), sun: week.length === sunIdx});
                }
                cmo = this.CURR_MONTH;
                // Current month
				
				m++;
				if (m > 12) {							
					m = 1;
					y++;
				}
				
                var daysLeft = 7 - week.length;
                for (var j = 0; j < daysLeft; j++) {
                    week.push({day: dayNbr, month: m, year: y, cmo: cmo, isOutOfRange: this.isOutOfRange(dayNbr, m, y), currDay: this.isCurrDay(dayNbr, m, y, cmo), sun: week.length === sunIdx});
                    dayNbr++;
                }
            }
            else {
                // Rest of the weeks
                for (var j = 1; j < 8; j++) {
                    if (dayNbr > dInThisM && cmo !== this.NEXT_MONTH) {
                        // Next month
                        dayNbr = 1;
                        cmo = this.NEXT_MONTH;
						
						m++;
						
						if (m > 12) {							
							m = 1;
							y++;
						}
                    }
					
                    week.push({day: dayNbr, month: m, year: y, cmo: cmo, isOutOfRange: this.isOutOfRange(dayNbr, m, y), currDay: this.isCurrDay(dayNbr, m, y, cmo), sun: week.length === sunIdx});
                    dayNbr++;
                }
            }
            this.dates.push(week);
        }
    }
}