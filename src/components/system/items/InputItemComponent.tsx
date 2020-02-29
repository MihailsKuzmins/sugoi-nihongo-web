import ItemComponentBase, { ItemBase } from 'components/system/items/ItemComponentBase'
import MaxLengthRule from 'helpers/items/rules/maxLengthRule'
import RuleBase from 'helpers/items/rules/ruleBase'
import React from 'react'
import { InputType } from 'resources/ui/inputType'

export default class InputItemComponent extends ItemComponentBase<string, Props, State> {
	constructor(props: Props) {
		super(props)
		
		this.state = {
			...this.getInitialState(props)
		}
	}

	public readonly render = () => {
		const { inputType, label, id, placeholder } = this.props.item
		const { isValid, isDisabled, value, errorMessage } = this.state
		const { textColor, textColorBold, backgroundColor, inputBackgroundColorDisabled } = this.themeService
		
		const inputClassName = 'form-control' + (isValid ? '' : ' is-invalid')
		const inputBgColor = isDisabled ? inputBackgroundColorDisabled : backgroundColor

		return (
			<div className="form-group">
				{label &&
					<label className="control-label float-left" htmlFor={id} style={{color: textColor}}>
						{label}:
					</label>
				}
				<input id={id} type={inputType} placeholder={placeholder} value={value} onChange={this.handleChange}
					disabled={isDisabled} style={{backgroundColor: inputBgColor, color: textColorBold}}
					className={inputClassName} autoComplete="off"/>
				
				{!isValid && errorMessage &&
					<div className="invalid-feedback text-left">
						{errorMessage}
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
}

interface State {
	value: string,
	isDisabled: boolean,
	isValid: boolean,
	errorMessage: string | undefined
}