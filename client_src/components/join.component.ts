import {Component, ElementRef} from 'angular2/core';
import {FORM_DIRECTIVES, CORE_DIRECTIVES, FormBuilder, ControlGroup, Validators} from 'angular2/common';

import {ROUTER_DIRECTIVES} from 'angular2/router';

import {CaptchaComponent} from './captcha.component';

import {UserService} from '../services/user/user.service';

@Component({
	selector: 'join',
	templateUrl: '/client_src/tmpls/join.html',
	directives: [ROUTER_DIRECTIVES, CaptchaComponent],
	pipes: []
})

export class JoinComponent {
	public model = {
		/*email: 'mcattendlg@gmail.com',
		name: 'mcattendlg'
		*/
	}
	
	public form: ControlGroup;
	
	constructor(
		private _fb: FormBuilder,
		private _userService: UserService
	) {
		this.form = _fb.group({ 
			name: ['', Validators.compose([
				(ctrl) => {
					if ( ctrl.value && ctrl.value.replace(/^\s\s*/, '').replace(/\s\s*$/, '') === '' ) {
						return {emptyName: true};
					}
					
					return null;
				},
				Validators.required,
				(ctrl) => {
					if ( ctrl.value && !/^[a-z0-9-_ ]+$/i.test(ctrl.value) ) {
						return {invalidName: true};
					}
					
					return null;
				}
			])],
			email: ['', Validators.compose([
				Validators.required,
				(ctrl) => {
					
					if ( ctrl.value && !/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(ctrl.value) ) {
						return {invalidEmail: true};
					}
					
					return null;
				}]
			)],
			recaptcha: ['', Validators.required]
		});
	}
	
	private _busy : boolean = false;
	public submitted : boolean = false;
	public success : boolean = false;
	public error : string = '';
	
	public onSubmit($name, $email) : void {
		this.submitted = true;
		
		if (!this.form.controls.name.valid) {
			$name.focus();
			
			return;
		}
		
		if (!this.form.controls.email.valid) {
			$email.focus();
			
			return;
		}
		
		if (this.form.valid) {
			this._busy = true;
			this.error = '';
			
			this._userService.signup(this.model).subscribe(res => {
				this.success = true;

				this._busy = false;
			}, err => {
				this.error = 'Unexpected error. Try again later.';

				try {
					this.error = err.json().error || this.error;
				} catch(e) {}
				
				this._busy = false;
			});
		}
	}
}
























