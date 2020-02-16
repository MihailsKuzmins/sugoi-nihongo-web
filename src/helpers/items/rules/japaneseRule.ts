import RuleBase from 'helpers/items/rules/ruleBase'
import { isJapanese } from 'wanakana'

export default class JapaneseRule extends RuleBase<string> {
	constructor() {
		super('Input must be in Japanese')
		
	}

	public validate(value: string) {
		return isJapanese(value)
	}
}