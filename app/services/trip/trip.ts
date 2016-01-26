import {Comment} from './comment';

export interface Trip {
    when: string,
	from: string,
	from_id: string,
	to: string,
	to_id: string,
	description: string,
	is_removed: boolean,
	comments: Comment[],
	created_at: string,
	updated_at: string
}