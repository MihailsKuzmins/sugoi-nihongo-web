import { AuthResult } from 'resources/misc/authResult'

export default class FirebaseAuthError extends Error {
	constructor(public readonly authResult: AuthResult) {
		super()
	}
}