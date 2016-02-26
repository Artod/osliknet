import {Component, Inject} from 'angular2/core';
import {/*FORM_DIRECTIVES, CORE_DIRECTIVES, */FormBuilder, ControlGroup, Validators} from 'angular2/common';

import {ModalComponent} from '../services/modal/modal.component';

import {ReviewService}  from '../services/review/review.service';

@Component({
	templateUrl: '/app/tmpls/review-add.html',
	providers: [FormBuilder]/*,
	directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]*/
})

export class ReviewAddComponent {
	
	public formModel : any = {};

	public form : ControlGroup;
	
	private _modalComponent : ModalComponent;
	
	private _busy : boolean;

	constructor(
		private _fb : FormBuilder,		
		private _reviewService : ReviewService,
		@Inject('orderId') public orderId : string
	) {
		this.form = _fb.group({ 
			order: ['', Validators.required],
			rating: ['', Validators.required],
			comment: ['', Validators.required]
		});
		
		this.formModel.rating = 5;		
		this.formModel.order = this.orderId;		
		
		this._busy = true;
		
		this._reviewService.getByOrderId(this.orderId).subscribe(data => {
			if (data.review._id) {
				this.formModel = data.review;
			}
			
			this._busy = false;
		}, err => {
			this._busy = false;
		});
	}
	
	public onChangeRating(el) : void {
		if (el.checked) {
			this.formModel.rating = el.value;
		}
	}
	
	public onSubmit(elComment) : void {
		if (!this.form.valid) {
			elComment.focus();
		}
		
		if (this.form.valid && !this._busy) {
			this._busy = true;

			this._reviewService.add(this.formModel).subscribe(data => {
				this._busy = false;
				
				this._modalComponent && this._modalComponent.close();					
			}, err => {
console.error(err);
				this._busy = false;
			});
		}
	}
}