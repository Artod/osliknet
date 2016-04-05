System.register(['angular2/core'], function(exports_1, context_1) {
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
    var core_1;
    var ModalComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            ModalComponent = (function () {
                function ModalComponent() {
                    this.loaded = false;
                    this.bodyOpenClass = 'modal-open';
                    this.splashOpenClass = 'splash-open';
                    this.$body = window.document.querySelector('body');
                }
                ModalComponent.prototype.ngAfterContentInit = function () {
                    var _this = this;
                    setTimeout(function () { return _this.show(); }, 0);
                };
                ModalComponent.prototype.show = function () {
                    this.$splash = this._ref.location.nativeElement.querySelector('.splash');
                    this.$splash.classList.add(this.splashOpenClass);
                    this.$body.classList.add(this.bodyOpenClass);
                };
                ModalComponent.prototype.close = function ($event) {
                    var _this = this;
                    this.$splash.classList.remove(this.splashOpenClass);
                    this.$body.classList.remove(this.bodyOpenClass);
                    setTimeout(function () {
                        _this._ref.dispose();
                    }, 500);
                    this.prevent($event);
                    return false;
                };
                ModalComponent.prototype.prevent = function ($event) {
                    if ($event) {
                        $event.stopPropagation();
                    }
                };
                ModalComponent = __decorate([
                    core_1.Component({
                        selector: 'modal',
                        template: "\n\t\t<section class=\"splash\">\n\t\t\t<div class=\"splash-inner\">\n\t\t\t\t<div class=\"container\" (click)=\"prevent($event)\">\n\t\t\t\t\t<button class=\"close text-right\" type=\"button\" (click)=\"close($event)\"><span class=\"glyphicon glyphicon-remove-circle\"></span></button>\n\t\t\t\t\t<comp #comp [hidden]=\"loaded\" style=\"text-center\">Loading...</comp>\t\t\t\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</section>"
                    }), 
                    __metadata('design:paramtypes', [])
                ], ModalComponent);
                return ModalComponent;
            }());
            exports_1("ModalComponent", ModalComponent);
        }
    }
});
