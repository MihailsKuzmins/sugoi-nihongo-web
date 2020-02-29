import Octicon, { Gear, Icon, KebabHorizontal, Person, SignOut } from '@primer/octicons-react'
import { showModal } from 'functions/uiFunctions'
import useGlobalState from 'helpers/useGlobalState'
import React from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { authAccount, authSignIn, authSignUp, grammarRuleList, home, publicApps, sentenceList, wordList } from 'resources/routing/routes'
import AuthService from 'services/authService'
import ThemeService from 'services/ui/themeService'
import { container } from 'tsyringe'
import { darkMode, lightMode } from 'resources/constants/uiConstants'

const NavBarComponent: React.FC<Props> = (props) => {
	const authService = container.resolve(AuthService)
	const themeService = container.resolve(ThemeService)

	const {isNightMode, backgroundColor, backgroundColorDark, textColor} = themeService

	const [isAuth, setIsAuth] = useGlobalState('isAuthenticated')

	function handleSettings() {
		showModal(props.settingsFormId)
	}

	function handleAccount() {
		props.history.push(authAccount)
	}

	async function handleSignOutAsync() {
		await authService.signOutAsync()
		setIsAuth(false)
		props.history.replace(home)
	}

	const navLinks = isAuth
		? [
			{ path: wordList, label: 'Words' },
			{ path: sentenceList, label: 'Sentences' },
			{ path: grammarRuleList, label: 'Grammar rules' },
		] : [
			{ path: publicApps, label: 'Apps' }
		]

	const navbarMode = isNightMode ? darkMode : lightMode

	return (
		<nav className={`navbar navbar-expand-lg navbar-${navbarMode} sticky-top`}
			style={{backgroundColor: backgroundColorDark}}>
			<Link className="navbar-brand" to={home}>すごい日本語</Link>
			<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mainNavBarToggler" aria-controls="mainNavBarToggler" aria-expanded="false" aria-label="Toggle navigation">
				<span className="navbar-toggler-icon"></span>
			</button>
			<div className="collapse navbar-collapse" id="mainNavBarToggler">
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
							style={{color: textColor}}>
							<Octicon icon={KebabHorizontal} height={33}/>
						</button>
						<div className="dropdown-menu" style={{backgroundColor: backgroundColor}}>
							{createOverflowMenuItem('Settings', Gear, handleSettings, themeService)}
							{isAuth &&
								<div>
									{createOverflowMenuItem('Account', Person, handleAccount, themeService)}
									<div className="dropdown-divider"></div>
									{createOverflowMenuItem('Sign out', SignOut, handleSignOutAsync, themeService)}
								</div>
							}
						</div>
					</div>
				</div>
			</div>
		</nav>
	)
}

export default withRouter(NavBarComponent)

const createOverflowMenuItem = (text: string, icon: Icon, onClick: () => void, themeService: ThemeService) => {
	const {mode, textColor} = themeService

	return (
		<button className={`dropdown-item dropdown-item-${mode}`} type="button" onClick={onClick} style={{color: textColor}}>
			<Octicon icon={icon} height={20}/>
			<span className="pl-2">{text}</span>
		</button>
	)
}

interface Props extends RouteComponentProps {
	settingsFormId: string
}