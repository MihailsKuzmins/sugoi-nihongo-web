import { hasNoKanji } from 'functions/japaneseFunctions'
import 'functions/systemTypes/stringFunctions'
import RuleBase from 'helpers/items/rules/ruleBase'
import { isJapanese } from 'wanakana'

export default class JapaneseWithoutKanjiRule extends RuleBase<string> {
	constructor() {
		super('Input must be in Japanese without kanji')
		
	}

	public validate(value: string) {
		return isJapanese(value) && hasNoKanji(value)
	}
}