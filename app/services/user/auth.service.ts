declare var window: any;

export function user() {
	return window.user;
}

export function isLoggedIn() {
	return !!(window.user && window.user.id);
}