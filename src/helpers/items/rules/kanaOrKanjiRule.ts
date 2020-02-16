import RuleBase from 'helpers/items/rules/ruleBase'
import { isKana, isKanji } from 'wanakana'
import 'functions/stringFunctions'

export default class KanaOrKanjiRule extends RuleBase<string> {
	constructor() {
		super('Input must be kana or kanji')
	}
	
	public validate(value: string) {
		return value.every(x => isKanji(x) || isKana(x))
	}
}