import {Component, Input, OnInit, ElementRef} from 'angular2/core';
import {LazyMapsAPILoader} from '../services/maps-api-loader/lazy-maps-api-loader';

declare var google: any;

@Component({
	selector: 'gm-autocomplite',
	templateUrl: '/app/tmpls/gm-autocomplite.html'//,
	// inputs: ['name', 'model', 'class', 'form']
})

export class GmAutocompliteComponent implements OnInit {
	@Input() name_place: String;	
	@Input() name_id: String;	
	@Input() class: String;	
	@Input() form: ControlGroup;
	@Input() model;
	public isInvalid: Boolean = false;
	private _currentCity: String = '';
	private _place: String = '';
	
	constructor(
		private _loader: LazyMapsAPILoader,
		private _el: ElementRef
	) {		
		
	}
	
	ngOnInit(): void {		
		let $inputs = this._el.nativeElement.querySelectorAll('input'),		
			$place = $inputs[0],
			$place_id = $inputs[1];
	
		this._loader.load().then( () =>	{
			this.init($place, $place_id);
		});
	}

	
	init($place: HTMLElement, $place_id: HTMLElement): void {
		let autocomplete = new google.maps.places.Autocomplete($place, {
			types: ['(cities)']
		});
	  
		var that = this;
		
		google.maps.event.addListener(autocomplete, 'place_changed', function() {			
			let place = this.getPlace();				
			// $place_id.value = place.place_id;
			
			that.model[that.name_id] = place.place_id;
			
			that._currentCity = $place.value;
		});
	}
	
	onChange(value: String): void {
		if (this._currentCity && value !== this._currentCity) {
			this._currentCity = '';
			this._place = '';
			this.model[this.name_place] = '';
			this.model[this.name_id] = '';
		}
	}
	
	onBlur(value: String): void {
		if ( value && !this.model[this.name_id] ) {
			this.model[this.name_place] = '';
			console.log('clear');
		}
	}
}

























