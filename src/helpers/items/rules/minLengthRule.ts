import RuleBase from 'helpers/items/rules/ruleBase'

export default class MinLengthRule extends RuleBase<string> {
	constructor(private readonly mMinLenght: number) {
		super(`Input must be at leaset ${mMinLenght} characters`)
		
		if (mMinLenght < 1 || !Number.isInteger(mMinLenght))
			throw new Error('Max length must be an integer which is greater than zero')
	}

	public validate(value: string): boolean {
		return value.length >= this.mMinLenght
	}
}