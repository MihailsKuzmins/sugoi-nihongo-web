import InputItemComponent, { InputItem } from 'components/system/items/InputItemComponent'
import ClickableTextComponent, { ClickableText } from 'components/system/misc/ClickableTextComponent'
import FormAlertComponent, { FormAlert } from 'components/system/misc/FormAlertComponent'
import LoadingButtonComponent, { LoadingButton } from 'components/system/misc/LoadingButtonComponent'
import { NightModeProps } from 'components/_hoc/withNightMode'
import { getAuthResultMessage } from 'functions/auth/authResultFunctions'
import { hideModal, setModalNonCancellable, showModal } from 'functions/uiFunctions'
import NotNullOrWhiteSpaceRule from 'helpers/items/rules/notNullOrWhiteSpaceRule'
import useGlobalState from 'helpers/useGlobalState'
import SignInLocationState from 'models/auth/signInLocationState'
import { PromiseCompletionSource } from 'promise-completion-source'
import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import FirebaseAuthError from 'resources/errors/firebaseAuthError'
import { AuthResult } from 'resources/misc/authResult'
import { home } from 'resources/routing/routes'
import { lightTextColor, nightTextColor } from 'resources/ui/colors'
import { InputType } from 'resources/ui/inputType'
import { ReplaySubject } from 'rxjs'
import AuthService from 'services/authService'
import { container } from 'tsyringe'

const AuthSignInComponent: React.FC<RouteComponentProps<{}, {}, SignInLocationState>> = (props) => {
	const message = props.location.state?.message

	const isAuthSubject = new ReplaySubject<boolean>(1)
	const [, setIsAuth] = useGlobalState('isAuthenticated')
	const [isNightMode,] = useGlobalState('isNightMode')

	useEffect(() => {
		const isAuthDisp = isAuthSubject
			.subscribe(x => {
				setIsAuth(x)
				props.history.replace(home)
			})

		return () => {
			isAuthDisp.unsubscribe()
			isAuthSubject.unsubscribe()
		}
	})

	return <SignInComponentImpl setIsAuth={x => isAuthSubject.next(x)} message={message} isNightMode={isNightMode} />
}

export default AuthSignInComponent

class SignInComponentImpl extends React.Component<Props> {
	private readonly mAuthService = container.resolve(AuthService)
	private readonly mForgotPasswordEmailFormId = 'forgotPasswordEmailForm'

	private readonly mFormAlert = new FormAlert()
	private readonly mLoadingButton = new LoadingButton('Sign in', 'Signing in...')

	private readonly mEmailItem = new InputItem(undefined, 'authEmail', 'E-mail', InputType.Email)
	private readonly mPasswordItem = new InputItem(undefined, 'authPassword', 'Password', InputType.Password)

	private readonly mForgotPasswordText: ClickableText
	private readonly mResendEmailVerification: ClickableText

	private mForgotPasswordEmailCompletionSource = new PromiseCompletionSource<string | undefined>()

	constructor(props: Props) {
		super(props)

		this.mForgotPasswordText = new ClickableText('Forgot password?', this.handleForgotPasswordAsync)
		this.mResendEmailVerification = new ClickableText('Resent E-mail verification', this.handleResendEmailVerification, false)
		
		if (props.message)
			this.mFormAlert.alertSuccess(props.message)
	}

	public readonly render = () => {
		const helpLinks = [this.mForgotPasswordText, this.mResendEmailVerification]
		const textColor = this.props.isNightMode
			? nightTextColor
			: lightTextColor

		return (
			<div className="container mt-2">
				<FormAlertComponent alert={this.mFormAlert} />
				<form className="col-10 col-sm-8 col-md-6 m-auto" onSubmit={this.handleSubmitAsync}>
					<div className="form-group">
						<InputItemComponent item={this.mEmailItem} isNightMode={this.props.isNightMode} />
						<InputItemComponent item={this.mPasswordItem} isNightMode={this.props.isNightMode} />
					</div>
					<LoadingButtonComponent button={this.mLoadingButton} isNightMode={this.props.isNightMode} />
					<div className="row mt-3">
						{
							helpLinks.map((x, i) => (
								<div className="col-12" key={i} style={{color: textColor}}>
									<ClickableTextComponent clickableText={x} />
								</div>
							))
						}
					</div>
				</form>
				<ForgotPasswordEmailFormComponent
					formId={this.mForgotPasswordEmailFormId}
					authService={this.mAuthService}
					completionSource={() => this.mForgotPasswordEmailCompletionSource}
					isNightMode={this.props.isNightMode} />
			</div>
		)
	}

	private readonly handleSubmitAsync = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		this.mLoadingButton.start()

		const email = this.mEmailItem.value
		const password = this.mPasswordItem.value

		try {
			await this.mAuthService.signInAsync(email, password)
			this.props.setIsAuth(true)
		} catch (e) {
			const error = e as FirebaseAuthError
			const alertMessage = getAuthResultMessage(error.authResult)

			// Firebase can resend the verification only for authorised users
			this.mResendEmailVerification.isVisible = error.authResult === AuthResult.EmailNotVerified
			this.mFormAlert.alertError(alertMessage)
		} finally {
			this.mLoadingButton.stop()
		}
	}

	private readonly handleForgotPasswordAsync = async () => {
		if (this.mForgotPasswordEmailCompletionSource.completed)
			this.mForgotPasswordEmailCompletionSource = new PromiseCompletionSource<string | undefined>()

		showModal(this.mForgotPasswordEmailFormId)
		const message = await this.mForgotPasswordEmailCompletionSource.promise

		if (!message)
			return

		this.mFormAlert.alertSuccess(message)
	}

	private readonly handleResendEmailVerification = async () => {
		try {
			await this.mAuthService.resendEmailVerificationAsync()
		} catch (e) {
			const error = e as FirebaseAuthError
			const alertMessage = getAuthResultMessage(error.authResult)
			this.mFormAlert.alertError(alertMessage)
		}
	}
}

interface Props extends NightModeProps {
	setIsAuth: (isAuth: boolean) => void,
	message: string | undefined
}

class ForgotPasswordEmailFormComponent extends React.Component<ForgotPasswordFormProps> {
	private readonly mFormAlert = new FormAlert()
	private readonly mLoadingButton = new LoadingButton('Send verification', 'Sending...')

	private readonly mEmailItem = new InputItem('', 'forgotPwdEmail', 'E-mail address', InputType.Email)
		.addRule(new NotNullOrWhiteSpaceRule())

	public readonly componentDidMount = () => {
		super.componentDidMount?.()
		setModalNonCancellable(this.props.formId)
	}

	public readonly render = () => (
		<div className="modal fade m-0" id={this.props.formId} tabIndex={-1} role="dialog" aria-labelledby="forgotPasswordForm" aria-hidden="true">
			<div className="modal-dialog" role="document">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">Verify your E-mail</h5>
					</div>
					<div className="modal-body">
						<p>Please enter your E-mail address. We will send an e-mail with further instructions</p>
						<FormAlertComponent alert={this.mFormAlert} />
						<form onSubmit={this.handleSubmitAsync}>
							<div className="mb-2">
								<InputItemComponent item={this.mEmailItem} isNightMode={this.props.isNightMode} />
							</div>
							<LoadingButtonComponent button={this.mLoadingButton} isNightMode={this.props.isNightMode} />
							<button type="button" className="btn btn-outline-danger col-12 mt-2" onClick={this.handleCloseAsync}>Cancel</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	)

	private readonly handleSubmitAsync = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (!this.mEmailItem.isValid)
			return

		const email = this.mEmailItem.value
		this.mLoadingButton.start()

		try {
			await this.props.authService.sendPasswordResetEmailAsync(email)
			await this.props.completionSource().resolve(`Verification has been reset to ${email}`)
		} catch (e) {
			const error = e as FirebaseAuthError
			const alertMessage = getAuthResultMessage(error.authResult)
			this.mFormAlert.alertError(alertMessage)
		} finally {
			this.mLoadingButton.stop()
		}
	}

	private readonly handleCloseAsync = async () => {
		hideModal(this.props.formId)
		await this.props.completionSource().resolve(undefined)
	}
}

interface ForgotPasswordFormProps extends NightModeProps {
	formId: string,
	authService: AuthService,
	completionSource: () => PromiseCompletionSource<string | undefined>
}