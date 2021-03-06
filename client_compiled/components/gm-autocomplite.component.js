System.register(['angular2/core', '../services/maps-api-loader/lazy-maps-api-loader', 'angular2/common'], function(exports_1, context_1) {
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
    var core_1, lazy_maps_api_loader_1, common_1;
    var GmAutocompliteComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (lazy_maps_api_loader_1_1) {
                lazy_maps_api_loader_1 = lazy_maps_api_loader_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            }],
        execute: function() {
            GmAutocompliteComponent = (function () {
                function GmAutocompliteComponent(_loader, _el, _zone) {
                    this._loader = _loader;
                    this._el = _el;
                    this._zone = _zone;
                    this.newPlace = new core_1.EventEmitter();
                    this.isInvalid = false;
                    this._currentCity = '';
                }
                GmAutocompliteComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    var $inputs = this._el.nativeElement.querySelectorAll('input'), $place = $inputs[0], $place_id = $inputs[1];
                    this._loader.load().then(function () {
                        _this.init($place, $place_id);
                    });
                    this._currentCity = this.model[this.name_place];
                };
                GmAutocompliteComponent.prototype.init = function ($place, $place_id) {
                    var autocomplete = new google.maps.places.Autocomplete($place, {
                        types: ['(cities)']
                    });
                    var that = this;
                    google.maps.event.addListener(autocomplete, 'place_changed', function () {
                        var place = this.getPlace();
                        that._zone.run(function () {
                            that._currentCity = $place.value;
                            that.model[that.name_place] = that._currentCity;
                            that.model[that.name_id] = place.place_id;
                            that.newPlace.emit(place);
                        });
                    });
                };
                GmAutocompliteComponent.prototype.check = function (value) {
                    if (this._currentCity && value !== this._currentCity) {
                        this._currentCity = '';
                        this.model[this.name_place] = '';
                        this.model[this.name_id] = '';
                    }
                };
                GmAutocompliteComponent.prototype.onEnter = function ($event, value) {
                    if (value && value !== this._currentCity) {
                        $event.preventDefault();
                        this.check();
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], GmAutocompliteComponent.prototype, "name_place", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], GmAutocompliteComponent.prototype, "name_id", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], GmAutocompliteComponent.prototype, "class", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], GmAutocompliteComponent.prototype, "placeholder", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', common_1.ControlGroup)
                ], GmAutocompliteComponent.prototype, "form", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], GmAutocompliteComponent.prototype, "model", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], GmAutocompliteComponent.prototype, "newPlace", void 0);
                GmAutocompliteComponent = __decorate([
                    core_1.Component({
                        selector: 'gm-autocomplite',
                        templateUrl: '/client_src/tmpls/gm-autocomplite.html'
                    }), 
                    __metadata('design:paramtypes', [lazy_maps_api_loader_1.LazyMapsAPILoader, core_1.ElementRef, core_1.NgZone])
                ], GmAutocompliteComponent);
                return GmAutocompliteComponent;
            }());
            exports_1("GmAutocompliteComponent", GmAutocompliteComponent);
        }
    }
});
