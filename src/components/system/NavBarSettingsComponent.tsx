import { NightModeProps } from 'components/_hoc/withNightMode'
import SubDisposable from 'helpers/disposable/subDisposable'
import useGlobalState from 'helpers/useGlobalState'
import React from 'react'
import { localStorageIsNightMode } from 'resources/constants/localStorageConstants'
import { darkMode, lightMode } from 'resources/constants/uiConstants'
import { lightBackground, lightNavBarColor, lightTextBoldColor, nightBackground, nightNavBarColor, nightTextBoldColor } from 'resources/ui/colors'
import CheckboxItemComponent, { CheckboxItem } from './items/CheckboxItemComponent'

const SettingsFormComponent: React.FC<Props> = (props) => {
	const [isNightMode, setIsNightMode] = useGlobalState('isNightMode')

	const handleIsNightMode = (x: boolean) => {
		localStorage.setItem(localStorageIsNightMode, x.toString())
		setIsNightMode(x)
	}

	return <SettingsFormComponentImpl
		{...props}
		isNightMode={isNightMode}
		setIsNightMode={x => handleIsNightMode(x)} />
}

export default SettingsFormComponent

class SettingsFormComponentImpl extends React.PureComponent<SettingsFormProps> {
	private readonly mSubDisposable = new SubDisposable()
	private readonly mIsNightModeItem = new CheckboxItem('Night mode', 'settingsNightMode')

	constructor(props: SettingsFormProps) {
		super(props)
		
		this.mIsNightModeItem.value = props.isNightMode

		const isNightModeDisp = this.mIsNightModeItem.valueObservable
			.subscribe(x => props.setIsNightMode(x))
		this.mSubDisposable.add(isNightModeDisp)
	}

	public readonly componentWillUnmount = () => {
		this.mSubDisposable.dispose()
		super.componentWillUnmount?.()
	}

	public readonly render = () => {
		const colors: Colors = this.props.isNightMode
			? {textMode: lightMode, bgColor: nightBackground, headerBgColor: nightNavBarColor, textBoldColor: nightTextBoldColor}
			: {textMode: darkMode, bgColor: lightBackground, headerBgColor: lightNavBarColor, textBoldColor: lightTextBoldColor}


		return (
			<div className="modal fade m-0" id={this.props.formId} tabIndex={-1} role="dialog" aria-hidden="true">
				<div className="modal-dialog" role="document">
					<div className="modal-content" style={{backgroundColor: colors.headerBgColor}}>
						<div className="modal-header" style={{color: colors.textBoldColor}}>
							<h5 className="modal-title">Settings</h5>
							<button type="button" className={`close text-${colors.textMode}`} data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body" style={{backgroundColor: colors.bgColor}}>
							<CheckboxItemComponent item={this.mIsNightModeItem} isNightMode={this.props.isNightMode} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

interface Props {
	formId: string,
}

interface SettingsFormProps extends NightModeProps, Props {
	setIsNightMode: (isNightMode: boolean) => void,
}

interface Colors {
	textMode: string,
	bgColor: string,
	headerBgColor: string,
	textBoldColor: string
}