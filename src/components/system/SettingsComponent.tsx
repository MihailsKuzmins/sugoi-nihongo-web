import { ModalProps } from 'components/_hoc/withClosingModal'
import { NightModeProps } from 'components/_hoc/withNightMode'
import { hideModal } from 'functions/uiFunctions'
import SubDisposable from 'helpers/disposable/subDisposable'
import useGlobalState from 'helpers/useGlobalState'
import React from 'react'
import { localStorageIsNightMode } from 'resources/constants/localStorageConstants'
import { skip } from 'rxjs/operators'
import WindowOnPop from 'services/middleware/windowOnPop'
import ThemeService from 'services/ui/themeService'
import { container } from 'tsyringe'
import CheckboxItemComponent, { CheckboxItem } from './items/CheckboxItemComponent'

const SettingsComponent: React.FC<Props> = (props) => {
	const [isNightMode, setIsNightMode] = useGlobalState('isNightMode')

	const handleSetIsNightMode = (x: boolean) => {
		localStorage.setItem(localStorageIsNightMode, x.toString())
		setIsNightMode(x)
	}

	return <SettingsComponentImpl
		{...props}
		isNightMode={isNightMode}
		setIsNightMode={x => handleSetIsNightMode(x)} />
}

export default SettingsComponent

interface Props extends ModalProps {}

class SettingsComponentImpl extends React.PureComponent<PropsImpl> {
	private readonly mThemeService = container.resolve(ThemeService)
	private readonly mWindowOnPop = container.resolve(WindowOnPop)
	private readonly mOnBackId = 'settingsOnBack'

	private readonly mSubDisposable = new SubDisposable()
	private readonly mIsNightModeItem = new CheckboxItem('Night mode', 'settingsNightMode')

	constructor(props: PropsImpl) {
		super(props)

		this.mWindowOnPop.register(this.mOnBackId, () => hideModal(this.props.formId))

		// Pass `isNightMode` from properties, because themeService has not been initialised when the value is set
		this.mIsNightModeItem.value = props.isNightMode

		const isNightModeDisp = this.mIsNightModeItem.valueObservable
			.pipe(skip(1))
			.subscribe(x => props.setIsNightMode(x))
		this.mSubDisposable.add(isNightModeDisp)
	}

	public readonly componentWillUnmount = () => {
		this.mSubDisposable.dispose()
		this.mWindowOnPop.unregister(this.mOnBackId)
		super.componentWillUnmount?.()
	}

	public readonly render = () => (
		<div className="modal fade m-0" id={this.props.formId} tabIndex={-1} role="dialog" aria-hidden="true">
			<div className="modal-dialog" role="document">
				<div className="modal-content" style={{backgroundColor: this.mThemeService.backgroundColorDark}}>
					<div className="modal-header" style={{color: this.mThemeService.textColorBold}}>
						<h5 className="modal-title">Settings</h5>
						<button type="button" className="close" data-dismiss="modal" aria-label="Close" style={{color: this.mThemeService.textColor}}>
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div className="modal-body" style={{backgroundColor: this.mThemeService.backgroundColor}}>
						<CheckboxItemComponent item={this.mIsNightModeItem} />
					</div>
				</div>
			</div>
		</div>
	)
}

interface PropsImpl extends NightModeProps, Props {
	setIsNightMode: (isNightMode: boolean) => void
}