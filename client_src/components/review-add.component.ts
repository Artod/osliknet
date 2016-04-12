import {Component, Inject} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {Location} from 'angular2/router';

import {ModalComponent} from '../services/modal/modal.component';

import {ReviewService}  from '../services/review/review.service';

@Component({
	templateUrl: '/client_src/tmpls/review-add.html',
	providers: [FormBuilder]/*,
	directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]*/
})

export class ReviewAddComponent {
	
	public formModel : any = {};

	public form : ControlGroup;
	
	private _modalComponent : ModalComponent;
	
	private _busy : boolean;
	
	private _ratings : Array = [1, 2, 3, 4, 5];

	constructor(
		private _fb : FormBuilder,		
		private _reviewService : ReviewService,
		private _location : Location,
		@Inject('orderId') public orderId : string,
		@Inject('onReviewAdd') public onReviewAdd : Function
	) {
		this.form = this._fb.group({ 
			order: ['', Validators.required],
			rating: ['', Validators.required],
			comment: ['', Validators.required]
		});
		
		this.formModel.rating = 5;		
		this.formModel.order = this.orderId;		
		
		this._busy = true;
		
		this._reviewService.getByOrderId(this.orderId).subscribe(data => {
			if (data.review && data.review._id) {
				this.formModel = data.review;
			}
			
			this._busy = false;
		}, err => {
			this._busy = false;
		});
		
		this._locationSubscribe = this._location.subscribe(() => {
			this.closeModal();
		});
	}
	
	public ngOnDestroy() : void {
		this._locationSubscribe.unsubscribe();
	}
	
	public closeModal() : void {
		this._modalComponent && this._modalComponent.close();
	}
	
	public onChangeRating(el) : void {
		if (el.checked) {
			this.formModel.rating = el.value;
		}
	}
	
	public error : string = '';
	
	public onSubmit(elComment) : void {
		if (!this.form.valid) {
			elComment.focus();
		}
		
		if (this.form.valid && !this._busy) {
			this._busy = true;
			this.error = '';
			
			this._reviewService.add(this.formModel).subscribe(data => {				
				this.closeModal();

				this.onReviewAdd();
				
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
