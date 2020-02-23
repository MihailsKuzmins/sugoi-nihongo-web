import ItemComponentBase, { ItemBase } from 'components/system/items/ItemComponentBase'
import MaxLengthRule from 'helpers/items/rules/maxLengthRule'
import RuleBase from 'helpers/items/rules/ruleBase'
import React from 'react'
import { NightModeProps } from 'components/_hoc/withNightMode'
import { nightTextColor, lightTextColor, nightTextBoldColor, lightTextBoldColor, nightBackground, lightBackground, lightInputDisabled, nightInputDisabled } from 'resources/ui/colors'

export default class TextAreaItemComponent extends ItemComponentBase<string, Props, State> {
	constructor(props: Props) {
		super(props)
		
		this.state = {
			...this.getInitialState(props)
		}
	}

	public readonly render = () => {
		const { id, label, placeholder, rows } = this.props.item
		const textareaClassName = 'form-control' + (this.state.isValid ? '' : ' is-invalid')

		const colors: Colors = this.props.isNightMode
			? {textColor: nightTextColor, textBoldColor: nightTextBoldColor, bgColor: nightBackground, inputDisabled: nightInputDisabled}
			: {textColor: lightTextColor, textBoldColor: lightTextBoldColor, bgColor: lightBackground, inputDisabled: lightInputDisabled}

		const inputBgColor = this.state.isDisabled
			? colors.inputDisabled
			: colors.bgColor

		return (
			<div className="form-group">
				<label className="float-left" htmlFor={id} style={{color: colors.textColor}}>
					{label}:
				</label>
				<textarea id={id} rows={rows} placeholder={placeholder} value={this.state.value} onChange={this.handleChange}
					disabled={this.state.isDisabled} className={textareaClassName}
					style={{backgroundColor: inputBgColor, color: colors.textBoldColor}} />

				{!this.state.isValid && this.state.errorMessage &&
					<div className="invalid-feedback text-left">
						{this.state.errorMessage}
					</div>
				}
			</div>
		)
	}

	private readonly handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		this.props.item.value = event.target.value
	}
}

export class TextAreaItem extends ItemBase<string> {
	constructor(
		label: string,
		public readonly id: string,
		public readonly placeholder: string,
		public readonly rows: number = 3) {
		super(label, '')
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

interface Props extends NightModeProps {
	item: TextAreaItem
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