import {AppComponent} from './components/app';
import {bootstrap} from 'angular2/platform/browser';
import {APP_BASE_HREF, ROUTER_PROVIDERS} from 'angular2/router';
import {provide} from 'angular2/core';

import {LazyMapsAPILoader, LazyMapsAPILoaderConfig} from './services/maps-api-loader/lazy-maps-api-loader';

bootstrap(AppComponent, [
	ROUTER_PROVIDERS,
	provide(APP_BASE_HREF, {useValue: '/'}),
	provide(LazyMapsAPILoaderConfig, {useFactory: () => {
		return {
			apiKey: 'AIzaSyBjCE2t7x2LK0YttTxEz9rN9hcuOxa9gfQ',
			apiVersion: 3,
			params: '&libraries=places&signed_in=true&language=en'
		};
	}}),	
	LazyMapsAPILoader
]);