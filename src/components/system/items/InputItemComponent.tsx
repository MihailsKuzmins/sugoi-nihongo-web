import ItemComponentBase, { ItemBase } from 'components/system/items/ItemComponentBase'
import MaxLengthRule from 'helpers/items/rules/maxLengthRule'
import RuleBase from 'helpers/items/rules/ruleBase'
import React from 'react'
import { InputType } from 'resources/ui/inputType'
import { nightTextColor, nightBackground, lightTextColor, lightBackground, nightTextBoldColor, lightTextBoldColor, nightInputDisabled, lightInputDisabled } from 'resources/ui/colors'

export default class InputItemComponent extends ItemComponentBase<string, Props, State> {
	constructor(props: Props) {
		super(props)
		
		this.state = {
			...this.getInitialState(props)
		}
	}

	public readonly render = () => {
		const { inputType, label, id, placeholder } = this.props.item
		const inputClassName = 'form-control' + (this.state.isValid ? '' : ' is-invalid')

		const colors: Colors = this.props.isNightMode
			? {textColor: nightTextColor, textBoldColor: nightTextBoldColor, bgColor: nightBackground, inputDisabled: nightInputDisabled}
			: {textColor: lightTextColor, textBoldColor: lightTextBoldColor, bgColor: lightBackground, inputDisabled: lightInputDisabled}

		const inputBgColor = this.state.isDisabled
			? colors.inputDisabled
			: colors.bgColor

		return (
			<div className="form-group">
				{label &&
					<label className="control-label float-left" htmlFor={id} style={{color: colors.textColor}}>
						{label}:
					</label>
				}
				<input id={id} type={inputType} placeholder={placeholder} value={this.state.value} onChange={this.handleChange}
					disabled={this.state.isDisabled} style={{backgroundColor: inputBgColor, color: colors.textBoldColor}}
					className={inputClassName} autoComplete="off"/>
				
				{!this.state.isValid && this.state.errorMessage &&
					<div className="invalid-feedback text-left">
						{this.state.errorMessage}
					</div>
				}
			</div>
		)
	}

	private readonly handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.props.item.value = event.target.value
	}
}

export class InputItem extends ItemBase<string> {
	constructor(
		label: string | undefined,
		public readonly id: string,
		public readonly placeholder: string,
		public readonly inputType: InputType = InputType.Text) {
		super(label ?? '', '')
	}

	public setMaxLength(maxLength: number) {
		return this.addRule(new MaxLengthRule(maxLength))
	}

	public addRule(rule: RuleBase<string>) {
		super.addRule(rule)
		return this
	}

	public addRules(...rules: RuleBase<string>[]) {
		super.addRules(...rules)
		return this
	}
}

interface Props {
	item: InputItem,
	isNightMode: boolean
}

interface State {
	value: string,
	isDisabled: boolean,
	isValid: boolean,
	errorMessage: string | undefined
}

interface Colors {
	textColor: string,
	textBoldColor: string,
	bgColor: string,
	inputDisabled: string
}