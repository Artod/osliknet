import {AppComponent} from './components/app';
import {bootstrap} from 'angular2/platform/browser';
import {APP_BASE_HREF, ROUTER_PROVIDERS} from 'angular2/router';
import {provide, enableProdMode} from 'angular2/core';
import {Http} from 'angular2/http';

// import {AuthService} from './services/auth/auth.service';

import 'rxjs/Rx' 
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';

import {LazyMapsAPILoader, LazyMapsAPILoaderConfig} from './services/maps-api-loader/lazy-maps-api-loader';



enableProdMode();



declare var window: any;

bootstrap(AppComponent, [
	ROUTER_PROVIDERS,
	provide(APP_BASE_HREF, {useValue: '/'}),
	// HTTP_PROVIDERS,
	Http,
	// provide(window, {useValue: window}),
	//provide(window, {useValue: window}),
	provide(LazyMapsAPILoaderConfig, {useFactory: () => {
		return window.googleMaps;
	}}),
	provide('config.user', {useFactory: () => {
		return window.user;
	}}),
	provide('config.captcha', {useFactory: () => {
		return window.googleRecaptcha;
	}}),	
	provide('config.orderStatus', {useFactory: () => {
		return window.orderStatus;
		
		/*return {
			5: 'Negotiation',
			10: 'Processing',			
			15: 'Refused',
			20: 'Cancelled',			
			25: 'Finished'
		};*/
	}}),
	provide('config.orderStatusConst', {useFactory: () => {
		return window.orderStatusConst;
		
		/*return {
			NEGOTIATION: 5,
			PROCESSING: 10,			
			REFUSED: 15,
			CANCELLED: 20,			
			FINISHED: 25
		};*/
	}}),
	LazyMapsAPILoader
]);