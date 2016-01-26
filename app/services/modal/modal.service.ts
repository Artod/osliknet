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
		private componentLoader: DynamicComponentLoader,
		private appRef: ApplicationRef
	) {
		
    }
// , bindings: ResolvedProvider[]
    public open(Component) {
		let elementRef: ElementRef = this.appRef['_rootComponents'][0].location;
		return this.componentLoader.loadNextToLocation(ModalComponent, elementRef).then( modalComponentRef => this._bind(Component, modalComponentRef) );		
    }

    public close() {
		// modalComponentRef
    }

    private _bind(Component, modalComponentRef) {
		let elementRef: ElementRef = modalComponentRef.location;
		this.componentLoader.loadIntoLocation(Component, elementRef, 'comp');
    }
}