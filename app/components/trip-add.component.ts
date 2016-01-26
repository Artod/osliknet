import {Component, ElementRef} from 'angular2/core';
import {FORM_DIRECTIVES, CORE_DIRECTIVES, FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {GmAutocompliteComponent} from '../components/gm-autocomplite.component';

// import {DatePicker} from 'ng2-datepicker';
import {MyDatePicker} from '../services/datepicker/mydatepicker';

import {Trip} from '../services/trip/trip';
import {TripService} from '../services/trip/trip.service';

@Component({
	templateUrl: '/app/tmpls/trip-add.html',
	directives: [GmAutocompliteComponent, FORM_DIRECTIVES, CORE_DIRECTIVES, MyDatePicker]	
})

export class TripAddComponent {
	public trips: Trip[];
	public formModel = {
from: "Montreal, QC, Canada",
from_id: "ChIJDbdkHFQayUwR7-8fITgxTmU",
to:	"Montreal East, QC, Canada",
to_id:	"ChIJndvyLgHiyEwREdLOpOC4H6k",
when:	1453957200000,
description:"cvcv"
		
	};	
	public form: ControlGroup;
	
    public myDatePickerOptions = {
		todayBtnTxt: 'Today',
		dateFormat: 'dd.mm.yyyy',
		firstDayOfWeek: 'mo',
		sunHighlight: true,
		height: '34px',
		width: '260px',
		minDate: new Date()
	};
	
    public selectedDate: string = '';
	
	constructor(
		private _fb: FormBuilder,
		private _tripService: TripService
	) {
		
		// console.dir(Validators);
		
		this.form = _fb.group({  
			from: ['', Validators.required],
			from_id: ['', Validators.required],
			to: ['', Validators.required],
			to_id: ['', Validators.required],
			when: ['', Validators.required],
			description: ''
		});
		
	}
	
	onSubmit(value:Object):void {
		if (this.form.valid) {
			console.log('this.formModel')
			console.dir(this.formModel)
			
			this._tripService.addTrips(this.formModel)			
				.subscribe(res => {
					let trip = res.json();
					
					console.dir(trip);
				}, err => {
					console.dir(err);
				}, () => {
					console.log('done')
				});
		}
	}
	
	onDateChanged(event) {
        // console.log('onDateChanged(): ', event.date, ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);

		this.form.controls.when._touched = true;
		this.formModel.when = event.epoc * 1000;
    }
}