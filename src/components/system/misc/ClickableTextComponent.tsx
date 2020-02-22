import SubDisposable from 'helpers/disposable/subDisposable'
import React from 'react'
import { Observable, ReplaySubject } from 'rxjs'
import { startWith, distinctUntilChanged } from 'rxjs/operators'
import './ClickableTextComponent.css'

export default class ClickableTextComponent extends React.PureComponent<Props, State> {
	private readonly mSubDisposable = new SubDisposable()

	constructor(props: Props) {
		super(props)
		
		this.state = {isVisible: props.clickableText.isVisible}
	}

	public readonly componentDidMount = () => {
		super.componentDidMount?.()
		this.initSubscriptions(this.mSubDisposable)
	}

	public readonly componentWillUnmount = () => {
		this.mSubDisposable.dispose()
		super.componentWillUnmount?.()
	}

	public readonly render = () => {
		if (!this.state.isVisible)
			return null

		const { text, funcAsync } = this.props.clickableText

		return (
			<p className="text-left m-0">
				<span className="clickable-text" onClick={funcAsync}>{text}</span>
			</p>
		)
	}

	private initSubscriptions(d: SubDisposable) {
		const { isVisibleObservable } = this.props.clickableText

		const isVisibleDisp = isVisibleObservable
			.subscribe(x => this.setState({isVisible: x}))
		d.add(isVisibleDisp)
	}
}

export class ClickableText {
	private readonly mIsVisibleSubject = new ReplaySubject<boolean>(1)
	private readonly mIsVisibleObservable: Observable<boolean>
	private mIsVisible: boolean

	constructor(
		public readonly text: string,
		public readonly funcAsync: () => Promise<void>,
		isVisible: boolean | undefined = undefined) {

		this.mIsVisible = isVisible ?? true

		this.mIsVisibleObservable = this.mIsVisibleSubject
			.asObservable()
			.pipe(
				startWith(this.mIsVisible),
				distinctUntilChanged()
			)
	}

	public get isVisibleObservable() { return this.mIsVisibleObservable }

	public set isVisible(isVisible: boolean) {
		if (this.mIsVisible === isVisible)
			return

		this.mIsVisible = isVisible
		this.mIsVisibleSubject.next(isVisible)
	}
}

interface Props {
	clickableText: ClickableText
}

interface State {
	isVisible: boolean
}