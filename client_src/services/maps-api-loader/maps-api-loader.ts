/**
 * angular2-google-maps - Angular2 components for Google Maps
 * @version v0.6.0
 * @link https://github.com/SebastianM/angular2-google-maps#readme
 * @license MIT
 */
import {Injectable} from 'angular2/core';

@Injectable()
export abstract class MapsAPILoader {
  abstract load(): Promise<void>;
}
