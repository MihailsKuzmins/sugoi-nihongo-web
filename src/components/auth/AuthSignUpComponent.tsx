import InputItemComponent, { InputItem } from 'components/system/items/InputItemComponent'
import FormAlertComponent, { FormAlert } from 'components/system/misc/FormAlertComponent'
import LoadingButtonComponent, { LoadingButton } from 'components/system/misc/LoadingButtonComponent'
import { getAuthResultMessage } from 'functions/auth/authResultFunctions'
import EqualToRule from 'helpers/items/rules/equalToRule'
import MinLengthRule from 'helpers/items/rules/minLengthRule'
import SignInLocationState from 'models/auth/signInLocationState'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { minPasswordLength } from 'resources/constants/authConstants'
import FirebaseAuthError from 'resources/errors/firebaseAuthError'
import { authSignIn } from 'resources/routing/routes'
import { InputType } from 'resources/ui/inputType'
import { skip } from 'rxjs/operators'
import AuthService from 'services/authService'
import { container } from 'tsyringe'

export default class AuthSignUpComponent extends React.Component<Props> {
	private readonly mAuthService = container.resolve(AuthService)

	private readonly mFormAlert = new FormAlert()
	private readonly mLoadingButton = new LoadingButton('Sign up', 'Signing up...')

	private readonly mEmailItem = new InputItem(undefined, 'authEmail', 'E-mail', InputType.Email)
	private readonly mPasswordItem = new InputItem(undefined, 'authPassword', 'Password', InputType.Password)
	private readonly mPasswordConfirmItem = new InputItem(undefined, 'authPasswordConfirm', 'Confirm password', InputType.Password)

	constructor(props: Props) {
		super(props)

		const passwordEqualityRule = new EqualToRule(() => this.mPasswordConfirmItem.value, 'Passwords must be equal')
		this.mPasswordItem.addRules(passwordEqualityRule, new MinLengthRule(minPasswordLength))
		
		// Skip initial values, no need to re-validate them
		const passwordChanged = this.mPasswordItem
			.valueObservable
			.pipe(skip(1))

		const passwordConfirmChanged = this.mPasswordConfirmItem
			.valueObservable
			.pipe(skip(1))

		this.mPasswordItem.addValidationTrigger(passwordConfirmChanged)
		this.mPasswordConfirmItem.addValidationTrigger(passwordChanged)
	}

	public readonly render = () => (
		<div className="container mt-2">
			<FormAlertComponent alert={this.mFormAlert} />
			<form className="col-10 col-sm-8 col-md-6 m-auto" onSubmit={this.handleSubmitAsync}>
				<div className="form-group">
					<InputItemComponent item={this.mEmailItem} />
					<InputItemComponent item={this.mPasswordItem} />
					<InputItemComponent item={this.mPasswordConfirmItem} />
				</div>
				<LoadingButtonComponent button={this.mLoadingButton} />
			</form>
		</div>
	)

	private readonly handleSubmitAsync = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		
		if (!this.mPasswordItem.isValid)
			return

		this.mLoadingButton.start()

		const email = this.mEmailItem.value
		const password = this.mPasswordItem.value
		
		try {
			await this.mAuthService.signUpAsync(email, password)

			const locationState: SignInLocationState = {
				message: `E-mail verification has been sent to ${email}. Please check your email address`
			}

			this.props.history.push(authSignIn, locationState)
		} catch (e) {
			const error = e as FirebaseAuthError
			const alertMessage = getAuthResultMessage(error.authResult)
			this.mFormAlert.alertError(alertMessage)
		} finally {
			this.mLoadingButton.stop()
		}
	}
}

interface Props extends RouteComponentProps {}