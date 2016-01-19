import {Component, OnInit, ElementRef, AfterViewInit} from 'angular2/core';
import {Router} from 'angular2/router';
// import {MapsAPILoader} from 'angular2-google-maps/services/google-maps-api-wrapper';
import {LazyMapsAPILoader} from '../services/maps-api-loader/lazy-maps-api-loader';

/*
class LazyMapsAPILoaderConfig {
  apiKey: string = null;
  apiVersion: string = '3';
  hostAndPath: string = 'maps.googleapis.com/maps/api/jsdddd';
  protocol: GoogleMapsScriptProtocol = GoogleMapsScriptProtocol.HTTPS;
}
*/

declare var google: any;

@Component({
	templateUrl: '/app/tmpls/main-page.html',
	providers: [/*LazyMapsAPILoaderConfig, LazyMapsAPILoader, */ElementRef]
})

export class MainPageComponent implements OnInit, AfterViewInit {
	// heroes: Hero[];
	
	constructor(
		private _router: Router,
		private _loader: LazyMapsAPILoader,
		private _el:ElementRef
	) {
		// this.fromInput: HTMLElement = '';
	}
	
	ngOnInit() {
		console.dir(this._el);
		
		let natEl = this._el.nativeElement;
		
		let fromInput = natEl.querySelector('#from-input'),
			fromId = natEl.querySelector('#from-id'),
			toInput = natEl.querySelector('#to-input'),
			toId = natEl.querySelector('#to-id');
	
		this._loader.load().then( () =>	{
			this.initAutocomplite(fromInput, fromId);
			this.initAutocomplite(toInput, toId);
		});
		
		/*console.dir(this.fromInput)
		
		this._loader.load().then( () =>	{
			this.initAutocomplite(this.fromInput, this.fromId);
			this.initAutocomplite(this.toInput, this.toId);
		});*/
	}
	
	ngAfterViewInit() {

	}
	
	initAutocomplite($input: HTMLElement, $place_id: HTMLElement) {
		var autocomplete = new google.maps.places.Autocomplete($input, {
			types: ['(cities)']
		});
	  
		google.maps.event.addListener(autocomplete, 'place_changed', function() {			
			let place = this.getPlace();				
			$place_id.value = place.place_id;
		});
	}
}