import { AuthResult } from 'resources/misc/authResult'

export function getAuthResultMessage(authResult: AuthResult) {
	switch (authResult) {
		case AuthResult.EmailNotVerified:
			return 'Email is not verified'
		case AuthResult.InvalidEmail:
			return 'Email is incorrect'
		case AuthResult.UserNotFound:
			return 'Specified user has not been identified'
		case AuthResult.EmailAlreadyTaken:
			return 'Specified e-mail addres is already in use'
		case AuthResult.Unknown:
		default:
			return 'Unknown error'
	}
}