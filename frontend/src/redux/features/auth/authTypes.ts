export interface AuthState {
	isLoggedIn: boolean;
	userId: string | null;
	profileImage: string;
	email: string | null;
	name: string | null;
}