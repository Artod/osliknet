import {Comment} from './comment';

export interface Trip {
    when: date,
	from: string,
	from_id: string,
	to: string,
	to_id: string,
	description: string,
	is_removed: Boolean,
	comments: Comment[],
	created_at: date,
	updated_at: date
}