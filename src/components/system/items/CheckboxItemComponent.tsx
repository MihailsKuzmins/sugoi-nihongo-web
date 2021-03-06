import ItemComponentBase, { ItemBase } from 'components/system/items/ItemComponentBase'
import React from 'react'

export default class CheckboxItemComponent extends ItemComponentBase<boolean, Props, State> {
	constructor(props: Props) {
		super(props)
		
		this.state = {
			...this.getInitialState(props)
		}
	}

	public readonly render = () => {
		const { id, label } = this.props.item
		const { value, isDisabled } = this.state
		const { textColor } = this.themeService

		return (
			<div className="custom-control custom-checkbox text-left">
				<input id={id} checked={value} disabled={isDisabled} onChange={this.handleChange}
					 value="" className="custom-control-input" type="checkbox" />
				<label className="custom-control-label" htmlFor={id} style={{color: textColor}}>
					{label}
				</label>
			</div>
		)
	}

	private readonly handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.props.item.value = event.target.checked
	}
}

export class CheckboxItem extends ItemBase<boolean> {
	constructor(
		label: string,
		public readonly id: string) {
		super(label, false)
	}
}

interface Props {
	item: CheckboxItem
}

interface State {
	value: boolean,
	isDisabled: boolean,
	isValid: boolean,
	errorMessage: string | undefined
}