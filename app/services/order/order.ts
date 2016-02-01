import {Message} from './message';

export interface Order {
	_id: string,
	trip_id: string,
	uid: string,
	messages: Message[],
	status: number,
	created_at: string,
	updated_at: string
}