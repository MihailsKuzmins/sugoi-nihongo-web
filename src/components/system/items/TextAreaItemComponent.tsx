import ItemComponentBase, { ItemBase } from 'components/system/items/ItemComponentBase'
import MaxLengthRule from 'helpers/items/rules/maxLengthRule'
import RuleBase from 'helpers/items/rules/ruleBase'
import React from 'react'

export default class TextAreaItemComponent extends ItemComponentBase<string, Props, State> {
	constructor(props: Props) {
		super(props)
		
		this.state = {
			...this.getInitialState(props)
		}
	}

	public readonly render = () => {
		const { id, label, placeholder, rows } = this.props.item
		const { isDisabled, isValid, value, errorMessage } = this.state
		const { textColor, textColorBold, backgroundColor, inputBackgroundColorDisabled} = this.themeService
		
		const textareaClassName = 'form-control' + (isValid ? '' : ' is-invalid')
		const inputBgColor = isDisabled	? inputBackgroundColorDisabled : backgroundColor

		return (
			<div className="form-group">
				<label className="float-left" htmlFor={id} style={{color: textColor}}>
					{label}:
				</label>
				<textarea id={id} rows={rows} placeholder={placeholder} value={value} onChange={this.handleChange}
					disabled={isDisabled} className={textareaClassName}
					style={{backgroundColor: inputBgColor, color: textColorBold}} />

				{!isValid && errorMessage &&
					<div className="invalid-feedback text-left">
						{errorMessage}
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

interface Props {
	item: TextAreaItem
}

interface State {
	value: string,
	isDisabled: boolean,
	isValid: boolean,
	errorMessage: string | undefined
}