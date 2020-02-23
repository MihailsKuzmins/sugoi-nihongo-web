import Octicon, { Gear, Icon, KebabHorizontal, Person, SignOut } from '@primer/octicons-react'
import CheckboxItemComponent, { CheckboxItem } from 'components/system/items/CheckboxItemComponent'
import { NightModeProps } from 'components/_hoc/withNightMode'
import { showModal } from 'functions/uiFunctions'
import SubDisposable from 'helpers/disposable/subDisposable'
import useGlobalState from 'helpers/useGlobalState'
import React from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { localStorageIsNightMode } from 'resources/constants/localStorageConstants'
import { darkMode, lightMode } from 'resources/constants/uiConstants'
import { authAccount, authSignIn, authSignUp, grammarRuleList, home, publicApps, sentenceList, wordList } from 'resources/routing/routes'
import { lightBackground, lightNavBarColor, lightTextBoldColor, lightTextColor, nightBackground, nightNavBarColor, nightTextBoldColor, nightTextColor } from 'resources/ui/colors'
import AuthService from 'services/authService'
import { container } from 'tsyringe'

const NavBarComponent: React.FC<RouteComponentProps> = (props) => {
	const [isAuth, setIsAuth] = useGlobalState('isAuthenticated')
	const [isNightMode, setIsNightMode] = useGlobalState('isNightMode')

	const authService = container.resolve(AuthService)
	const settingsFormId = 'settingsForm'

	const navLinks = isAuth
		? [
			{ path: wordList, label: 'Words' },
			{ path: sentenceList, label: 'Sentences' },
			{ path: grammarRuleList, label: 'Grammar rules' },
		] : [
			{ path: publicApps, label: 'Apps' }
		]

	const colors: Colors = isNightMode
		? {bgMode: darkMode, bgColor: nightBackground, headerBgColor: nightNavBarColor, textColor: nightTextColor, textBoldColor: nightTextBoldColor}
		: {bgMode: lightMode, bgColor: lightBackground, headerBgColor: lightNavBarColor, textColor: lightTextColor, textBoldColor: lightTextBoldColor}

	const handleSettings = () => 
		showModal(settingsFormId)

	const handleAccount = () =>
		props.history.push(authAccount)

	const handleSignOutAsync = async () => {
		await authService.signOutAsync()
		setIsAuth(false)
		props.history.replace(home)
	}

	const handleIsNightMode = (x: boolean) => {
		localStorage.setItem(localStorageIsNightMode, x.toString())
		setIsNightMode(x)
	}

	return (
		<div>
			<nav className={`navbar navbar-expand-lg navbar-${colors.bgMode} sticky-top`}
				style={{backgroundColor: colors.headerBgColor}}>
				<Link className="navbar-brand" to={home}>すごい日本語</Link>
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarTogglerDemo02">
					<ul className="navbar-nav mr-auto mt-2 mt-lg-0">
						{
							navLinks.map((x, i) => (
								<li className="nav-item" key={i}>
									<Link className="nav-link" to={x.path}>{x.label}</Link>
								</li>
							))
						}
					</ul>
					{!isAuth &&
						<div>
							<ul className="navbar-nav">
								<li className="nav-item">
									<Link className="nav-link" to={authSignIn}>Sign in</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to={authSignUp}>Sign up</Link>
								</li>
							</ul>
						</div>
					}
					<div className="dropdown">
						<div className="btn-group dropleft">
							<button type="button" className="close px-2 py-1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
								style={{color: colors.textColor}}>
								<Octicon icon={KebabHorizontal} height={33}/>
							</button>
							<div className="dropdown-menu" style={{backgroundColor: colors.bgColor}}>
								{createOverflowMenuItem('Settings', Gear, handleSettings, colors)}
								{isAuth &&
									<div>
										{createOverflowMenuItem('Account', Person, handleAccount, colors)}
										<div className="dropdown-divider"></div>
										{createOverflowMenuItem('Sign out', SignOut, handleSignOutAsync, colors)}
									</div>
								}
							</div>
						</div>
					</div>
				</div>
			</nav>
			<SettingsFormComponent
				formId={settingsFormId}
				isNightMode={isNightMode}
				setIsNightMode={x => handleIsNightMode(x)}
				colors={colors} />
		</div>
	)
}

export default withRouter(NavBarComponent)

const createOverflowMenuItem = (text: string, icon: Icon, onClick: () => void, colors: Colors) => (
	<button className={`dropdown-item dropdown-item-${colors.bgMode}`} type="button" onClick={onClick} style={{color: colors.textColor}}>
		<Octicon icon={icon} height={20}/>
		<span className="pl-2">{text}</span>
	</button>
)

class SettingsFormComponent extends React.PureComponent<SettingsFormProps> {
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
		const textMode = this.props.isNightMode
			? lightMode
			: darkMode

		return (
			<div className="modal fade m-0" id={this.props.formId} tabIndex={-1} role="dialog" aria-hidden="true">
				<div className="modal-dialog" role="document">
					<div className="modal-content" style={{backgroundColor: this.props.colors.headerBgColor}}>
						<div className="modal-header" style={{color: this.props.colors.textBoldColor}}>
							<h5 className="modal-title">Settings</h5>
							<button type="button" className={`close text-${textMode}`} data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body" style={{backgroundColor: this.props.colors.bgColor}}>
							<CheckboxItemComponent item={this.mIsNightModeItem} isNightMode={this.props.isNightMode} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

interface SettingsFormProps extends NightModeProps {
	formId: string,
	setIsNightMode: (isNightMode: boolean) => void,
	colors: Colors
}

interface Colors {
	bgMode: string,
	bgColor: string,
	headerBgColor: string,
	textColor: string,
	textBoldColor: string
}