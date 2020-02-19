import firebase from 'firebase/app'
import 'firebase/auth'
import { singleton } from 'tsyringe'
import { LazyGetter } from 'typescript-lazy-get-decorator'

@singleton()
export default class AuthService {
	@LazyGetter()
	private get auth() { return firebase.auth() }

	get isAuthenticated() { return this.auth.currentUser?.emailVerified === true }

	public async signOutAsync() {
		await this.auth.signOut()
	}
}