/* eslint-disable no-extend-native */
declare global {
	interface Array<T> {
		firstOrDefault<T>(predicate: (item: T) => boolean): T | undefined
	}
}

Array.prototype.firstOrDefault = function<T>(this: T[], predicate: (item: T) => boolean): T | undefined {
	for (let i = 0; i < this.length; i++) {
		if (predicate(this[i]))
			return this[i]
	}

	return undefined
}

export{}