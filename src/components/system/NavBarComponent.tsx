import Octicon, { Gear, Icon, KebabHorizontal, Person, SignOut } from '@primer/octicons-react'
import { showModal } from 'functions/uiFunctions'
import useGlobalState from 'helpers/useGlobalState'
import React from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { darkMode, lightMode } from 'resources/constants/uiConstants'
import { authAccount, authSignIn, authSignUp, grammarRuleList, home, publicApps, sentenceList, wordList } from 'resources/routing/routes'
import { lightBackground, lightNavBarColor, lightTextColor, nightBackground, nightNavBarColor, nightTextColor } from 'resources/ui/colors'
import AuthService from 'services/authService'
import { container } from 'tsyringe'

const NavBarComponent: React.FC<Props> = (props) => {
	const [isAuth, setIsAuth] = useGlobalState('isAuthenticated')
	const [isNightMode,] = useGlobalState('isNightMode')

	const authService = container.resolve(AuthService)

	const navLinks = isAuth
		? [
			{ path: wordList, label: 'Words' },
			{ path: sentenceList, label: 'Sentences' },
			{ path: grammarRuleList, label: 'Grammar rules' },
		] : [
			{ path: publicApps, label: 'Apps' }
		]

	const colors: Colors = isNightMode
		? {bgMode: darkMode, bgColor: nightBackground, headerBgColor: nightNavBarColor, textColor: nightTextColor}
		: {bgMode: lightMode, bgColor: lightBackground, headerBgColor: lightNavBarColor, textColor: lightTextColor}

	const handleSettings = () => 
		showModal(props.settingsFormId)

	const handleAccount = () =>
		props.history.push(authAccount)

	const handleSignOutAsync = async () => {
		await authService.signOutAsync()
		setIsAuth(false)
		props.history.replace(home)
	}

	return (
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
	)
}

export default withRouter(NavBarComponent)

const createOverflowMenuItem = (text: string, icon: Icon, onClick: () => void, colors: Colors) => (
	<button className={`dropdown-item dropdown-item-${colors.bgMode}`} type="button" onClick={onClick} style={{color: colors.textColor}}>
		<Octicon icon={icon} height={20}/>
		<span className="pl-2">{text}</span>
	</button>
)

interface Props extends RouteComponentProps {
	settingsFormId: string
}

interface Colors {
	bgMode: string,
	bgColor: string,
	headerBgColor: string,
	textColor: string
}