System.register(['angular2/core', 'angular2/router', 'angular2/http', 'angular2/common', './trip.component', './trips.component', './trip-add.component', './trips-my.component', './orders.component', './order.component', './user.component', './notifications.component', './messages.component', './dialogs.component', './login.component', './join.component', './user-card.component', '../services/trip/trip.service', '../services/order/order.service', '../services/modal/modal.service', '../services/message/message.service', '../services/review/review.service', '../services/invoice/invoice.service', '../services/user/user.service', '../services/notification/notification.service', '../services/subscribe/subscribe.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var core_1, router_1, http_1, common_1, trip_component_1, trips_component_1, trip_add_component_1, trips_my_component_1, orders_component_1, order_component_1, user_component_1, notifications_component_1, messages_component_1, dialogs_component_1, login_component_1, join_component_1, user_card_component_1, trip_service_1, order_service_1, modal_service_1, message_service_1, review_service_1, invoice_service_1, user_service_1, notification_service_1, subscribe_service_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (trip_component_1_1) {
                trip_component_1 = trip_component_1_1;
            },
            function (trips_component_1_1) {
                trips_component_1 = trips_component_1_1;
            },
            function (trip_add_component_1_1) {
                trip_add_component_1 = trip_add_component_1_1;
            },
            function (trips_my_component_1_1) {
                trips_my_component_1 = trips_my_component_1_1;
            },
            function (orders_component_1_1) {
                orders_component_1 = orders_component_1_1;
            },
            function (order_component_1_1) {
                order_component_1 = order_component_1_1;
            },
            function (user_component_1_1) {
                user_component_1 = user_component_1_1;
            },
            function (notifications_component_1_1) {
                notifications_component_1 = notifications_component_1_1;
            },
            function (messages_component_1_1) {
                messages_component_1 = messages_component_1_1;
            },
            function (dialogs_component_1_1) {
                dialogs_component_1 = dialogs_component_1_1;
            },
            function (login_component_1_1) {
                login_component_1 = login_component_1_1;
            },
            function (join_component_1_1) {
                join_component_1 = join_component_1_1;
            },
            function (user_card_component_1_1) {
                user_card_component_1 = user_card_component_1_1;
            },
            function (trip_service_1_1) {
                trip_service_1 = trip_service_1_1;
            },
            function (order_service_1_1) {
                order_service_1 = order_service_1_1;
            },
            function (modal_service_1_1) {
                modal_service_1 = modal_service_1_1;
            },
            function (message_service_1_1) {
                message_service_1 = message_service_1_1;
            },
            function (review_service_1_1) {
                review_service_1 = review_service_1_1;
            },
            function (invoice_service_1_1) {
                invoice_service_1 = invoice_service_1_1;
            },
            function (user_service_1_1) {
                user_service_1 = user_service_1_1;
            },
            function (notification_service_1_1) {
                notification_service_1 = notification_service_1_1;
            },
            function (subscribe_service_1_1) {
                subscribe_service_1 = subscribe_service_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(_location, configUser) {
                    var _this = this;
                    this._location = _location;
                    this.configUser = configUser;
                    this.adminUid = '5702b5d213e381b973f9a9f8';
                    this._location.subscribe(function () {
                        _this.isVisible = false;
                    });
                }
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'app',
                        templateUrl: '/client_src/tmpls/app.html',
                        directives: [router_1.ROUTER_DIRECTIVES, common_1.FORM_DIRECTIVES, common_1.CORE_DIRECTIVES, notifications_component_1.NotificationsComponent, user_card_component_1.UserCardComponent],
                        providers: [http_1.HTTP_PROVIDERS, common_1.FORM_PROVIDERS, trip_service_1.TripService, order_service_1.OrderService, modal_service_1.ModalService, message_service_1.MessageService, notification_service_1.NotificationService, user_service_1.UserService, review_service_1.ReviewService, invoice_service_1.InvoiceService, subscribe_service_1.SubscribeService]
                    }),
                    router_1.RouteConfig([
                        { path: '/', name: 'Main', component: trips_component_1.TripsComponent, data: { isMain: true } },
                        { path: '/trips', name: 'Trips', component: trips_component_1.TripsComponent },
                        { path: '/trips/:id', name: 'Trip', component: trip_component_1.TripComponent },
                        { path: '/trips/add', name: 'TripAdd', component: trip_add_component_1.TripAddComponent },
                        { path: '/trips/my', name: 'TripsMy', component: trips_my_component_1.TripsMyComponent },
                        { path: '/users/:id', name: 'User', component: user_component_1.UserComponent },
                        { path: '/users/me', name: 'UserMe', component: user_component_1.UserComponent },
                        { path: '/users/login', name: 'Login', component: login_component_1.LoginComponent },
                        { path: '/users/join', name: 'Join', component: join_component_1.JoinComponent },
                        { path: '/orders', name: 'Orders', component: orders_component_1.OrdersComponent },
                        { path: '/messages/order/:id', name: 'Order', component: order_component_1.OrderComponent },
                        { path: '/messages/user/:id', name: 'Messages', component: messages_component_1.MessagesComponent },
                        { path: '/messages', name: 'Dialogs', component: dialogs_component_1.DialogsComponent }
                    ]),
                    __param(1, core_1.Inject('config.user')), 
                    __metadata('design:paramtypes', [router_1.Location, Object])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
