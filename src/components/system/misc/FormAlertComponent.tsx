import SubDisposable from 'helpers/disposable/subDisposable'
import React from 'react'
import { Observable, ReplaySubject } from 'rxjs'
import { startWith } from 'rxjs/operators'

export default class FormAlertComponent extends React.PureComponent<Props, State> {
	private readonly mSubDisposable = new SubDisposable()

	constructor(props: Props) {
		super(props)
		
		this.state = {
			alertMessage: props.alert.alertMessage
		}
	}

	public readonly componentDidMount = () => {
		super.componentDidMount?.()

		const alertMessageDisp = this.props.alert
			.alertMessageObservable
			.subscribe(x => this.setState({alertMessage: x}))
		this.mSubDisposable.add(alertMessageDisp)
	}

	public readonly componentWillUnmount = () => {
		this.mSubDisposable.dispose()
		super.componentWillUnmount?.()
	}

	public readonly render = () => {
		if (!this.state.alertMessage)
			return null

		return (
			<div className="alert alert-danger alert-dismissible fade show" role="alert">
				<strong>Error.</strong> {this.state.alertMessage}
				<button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={this.handleClose}>
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
		)
	}

	private readonly handleClose = () =>
		this.props.alert.reset()
}

export class FormAlert {
	private readonly mAlertMessageSubject = new ReplaySubject<string | undefined>(1)
	private readonly mAlertMessageObservable: Observable<string | undefined>
	private mAlertMessage: string | undefined

	constructor() {
		this.mAlertMessageObservable = this.mAlertMessageSubject
			.asObservable()
			.pipe(startWith(this.mAlertMessage))
	}

	public get alertMessage() { return this.mAlertMessage }
	public set alertMessage(alertMessage: string | undefined) {
		if (this.mAlertMessage === alertMessage)
			return

		this.mAlertMessage = alertMessage
		this.mAlertMessageSubject.next(alertMessage)
	}

	public get alertMessageObservable() { return this.mAlertMessageObservable }

	public reset() {
		this.alertMessage = undefined
	}
}

interface Props {
	alert: FormAlert
}

interface State {
	alertMessage: string | undefined
}