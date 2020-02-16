import RuleBase from 'helpers/items/rules/ruleBase'
import { isNullOrWhiteSpace } from 'functions/stringFunctions'

export default class NotNullOrWhiteSpaceRule extends RuleBase<string> {
	constructor() {
		super('Input must not be empty')
	}

	public validate(value: string) {
		return !isNullOrWhiteSpace(value)
	}
}