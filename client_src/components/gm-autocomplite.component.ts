import {Component, Input, Output, OnInit, ElementRef, NgZone, EventEmitter} from 'angular2/core';
import {LazyMapsAPILoader} from '../services/maps-api-loader/lazy-maps-api-loader';
import {ControlGroup} from 'angular2/common';

declare var google: any;

@Component({
	selector: 'gm-autocomplite',
	templateUrl: '/client_src/tmpls/gm-autocomplite.html'
})

export class GmAutocompliteComponent implements OnInit {
	@Input() name_place: string;	
	@Input() name_id: string;	
	@Input() class: string;	
	@Input() placeholder: string;
	@Input() form: ControlGroup;
	@Input() model;
	@Output() public newPlace : EventEmitter<any> = new EventEmitter();
	public isInvalid: boolean = false;
	private _currentCity: string = '';
	// private _place: string = '';
	
	constructor(
		private _loader: LazyMapsAPILoader,
		private _el: ElementRef,
		private _zone: NgZone
	) {		
		
	}
	
	ngOnInit(): void {		
		let $inputs = this._el.nativeElement.querySelectorAll('input'),		
			$place = $inputs[0],
			$place_id = $inputs[1];
	
		this._loader.load().then( () =>	{
			this.init($place, $place_id);
		});
		
		this._currentCity = this.model[this.name_place];
	}

	
	init($place : HTMLElement, $place_id : HTMLElement): void {
		let autocomplete = new google.maps.places.Autocomplete($place, {
			types: ['(cities)']
		});
	  
		var that = this;
		
		google.maps.event.addListener(autocomplete, 'place_changed', function() {		
			var place = this.getPlace();			
			
			that._zone.run(() => {
				that._currentCity = $place.value;
				that.model[that.name_place] = that._currentCity;
				that.model[that.name_id] = place.place_id;
				that.newPlace.emit(place);
			});
		});
	}
	
	check(value : String) : void {
		if (this._currentCity && value !== this._currentCity) {

			this._currentCity = '';
			// this._place = '';
			this.model[this.name_place] = '';
			this.model[this.name_id] = '';
		}
	}

	onEnter ($event, value) {
		if (value && value !== this._currentCity) {
			$event.preventDefault();
			this.check();
		}
	}
}

























