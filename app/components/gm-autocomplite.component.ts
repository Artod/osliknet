import {Component, OnInit, ElementRef} from 'angular2/core';
import {LazyMapsAPILoader} from '../services/maps-api-loader/lazy-maps-api-loader';

declare var google: any;

@Component({
	selector: 'gm-autocomplite',
	templateUrl: '/app/tmpls/gm-autocomplite.html',
	inputs: ['name', 'class']
})

export class GmAutocompliteComponent implements OnInit {
	public name: string;	
	public name1: string;	
	public class: string;	
	
	constructor(
		private _loader: LazyMapsAPILoader,
		private _el: ElementRef
	) {
		console.log(this.name)
	}
	
	ngOnInit() {		
		let $inputs = this._el.nativeElement.querySelectorAll('input'),		
			$text = $inputs[0],
			$place_id = $inputs[1];
	
		this._loader.load().then( () =>	{
			this.init($text, $place_id);
		});
	}
	
	ngAfterViewInit() {

	}
	
	init($text: HTMLElement, $place_id: HTMLElement) {
		var autocomplete = new google.maps.places.Autocomplete($text, {
			types: ['(cities)']
		});
	  
		google.maps.event.addListener(autocomplete, 'place_changed', function() {			
			let place = this.getPlace();				
			$place_id.value = place.place_id;
		});
	}
}