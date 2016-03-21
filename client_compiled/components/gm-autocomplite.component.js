System.register(['angular2/core', '../services/maps-api-loader/lazy-maps-api-loader', 'angular2/common'], function(exports_1) {
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
                    __metadata('design:type', (typeof (_a = typeof common_1.ControlGroup !== 'undefined' && common_1.ControlGroup) === 'function' && _a) || Object)
                ], GmAutocompliteComponent.prototype, "form", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], GmAutocompliteComponent.prototype, "model", void 0);
                GmAutocompliteComponent = __decorate([
                    core_1.Component({
                        selector: 'gm-autocomplite',
                        templateUrl: '/client_src/tmpls/gm-autocomplite.html'
                    }), 
                    __metadata('design:paramtypes', [(typeof (_b = typeof lazy_maps_api_loader_1.LazyMapsAPILoader !== 'undefined' && lazy_maps_api_loader_1.LazyMapsAPILoader) === 'function' && _b) || Object, (typeof (_c = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _c) || Object, (typeof (_d = typeof core_1.NgZone !== 'undefined' && core_1.NgZone) === 'function' && _d) || Object])
                ], GmAutocompliteComponent);
                return GmAutocompliteComponent;
                var _a, _b, _c, _d;
            }());
            exports_1("GmAutocompliteComponent", GmAutocompliteComponent);
        }
    }
});