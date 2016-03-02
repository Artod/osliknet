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
	
    public open() {
		let elementRef: ElementRef = this._appRef['_rootComponents'][0].location;
		
		// var otherResolved = Injector.resolve([
			// provide('locationEl', {useValue: elementRef}),
			// provide(Location, {useValue: this._location})
		// ]);
			
		let promise = this._componentLoader.loadNextToLocation(ModalComponent, elementRef/*, otherResolved*/);
		
		promise.then(modalComponentRef => {
			modalComponentRef.instance._ref = modalComponentRef;
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