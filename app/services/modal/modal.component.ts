import {Component, ElementRef, AfterContentInit/*, Inject*/} from 'angular2/core';

declare var window: any;

@Component({
	selector: 'modal',
	// templateUrl: '/app/services/modal/tmpl.html (click)="close($event)"'
	template: `
		<section class="splash">
			<div class="splash-inner">
				<div class="container" (click)="prevent($event)">
					<button class="close text-right" type="button" (click)="close($event)"><span class="glyphicon glyphicon-remove-circle"></span></button>
					<comp #comp [hidden]="loaded" style="text-center">Loading...</comp>			
				</div>
			</div>
		</section>`
})

export class ModalComponent  implements AfterContentInit {
	public loaded : boolean = false;
	
	public $body : HTMLElement;
	public $splash : HTMLElement;
	
	public bodyOpenClass : string = 'modal-open';
	public splashOpenClass : string = 'splash-open';
	
	private _ref: ElementRef;
	
	constructor(
		// @Inject('locationEl') private _locationEl
		// _location : Location
	) {
		this.$body = window.document.querySelector('body');
	}
	
	public ngAfterContentInit() : void {
		setTimeout(() => this.show(), 0);
	}
	
	public show() : void {
		this.$splash = this._ref.location.nativeElement.querySelector('.splash');
		this.$splash.classList.add(this.splashOpenClass);
		this.$body.classList.add(this.bodyOpenClass);
	}
	
	public close($event) : boolean {
		this.$splash.classList.remove(this.splashOpenClass);
		this.$body.classList.remove(this.bodyOpenClass);
		
		setTimeout(() => {
			this._ref.dispose();		
		}, 500);
		
		this.prevent($event);
		
		return false;
	}
	
	public prevent($event) : void {
		if ($event) {
			$event.stopPropagation();
		}
	}
	
}