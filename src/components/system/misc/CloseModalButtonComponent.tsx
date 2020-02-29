import SubDisposable from 'helpers/disposable/subDisposable'
import React from 'react'
import { darkMode, lightMode } from 'resources/constants/uiConstants'
import { Observable, ReplaySubject } from 'rxjs'
import { startWith } from 'rxjs/operators'
import ThemeService from 'services/ui/themeService'
import { container } from 'tsyringe'

export default class CloseModalButtonComponent extends React.Component<Props, State> {
	private readonly mThemeService = container.resolve(ThemeService)
	private readonly mSubDisposable = new SubDisposable()

	constructor(props: Props) {
		super(props)
		
		this.state = {
			isDisabled: props.button.isDisabled
		}
	}

	public readonly componentDidMount = () => {
		super.componentDidMount?.()

		const isDisabledDisp = this.props.button.isDisabledObservable
			.subscribe(x => this.setState({isDisabled: x}))
		this.mSubDisposable.add(isDisabledDisp)
	}

	public readonly componentWillUnmount = () => {
		this.mSubDisposable.dispose()
		super.componentWillUnmount?.()
	}

	public readonly render = () => {
		const textMode = this.mThemeService.isNightMode
			? lightMode
			: darkMode

		return (
			<button type="button" className={`close text-${textMode}`} data-dismiss="modal" aria-label="Close" disabled={this.state.isDisabled}>
				<span aria-hidden="true">&times;</span>
			</button>
		)
	}
}

export class CloseModalButton {
	private readonly mIsDisabledSubject = new ReplaySubject<boolean>(1)
	private readonly mIsDisabledObservable: Observable<boolean>
	private mIsDisabled = false

	constructor() {
		this.mIsDisabledObservable = this.mIsDisabledSubject.asObservable()
			.pipe(startWith(this.mIsDisabled))
	}

	public get isDisabled() { return this.mIsDisabled }
	public set isDisabled(isDisabled: boolean) {
		if (this.mIsDisabled === isDisabled)
			return

		this.mIsDisabled = isDisabled
		this.mIsDisabledSubject.next(isDisabled)
	}

	public get isDisabledObservable() { return this.mIsDisabledObservable }
}

interface Props {
	button: CloseModalButton
}

interface State {
	isDisabled: boolean
}