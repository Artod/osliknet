import {Component, ElementRef} from 'angular2/core';
// import {Router} from 'angular2/router';
import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {GmAutocompliteComponent} from '../components/gm-autocomplite.component';

@Component({
	templateUrl: '/app/tmpls/main-page.html',
	providers: [ElementRef],
	directives: [GmAutocompliteComponent, FORM_DIRECTIVES]
})

export class MainPageComponent {
	// heroes: Hero[];
	private model = {};	
	public searchForm: ControlGroup;

	constructor(
		// private _router: Router,
		private _el:ElementRef,
		private fb: FormBuilder
	) {
		this.searchForm = fb.group({  
			from: ['', Validators.required],
			from_id: ['', Validators.required],
			to: ['', Validators.required],
			to_id: ['', Validators.required]
		});
	}
		
	onSubmit(value: string): void {  
		console.log('you submitted value: ', value);  
	}
}