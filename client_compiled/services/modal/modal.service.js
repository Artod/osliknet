System.register(['angular2/core', './modal.component'], function(exports_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, modal_component_1;
    var ModalService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (modal_component_1_1) {
                modal_component_1 = modal_component_1_1;
            }],
        execute: function() {
            ModalService = (function () {
                function ModalService(_componentLoader, _appRef) {
                    this._componentLoader = _componentLoader;
                    this._appRef = _appRef;
                }
                ModalService.prototype.show = function (Component, providers) {
                    var _this = this;
                    var promise = this.open().then(function (modalComponentRef) {
                        return _this.bind(Component, modalComponentRef, providers).then(function (componentRef) {
                            return modalComponentRef.instance;
                        });
                    });
                    return promise;
                };
                ModalService.prototype.open = function () {
                    var elementRef = this._appRef['_rootComponents'][0].location;
                    var promise = this._componentLoader.loadNextToLocation(modal_component_1.ModalComponent, elementRef);
                    promise.then(function (modalComponentRef) {
                        modalComponentRef.instance._ref = modalComponentRef;
                        return modalComponentRef;
                    });
                    return promise;
                };
                ModalService.prototype.bind = function (Component, modalComponentRef, providers) {
                    var elementRef = modalComponentRef.location;
                    var promise = this._componentLoader.loadIntoLocation(Component, elementRef, 'comp', providers).then(function (componentRef) {
                        componentRef.instance._modalComponent = modalComponentRef.instance;
                        modalComponentRef.instance.loaded = true;
                        return componentRef;
                    });
                    return promise;
                };
                ModalService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof core_1.DynamicComponentLoader !== 'undefined' && core_1.DynamicComponentLoader) === 'function' && _a) || Object, (typeof (_b = typeof core_1.ApplicationRef !== 'undefined' && core_1.ApplicationRef) === 'function' && _b) || Object])
                ], ModalService);
                return ModalService;
                var _a, _b;
            }());
            exports_1("ModalService", ModalService);
        }
    }
});