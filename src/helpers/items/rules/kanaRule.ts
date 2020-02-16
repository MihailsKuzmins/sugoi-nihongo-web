import RuleBase from 'helpers/items/rules/ruleBase'
import { isKana } from 'wanakana'

export default class KanaRule extends RuleBase<string> {
	constructor() {
		super('Input must be kana')
		
	}

	public validate(value: string) {
		return isKana(value)
	}
}