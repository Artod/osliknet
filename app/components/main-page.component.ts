import {Component, ElementRef} from 'angular2/core';
import {Router} from 'angular2/router';
import {NgForm} from 'angular2/common';
import {GmAutocompliteComponent} from '../components/gm-autocomplite.component';

@Component({
	templateUrl: '/app/tmpls/main-page.html',
	directives: [GmAutocompliteComponent]
})

export class MainPageComponent /*implements OnInit, AfterViewInit*/ {
	// heroes: Hero[];
	// model = {};

	constructor(
		private _router: Router,
		private _el:ElementRef
	) {
		
	}
		
	onSubmit() {
		
	}
}