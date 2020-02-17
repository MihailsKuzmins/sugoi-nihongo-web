import 'functions/systemTypes/stringFunctions'
import RuleBase from 'helpers/items/rules/ruleBase'
import { isJapanese } from 'wanakana'

export default class NotJapaneseRule extends RuleBase<string> {
	constructor() {
		super('Input must not be in Japanese')
	}

	public validate(value: string) {
		return value.every(x => !isJapanese(x))
	}
}