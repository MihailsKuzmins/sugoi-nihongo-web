export default abstract class RuleBase<T> {
	constructor(public readonly errorMessage: string) {}

	public abstract validate(value: T): boolean
}