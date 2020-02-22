import RuleBase from 'helpers/items/rules/ruleBase'

export default class EqualToRule<T> extends RuleBase<T> {
	constructor(private readonly mValueFunc: () => T, errorMessage: string) {
		super(errorMessage)
	}

	public validate(value: T) {
		return this.mValueFunc() === value
	}
}