import { isKanji } from 'wanakana'
import 'functions/stringFunctions'

export function hasKanji(value: string) {
	return value.some(x => isKanji(x))
}

export function hasNoKanji(value: string) {
	return value.every(x => !isKanji(x))
}