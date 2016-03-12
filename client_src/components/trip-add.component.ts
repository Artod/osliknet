import {Component, ElementRef} from 'angular2/core';
import {FORM_DIRECTIVES, CORE_DIRECTIVES, FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {Router} from 'angular2/router';

import {MyDatePicker} from '../services/datepicker/mydatepicker';

import {TripService} from '../services/trip/trip.service';

import {GmAutocompliteComponent} from './gm-autocomplite.component';

@Component({
	templateUrl: '/client_src/tmpls/trip-add.html',
	directives: [GmAutocompliteComponent, FORM_DIRECTIVES, CORE_DIRECTIVES, MyDatePicker]	
})

export class TripAddComponent {
	public trips : any[];
	public model = {
/*from: "Montreal, QC, Canada",
from_id: "ChIJDbdkHFQayUwR7-8fITgxTmU",
to:	"Montreal East, QC, Canada",
to_id:	"ChIJndvyLgHiyEwREdLOpOC4H6k",
when:	1453957200000,
description:""*/		
	};
	public form: ControlGroup;
	
    public myDatePickerOptions = {
		/*todayBtnTxt: 'Today',*/
		dateFormat: 'dd.mm.yyyy',
		firstDayOfWeek: 'mo',
		sunHighlight: true,
		/*height: '34px',
		width: '260px',*/
		minDate: new Date()
	};
	
    public selectedDate: string = '';
	
	constructor(
		private _fb : FormBuilder,
		private _router : Router,
		private _tripService : TripService
	) {
		
		// console.dir(Validators);
		
		this.form = _fb.group({  
			from: ['', Validators.required],
			from_id: ['', Validators.required],
			to: ['', Validators.required],
			to_id: ['', Validators.required],
			when: ['', Validators.required],
			description: ['', Validators.required]
		});
		
	}
	
	private _busy : boolean = false;
	public error : string = '';
	
	public onSubmit($from, $to, $when, $description) : void {
		
		
		console.dir($from)
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
			
			this._tripService.addTrips(this.model).subscribe(res => {
				if (res.trip && res.trip._id) 
					this._router.navigate(['Trip', {id: res.trip._id}]);
				else
					this.error = 'Unexpected error. Try again later.';
				
				this._busy = false;
			}, err => {
				this.error = 'Unexpected error. Try again later.';

				try {
					this.error = err.json().error || this.error;
				} catch(e) {
					this.error = err.text() || this.error;
				}
				
				this._busy = false;
			});
		}
	}
	
	public onDateChanged(event) {
        // console.log('onDateChanged(): ', event.date, ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);

		this.form.controls.when._touched = true;
		this.model.when = event.epoc * 1000;
    }
}