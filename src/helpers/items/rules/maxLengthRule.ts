import RuleBase from 'helpers/items/rules/ruleBase'

export default class MaxLengthRule extends RuleBase<string> {
	constructor(private readonly mMaxLength: number) {
		super(`Input must not exceed ${mMaxLength} characters`)

		if (mMaxLength < 1 || !Number.isInteger(mMaxLength))
			throw new Error('Max length must be an integer which is greater than zero')
	}
	
	public validate(value: string) {
		return value.length <= this.mMaxLength
	}
}