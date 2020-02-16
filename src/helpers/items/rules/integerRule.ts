import RuleBase from 'helpers/items/rules/ruleBase'

export default class IntegerRule extends RuleBase<string> {
	private readonly mCheck: ((value: number) => boolean) | undefined

	constructor(check: ((value: number) => boolean) | undefined = undefined) {
		super('Input must be a valid integer')

		this.mCheck = check
	}

	public validate(value: string) {
		const number = Number(value)
		
		if (!Number.isInteger(number))
			return false

		return this.mCheck?.(number) ?? true
	}
}