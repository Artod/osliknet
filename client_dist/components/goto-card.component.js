System.register(['angular2/core', 'angular2/router'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, router_1;
    var GotoComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            }],
        execute: function() {
            GotoComponent = (function () {
                function GotoComponent() {
                    this.order = {};
                    this.newMessages = {};
                }
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], GotoComponent.prototype, "order", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], GotoComponent.prototype, "newMessages", void 0);
                GotoComponent = __decorate([
                    core_1.Component({
                        selector: 'goto',
                        template: "\n   <div class=\"text-right\">\n   \t<span *ngIf=\"newMessages && newMessages[order._id] && newMessages[order._id][0]\" class=\"label label-danger\">{{newMessages[order._id][0]}} new</span>\n\t\n   \t<a [routerLink]=\"['Order', {id:order._id}]\">\n   \t\tGo to negotiation\n   \t\t<span *ngIf=\"order.msg_cnt\">({{ order.msg_cnt }})</span>\n   \t\t<!-- <span class=\"badge\" *ngIf=\"newMessages[order._id] && newMessages[order._id][0]\">{{newMessages[order._id][0]}}</span> -->\t\t\t\t\t\n   \t</a>\n   </div>\n\t",
                        directives: [router_1.ROUTER_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [])
                ], GotoComponent);
                return GotoComponent;
            })();
            exports_1("GotoComponent", GotoComponent);
        }
    }
});