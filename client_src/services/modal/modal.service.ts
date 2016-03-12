import {
	Injectable,
    DynamicComponentLoader,
    ElementRef,
    ApplicationRef,
	Injector,
	provide
} from 'angular2/core';

import {ModalComponent} from './modal.component';

@Injectable()
export class ModalService {
    constructor(
		private _componentLoader: DynamicComponentLoader,
		private _appRef: ApplicationRef
		
	) {
		
    }
	
    public show(Component, providers) {
		var promise = this.open().then(modalComponentRef => {
		
			// let tripProvider = Injector.resolve([provide(Trip, {useValue: trip})]);			
			// var tripProvider = Injector.resolve([bind(Trip).toValue(trip)]);
			
			return this.bind(Component, modalComponentRef, providers).then(componentRef => {				
				// let component: RequestAddComponent = componentRef.instance;
				// component.ref = componentRef;				
				// res.instance.formModel.trip_id = trip._id;
				
				// modalComponentRef.instance.show();
				
				return modalComponentRef.instance;
			});
		});
		
		return promise;
    }
	
    public open() {
		let elementRef: ElementRef = this._appRef['_rootComponents'][0].location;
		
		// var otherResolved = Injector.resolve([
			// provide('locationEl', {useValue: elementRef}),
			// provide(Location, {useValue: this._location})
		// ]);
			
		let promise = this._componentLoader.loadNextToLocation(ModalComponent, elementRef/*, otherResolved*/);
		
		promise.then(modalComponentRef => {
			modalComponentRef.instance._ref = modalComponentRef;
			
			return modalComponentRef;
		});	
		
		return promise;
    }

    public bind(Component, modalComponentRef, providers) {
		let elementRef: ElementRef = modalComponentRef.location;
		
		// providers = providers || [];		
		// providers.push( Injector.resolve([ provide(ModalComponent, {useValue: modalComponentRef.instance}) ]) );

		let promise = this._componentLoader.loadIntoLocation(Component, elementRef, 'comp', providers).then( componentRef => {
			componentRef.instance._modalComponent = modalComponentRef.instance;
			modalComponentRef.instance.loaded = true;
			
			return componentRef;
		});
		
		return promise;
    }
}