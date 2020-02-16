/* eslint-disable no-extend-native */
declare global {
	interface String {
		some(predicateFn: (char: string) => boolean): boolean,
		every(predicateFn: (char: string) => boolean): boolean
	}
}

String.prototype.some = function(this: String, predicateFn: (char: string) => boolean): boolean {
	for (let i = 0; i < this.length; i++)
		if (predicateFn(this.charAt(i)))
			return true

	return false
}

String.prototype.every = function(this: String, predicateFn: (char: string) => boolean): boolean {
	for (let i = 0; i < this.length; i++)
		if (!predicateFn(this.charAt(i)))
			return false

	return true
}

export{}

export function trimWithEllipsis(text: string, maxLength: number) {
	return text.length <= maxLength
		? text
		: `${text.substr(0, maxLength).trimEnd()}...`
}
	

export function removeWhiteSpaces(text: string) {
	return text.trim().replace(/\s/g, ' ')
}

export function isNullOrWhiteSpace(text: string) {
	return !text || !text.trim();
}