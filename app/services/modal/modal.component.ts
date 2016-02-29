import {Component, ElementRef} from 'angular2/core';

@Component({
	selector: 'modal',
	// templateUrl: '/app/services/modal/tmpl.html (click)="close($event)"'
	template: `
		<section class="splash splash-open">
			<div class="splash-inner">
				<div class="container" (click)="prevent($event)">
					<button class="close text-right" type="button" (click)="close($event)"><span class="glyphicon glyphicon-remove-circle"></span></button>
					<comp #comp [hidden]="loaded" style="text-center">Loading...</comp>				
				</div>
			</div>
		</section>`
})

export class ModalComponent {
	public loaded : boolean = false;
	
	constructor(private _ref: ElementRef) {
		console.dir(this._ref);
	}
	
	public close($event) : boolean {
		this.ref.dispose();
		
		if ($event)
			$event.stopPropagation();
		
		return false;
	}
	
	public prevent($event) : void {
		$event.stopPropagation();
	}
	
}