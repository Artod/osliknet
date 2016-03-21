import {Component, Input, Output, Inject, ElementRef, EventEmitter} from 'angular2/core';
import {Control} from 'angular2/common';
declare var window: any;

@Component({
	selector: 'captcha',
	template: `
		<input name="recaptcha" type="hidden" [(ngModel)]="model" [ngFormControl]="ctrl" value="" />
		<div class="g-recaptcha">Loading captcha...</div>
	`
})
//  
export class CaptchaComponent {
	@Input() ctrl : Control;
	@Input() model;
	
	@Output('modelChange') public modelChange : EventEmitter<any> = new EventEmitter();

	private _interval : number;
	public captchaId : number;
	
	constructor(
		@Inject('config.captcha') public configCaptcha,
		private _el : ElementRef
	) {	

	}
	
	public ngOnInit() {
		this.interval = window.setInterval( () => {
			this.checkLoaded();
		}, 100);
		
		this.checkLoaded();		
	}
	
	public ngOnDestroy() {
		if (this.interval) {
			window.clearInterval(this.interval);
		}
	}
	
	public checkLoaded() : void {
		if (this.configCaptcha.loaded) {
			window.clearInterval(this.interval);
			this.interval = null;

			this.init();
		}
	}
	
	public init() : void {
		let $el = this._el.nativeElement.querySelector('.g-recaptcha');
		
		$el.innerHTML = '';
		
		this.modelChange.emit('');
		this.model = '';
		
		this.captchaId = window.grecaptcha.render($el, {
			sitekey: this.configCaptcha.key,
			theme: 'light',
			// size: 'compact',
			callback: (response) => {
				this.modelChange.emit(response);
				this.model = response;
			},
			'expired-callback': (response) => {
				this.modelChange.emit('');
				this.model = response;
			}
		});
	}
}

























