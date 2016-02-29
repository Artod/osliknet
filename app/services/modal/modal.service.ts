import {
	Injectable,
    DynamicComponentLoader,
    ElementRef,
    ApplicationRef
} from 'angular2/core';

import {ModalComponent} from './modal.component';

@Injectable()
export class ModalService {
    constructor(
		private _componentLoader: DynamicComponentLoader,
		private _appRef: ApplicationRef
	) {
		
    }
// , bindings: ResolvedProvider[]
    public open() {
		let elementRef: ElementRef = this._appRef['_rootComponents'][0].location;
		let promise = this._componentLoader.loadNextToLocation(ModalComponent, elementRef);
		
		promise.then(modalComponentRef => {
			modalComponentRef.instance.ref = modalComponentRef;
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