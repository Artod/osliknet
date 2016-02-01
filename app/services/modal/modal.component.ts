import {Component, ElementRef} from 'angular2/core';

@Component({
	selector: 'modal',
	// templateUrl: '/app/services/modal/tmpl.html'
	template: `
		<section style="z-index': 1000, display: 'block'" class="splash splash-open">
		  <div class="splash-inner">
			<div class="splash-content text-center">
				<comp #comp></comp>
				<button class="btn btn-lg btn-outline" (click)="close()">Ok</button>
			</div>
		  </div>
		</section>
`
})

export class ModalComponent {
	constructor(private _ref: ElementRef) {
		console.dir(this._ref);
	}
	
	public close() {
		this.ref.dispose();
	}
}