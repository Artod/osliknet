import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
  name: 'toDate',
  pure: false
})

export class ToDatePipe implements PipeTransform {  
	transform(value:string, args:string[]):any {
		return new Date(value);
	}
}