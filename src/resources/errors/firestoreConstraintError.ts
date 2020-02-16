export default class FirestoreConstraintError extends Error {
	constructor(public readonly value: string, public readonly field: string, public readonly collection: string) {
		super(`Firestore constraint error. Value: ${value}, field: ${field} collection: ${collection}`)

		Object.setPrototypeOf(this, FirestoreConstraintError.prototype)
	}
}