System.register(['angular2/core', './maps-api-loader'], function(exports_1) {
    "use strict";
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
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
    var core_1, maps_api_loader_1;
    var GoogleMapsScriptProtocol, LazyMapsAPILoaderConfig, DEFAULT_CONFIGURATION, LazyMapsAPILoader;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (maps_api_loader_1_1) {
                maps_api_loader_1 = maps_api_loader_1_1;
            }],
        execute: function() {
            (function (GoogleMapsScriptProtocol) {
                GoogleMapsScriptProtocol[GoogleMapsScriptProtocol["HTTP"] = 0] = "HTTP";
                GoogleMapsScriptProtocol[GoogleMapsScriptProtocol["HTTPS"] = 1] = "HTTPS";
                GoogleMapsScriptProtocol[GoogleMapsScriptProtocol["AUTO"] = 2] = "AUTO";
            })(GoogleMapsScriptProtocol || (GoogleMapsScriptProtocol = {}));
            exports_1("GoogleMapsScriptProtocol", GoogleMapsScriptProtocol);
            LazyMapsAPILoaderConfig = (function () {
                function LazyMapsAPILoaderConfig() {
                    this.apiKey = null;
                    this.apiVersion = '3';
                    this.hostAndPath = 'maps.googleapis.com/maps/api/js';
                    this.protocol = GoogleMapsScriptProtocol.HTTPS;
                    this.params = null;
                }
                return LazyMapsAPILoaderConfig;
            }());
            exports_1("LazyMapsAPILoaderConfig", LazyMapsAPILoaderConfig);
            DEFAULT_CONFIGURATION = new LazyMapsAPILoaderConfig();
            LazyMapsAPILoader = (function (_super) {
                __extends(LazyMapsAPILoader, _super);
                function LazyMapsAPILoader(_config) {
                    _super.call(this);
                    this._config = _config;
                    if (this._config === null || this._config === undefined) {
                        this._config = DEFAULT_CONFIGURATION;
                    }
                }
                LazyMapsAPILoader.prototype.load = function () {
                    if (this._scriptLoadingPromise) {
                        return this._scriptLoadingPromise;
                    }
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.async = true;
                    script.defer = true;
                    var callbackName = "angular2googlemaps" + new Date().getMilliseconds();
                    script.src = this._getScriptSrc(callbackName);
                    this._scriptLoadingPromise = new Promise(function (resolve, reject) {
                        window[callbackName] = function () { resolve(); };
                        script.onerror = function (error) { reject(error); };
                    });
                    document.body.appendChild(script);
                    return this._scriptLoadingPromise;
                };
                LazyMapsAPILoader.prototype._getScriptSrc = function (callbackName) {
                    var protocolType = (this._config && this._config.protocol) || DEFAULT_CONFIGURATION.protocol;
                    var protocol;
                    switch (protocolType) {
                        case GoogleMapsScriptProtocol.AUTO:
                            protocol = '';
                            break;
                        case GoogleMapsScriptProtocol.HTTP:
                            protocol = 'http:';
                            break;
                        case GoogleMapsScriptProtocol.HTTPS:
                            protocol = 'https:';
                            break;
                    }
                    var hostAndPath = this._config.hostAndPath || DEFAULT_CONFIGURATION.hostAndPath;
                    var apiKey = this._config.apiKey || DEFAULT_CONFIGURATION.apiKey;
                    var queryParams = {
                        v: this._config.apiVersion || DEFAULT_CONFIGURATION.apiKey,
                        callback: callbackName
                    };
                    if (apiKey) {
                        queryParams['key'] = apiKey;
                    }
                    var params = Object.keys(queryParams)
                        .map(function (k, i) {
                        var param = (i === 0) ? '?' : '&';
                        return param += k + "=" + queryParams[k];
                    })
                        .join('');
                    var addParams = (this._config && this._config.params) || DEFAULT_CONFIGURATION.params;
                    return protocol + "//" + hostAndPath + params + addParams;
                };
                LazyMapsAPILoader = __decorate([
                    core_1.Injectable(),
                    __param(0, core_1.Optional()), 
                    __metadata('design:paramtypes', [LazyMapsAPILoaderConfig])
                ], LazyMapsAPILoader);
                return LazyMapsAPILoader;
            }(maps_api_loader_1.MapsAPILoader));
            exports_1("LazyMapsAPILoader", LazyMapsAPILoader);
        }
    }
});
