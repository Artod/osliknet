import {Component, ElementRef, Injector, provide, Renderer} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {GmAutocompliteComponent} from '../components/gm-autocomplite.component';

import {Trip} from '../services/trip/trip';
import {TripService} from '../services/trip/trip.service';
import {OrderService} from '../services/order/order.service';
import {ModalService} from '../services/modal/modal.service';
import {RequestAddComponent} from './request-add.component';


// import {Router} from 'angular2/router';

@Component({
	templateUrl: '/app/tmpls/requests.html'
})

export class RequestsComponent {
	public trips: Trip[];

	constructor(

	) {		

	}
}








