import firebase from 'firebase/app'
import 'firebase/auth'
import FirebaseAuthError from 'resources/errors/firebaseAuthError'
import { AuthResult } from 'resources/misc/authResult'
import { singleton } from 'tsyringe'
import { LazyGetter } from 'typescript-lazy-get-decorator'

@singleton()
export default class AuthService {
	@LazyGetter()
	private get auth() { return firebase.auth() }

	public get isAuthenticated() { return this.auth.currentUser?.emailVerified === true }
	public get userId() { return this.auth.currentUser?.uid ?? '' }
	public get userEmail() { return this.auth.currentUser?.email }

	public async signInAsync(email: string, password: string) {
		const user = await this.signInUserAsync(email, password)

		if (!user?.emailVerified)
			throw new FirebaseAuthError(AuthResult.EmailNotVerified)
	}

	public async signUpAsync(email: string, password: string) {
		const user = await this.signUpUserAsync(email, password)

		if (!user)
			throw new FirebaseAuthError(AuthResult.UserNotFound)

		try {
			await user.sendEmailVerification()
		} catch (e) {
			AuthService.rethrowFirebaseAuthError(e)
		}
	}

	public async signOutAsync() {
		await this.auth.signOut()
	}

	public async resendEmailVerificationAsync() {
		const user = this.auth.currentUser

		if (!user)
			throw new FirebaseAuthError(AuthResult.UserNotFound)

		try {
			await user.sendEmailVerification()
		} catch (e) {
			AuthService.rethrowFirebaseAuthError(e)
		}
	}

	public async sendPasswordResetEmailAsync(email: string) {
		try {
			await this.auth.sendPasswordResetEmail(email)
		} catch (e) {
			AuthService.rethrowFirebaseAuthError(e)
		}
	}

	public async changePasswordAsync(currentPassword: string, newPassword: string) {
		const user = await this.reauthenticateAsync(currentPassword)

		if (!user)
			throw new FirebaseAuthError(AuthResult.UserNotFound)

		try {
			await user.updatePassword(newPassword)
		} catch (e) {
			AuthService.rethrowFirebaseAuthError(e)
		}
	}

	private async signInUserAsync(email: string, password: string) {
		try {
			const credential = await this.auth.signInWithEmailAndPassword(email, password)
			return credential.user
		} catch (e) {
			AuthService.rethrowFirebaseAuthError(e)
		}
	}

	private async signUpUserAsync(email: string, password: string) {
		try {
			const credential = await this.auth.createUserWithEmailAndPassword(email, password)
			return credential.user
		} catch (e) {
			AuthService.rethrowFirebaseAuthError(e)
		}
	}

	private async reauthenticateAsync(password: string) {
		const user = this.auth.currentUser
		const email = user?.email

		if (!user || !email)
			throw new FirebaseAuthError(AuthResult.UserNotFound)

		const authCredential = firebase.auth.EmailAuthProvider.credential(email, password)

		try {
			const credential = await user.reauthenticateWithCredential(authCredential)
			return credential.user
		} catch (e) {
			AuthService.rethrowFirebaseAuthError(e)
		}
	}

	private static rethrowFirebaseAuthError(error: any) {
		const authResult = getErrorAuthResult()
		throw new FirebaseAuthError(authResult)
		
		function getErrorAuthResult() {
			if (error.hasOwnProperty('code')) {
				switch (error.code) {
					case 'auth/invalid-email':
						return AuthResult.InvalidEmail
					case 'auth/email-already-in-use':
						return AuthResult.EmailAlreadyTaken
					case 'auth/user-not-found':
					case 'auth/wrong-password':
						return AuthResult.UserNotFound
				}
			}
	
			return AuthResult.Unknown
		}
	}
}