import SubDisposable from 'helpers/disposable/subDisposable'
import React from 'react'
import { Observable, ReplaySubject } from 'rxjs'
import { startWith } from 'rxjs/operators'
import { NightModeProps } from 'components/_hoc/withNightMode'
import { lightMode, darkMode } from 'resources/constants/uiConstants'

export default class LoadingButtonComponent extends React.PureComponent<Props, State> {
	private readonly mSubDisposable = new SubDisposable()

	constructor(props: Props) {
		super(props)
		
		this.state = {
			isLoading: props.button.isLoading
		}
	}

	public readonly componentDidMount = () => {
		super.componentDidMount?.()

		const isLoadingDisp = this.props.button.isLoadingObservable
			.subscribe(x => this.setState({isLoading: x}))
		this.mSubDisposable.add(isLoadingDisp)
	}

	public readonly componentWillUnmount = () => {
		this.mSubDisposable.dispose()
		super.componentWillUnmount?.()
	}

	public readonly render = () => {
		const { text, loadingText } = this.props.button
		const isLoading = this.state.isLoading
		const mode = this.props.isNightMode ? lightMode : darkMode

		return (
			<button type="submit" className={`btn btn-outline-${mode} col-12`} disabled={isLoading}>
				{isLoading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"/>}
				{isLoading ? loadingText : text}
			</button>
		)
	}
}

export class LoadingButton {
	private readonly mIsLoadingSubject = new ReplaySubject<boolean>(1)
	private readonly mIsLoadingObservable: Observable<boolean>
	private mIsLoading: boolean = false

	constructor(public readonly text: string, public readonly loadingText: string | undefined) {
		if (!loadingText)
			this.loadingText = text

		this.mIsLoadingObservable = this.mIsLoadingSubject.asObservable()
			.pipe(startWith(this.mIsLoading))
	}

	public get isLoading() { return this.mIsLoading }
	public set isLoading(isLoading: boolean) {
		if (this.mIsLoading === isLoading)
			return

		this.mIsLoading = isLoading
		this.mIsLoadingSubject.next(isLoading)
	}

	public get isLoadingObservable() { return this.mIsLoadingObservable }

	public start() {
		this.isLoading = true
	}

	public stop() {
		this.isLoading = false
	}
}

interface Props extends NightModeProps {
	button: LoadingButton
}

interface State {
	isLoading: boolean
}