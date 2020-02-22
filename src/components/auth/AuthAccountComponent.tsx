import InputItemComponent, { InputItem } from 'components/system/items/InputItemComponent'
import FormAlertComponent, { FormAlert } from 'components/system/misc/FormAlertComponent'
import LoadingButtonComponent, { LoadingButton } from 'components/system/misc/LoadingButtonComponent'
import { getAuthResultMessage } from 'functions/auth/authResultFunctions'
import { hideModal, showModal } from 'functions/uiFunctions'
import EqualToRule from 'helpers/items/rules/equalToRule'
import MinLengthRule from 'helpers/items/rules/minLengthRule'
import NotNullOrWhiteSpaceRule from 'helpers/items/rules/notNullOrWhiteSpaceRule'
import { PromiseCompletionSource } from 'promise-completion-source'
import React from 'react'
import { minPasswordLength } from 'resources/constants/authConstants'
import FirebaseAuthError from 'resources/errors/firebaseAuthError'
import { AlertType } from 'resources/ui/alertType'
import { InputType } from 'resources/ui/inputType'
import { skip } from 'rxjs/operators'
import AuthService from 'services/authService'
import { container } from 'tsyringe'

export default class AuthAccountComponent extends React.Component {
	private readonly mAuthService = container.resolve(AuthService)

	private readonly mFormAlert = new FormAlert(AlertType.Success)
	private readonly mChangePasswordFormId = 'changePasswordForm'
	private changePasswordCompletionSource = new PromiseCompletionSource<string | undefined>()

	public readonly render = () => (
		<div className="container row mt-3">
			<div className="col-12">
				<FormAlertComponent alert={this.mFormAlert} />
			</div>
			<div className="col-12 col-sm-6 text-left">
				<h4 className="col-12">Your e-mail</h4>
				<p className="col-12">{this.mAuthService.userEmail}</p>
			</div>
			<div className="col-12 col-sm-6">
				<button type="button" className="btn btn-outline-dark col-12" onClick={this.handleChangePasswordAsync}>Change password</button>
			</div>
			<ChangePasswordFormComponent 
				formId={this.mChangePasswordFormId}
				authService={this.mAuthService}
				completionSource={() => this.changePasswordCompletionSource}/>
		</div>
	)

	private readonly handleChangePasswordAsync = async () => {
		if (this.changePasswordCompletionSource.completed)
			this.changePasswordCompletionSource = new PromiseCompletionSource<string | undefined>()

		showModal(this.mChangePasswordFormId)
		const message = await this.changePasswordCompletionSource.promise

		if (!message)
			return
		
		this.mFormAlert.alertSuccess(message)
	}
}

class ChangePasswordFormComponent extends React.Component<ChangePasswordFormProps> {
	private readonly mFormAlert = new FormAlert()
	private readonly mLoadingButton = new LoadingButton('Change password', 'Changing...')

	private readonly mCurrentPasswordItem = new InputItem(undefined, 'currentPwd', 'Current password', InputType.Password)
	private readonly mNewPasswordItem = new InputItem(undefined, 'newPwd', 'New password', InputType.Password)
	private readonly mNewPasswordConfirmItem = new InputItem(undefined, 'newPwdConfirm', 'Confirm new password', InputType.Password)

	constructor(props: ChangePasswordFormProps) {
		super(props)

		const notNullOrWhiteSpaceRule = new NotNullOrWhiteSpaceRule()
		const passwordEqualityRule = new EqualToRule(() => this.mNewPasswordConfirmItem.value, 'Passwords must be equal')
		
		this.mCurrentPasswordItem.addRule(notNullOrWhiteSpaceRule)
		this.mNewPasswordItem.addRules(notNullOrWhiteSpaceRule, passwordEqualityRule, new MinLengthRule(minPasswordLength))
		this.mNewPasswordConfirmItem.addRules(notNullOrWhiteSpaceRule)

		// Skip initial values, no need to re-validate them
		const newPasswordChanged = this.mNewPasswordItem
			.valueObservable
			.pipe(skip(1))

		const newPasswordConfirmChanged = this.mNewPasswordConfirmItem
			.valueObservable
			.pipe(skip(1))

		this.mNewPasswordItem.addValidationTrigger(newPasswordConfirmChanged)
		this.mNewPasswordConfirmItem.addValidationTrigger(newPasswordChanged)
	}

	public readonly render = () => (
		<div className="modal fade m-0" id={this.props.formId} tabIndex={-1} role="dialog" aria-labelledby="forgotPasswordForm" aria-hidden="true">
			<div className="modal-dialog" role="document">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">Change the current password</h5>
					</div>
					<div className="modal-body">
						<p>Please verify your current password and enter a new one</p>
						<FormAlertComponent alert={this.mFormAlert} />
						<form onSubmit={this.handleSubmitAsync}>
							<div className="mb-2">
								<InputItemComponent item={this.mCurrentPasswordItem} />
								<InputItemComponent item={this.mNewPasswordItem} />
								<InputItemComponent item={this.mNewPasswordConfirmItem} />
							</div>
							<LoadingButtonComponent button={this.mLoadingButton} />
							<button type="button" className="btn btn-outline-danger col-12 mt-2" onClick={this.handleCloseAsync}>Cancel</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	)

	private readonly handleSubmitAsync = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const isValid = [this.mCurrentPasswordItem, this.mNewPasswordItem, this.mNewPasswordConfirmItem]
			.every(x => x.isValid)

		if (!isValid)
			return

		this.mLoadingButton.start()

		const currentPassword = this.mCurrentPasswordItem.value
		const newPassword = this.mNewPasswordItem.value

		try {
			await this.props.authService.changePasswordAsync(currentPassword, newPassword)
			await this.props.completionSource().resolve('Password has been successfully chnaged')
			hideModal(this.props.formId)
		} catch (e) {
			const authResult = (e as FirebaseAuthError).authResult
			const message = getAuthResultMessage(authResult)
			this.mFormAlert.alertError(message)
		} finally {
			this.mLoadingButton.stop()
		}
	}

	private readonly handleCloseAsync = async () => {
		hideModal(this.props.formId)
		await this.props.completionSource().resolve(undefined)
	}
}

interface ChangePasswordFormProps {
	formId: string,
	authService: AuthService,
	completionSource: () => PromiseCompletionSource<string | undefined>
}