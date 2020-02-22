import SubDisposable from 'helpers/disposable/subDisposable'
import React from 'react'
import { AlertType } from 'resources/ui/alertType'
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

		const hasError = this.props.alert.alertType === AlertType.Error

		return (
			<div className={`alert alert-${this.props.alert.alertType} alert-dismissible fade show`} role="alert">
				{hasError && <strong>Error.</strong>} {this.state.alertMessage}
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
	private mAlertType: AlertType
	private mAlertMessage: string | undefined

	constructor(alertType: AlertType | undefined = undefined) {
		this.mAlertType = alertType ?? AlertType.Error

		this.mAlertMessageObservable = this.mAlertMessageSubject
			.asObservable()
			.pipe(startWith(this.mAlertMessage))
	}

	public get alertMessage() { return this.mAlertMessage }
	private set alertMessageInternal(alertMessage: string | undefined) {
		if (this.mAlertMessage === alertMessage)
			return

		this.mAlertMessage = alertMessage
		this.mAlertMessageSubject.next(alertMessage)
	}

	public get alertType() { return this.mAlertType }

	public get alertMessageObservable() { return this.mAlertMessageObservable }

	public alertError(alertMessage: string) {
		this.mAlertType = AlertType.Error
		this.alertMessageInternal = alertMessage
	}

	public alertSuccess(alertMessage: string){
		this.mAlertType = AlertType.Success
		this.alertMessageInternal = alertMessage
	}

	public reset() {
		this.alertMessageInternal = undefined
	}
}

interface Props {
	alert: FormAlert
}

interface State {
	alertMessage: string | undefined
}