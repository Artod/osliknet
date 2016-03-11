import {Component, Inject} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, Location} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {FORM_DIRECTIVES, CORE_DIRECTIVES, FORM_PROVIDERS} from 'angular2/common';

import {TripComponent}     from './trip.component';
import {TripsComponent}    from './trips.component';
import {TripAddComponent}  from './trip-add.component';
import {TripsMyComponent}  from './trips-my.component';
import {OrdersComponent}   from './orders.component';
import {OrderComponent}    from './order.component';
import {UserComponent}     from './user.component';
import {NotificationsComponent} from './notifications.component';
import {MessagesComponent} from './messages.component';
import {DialogsComponent}  from './dialogs.component';
import {LoginComponent}  from './login.component';
import {JoinComponent}  from './join.component';

import {TripService}    from '../services/trip/trip.service';
import {OrderService}   from '../services/order/order.service';
import {ModalService}   from '../services/modal/modal.service';
import {MessageService} from '../services/message/message.service';
import {ReviewService}  from '../services/review/review.service';
import {UserService}    from '../services/user/user.service';
import {NotificationService} from '../services/notification/notification.service';
import {SubscribeService} from '../services/subscribe/subscribe.service';

import {UserCardComponent} from './user-card.component';

@Component({
    selector: 'app',
	templateUrl: '/app/tmpls/app.html',
	directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES, CORE_DIRECTIVES, NotificationsComponent, UserCardComponent],
	providers: [HTTP_PROVIDERS, FORM_PROVIDERS, /*Location, */TripService, OrderService, ModalService, MessageService, NotificationService, UserService, ReviewService, SubscribeService]
})

@RouteConfig([
	{path:'/',          name: 'Main',   component: TripsComponent, data: {isMain: true}},
	{path:'/trips',     name: 'Trips',   component: TripsComponent},
	{path:'/trips/:id', name: 'Trip',    component: TripComponent},
	{path:'/trips/add', name: 'TripAdd', component: TripAddComponent},
	{path:'/trips/my',  name: 'TripsMy', component: TripsMyComponent},
	{path:'/users/:id', name: 'User',    component: UserComponent},
	{path:'/users/me',  name: 'UserMe',  component: UserComponent},
	
	{path:'/users/login', name: 'Login',  component: LoginComponent},
	{path:'/users/join',  name: 'Join',  component: JoinComponent},
	
	{path:'/orders',      name: 'Orders',  component: OrdersComponent},
	{path:'/messages/order/:id', name: 'Order', component: OrderComponent},
	{path:'/messages/user/:id', name: 'Messages', component: MessagesComponent},
	{path:'/messages',    name: 'Dialogs', component: DialogsComponent}
])

export class AppComponent {
	constructor(
		private _location : Location,
		@Inject('config.user') public configUser
	) {
		this._location.subscribe(() => {
			this.isVisible = false;
		});
	}
}