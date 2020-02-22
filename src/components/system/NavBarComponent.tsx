import Octicon, { Gear, Icon, KebabHorizontal, Person, SignOut } from '@primer/octicons-react'
import useGlobalState from 'helpers/useGlobalState'
import React from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { authAccount, authSignIn, authSignUp, grammarRuleList, home, publicApps, sentenceList, wordList } from 'resources/routing/routes'
import AuthService from 'services/authService'
import { container } from 'tsyringe'

const navLinksAuth: RouteLink[] = [
	{ path: wordList, label: 'Words' },
	{ path: sentenceList, label: 'Sentences' },
	{ path: grammarRuleList, label: 'Grammar rules' },
]

const navLinksUnauth: RouteLink[] = [
	{ path: publicApps, label: 'Apps' }
]

const NavBarComponent: React.FC<RouteComponentProps> = (props) => {
	const authService = container.resolve(AuthService)
	const [isAuth, setIsAuth] = useGlobalState('isAuthenticated')

	const handleSettings = () => {
		console.log('settings')
	}

	const handleAccount = () =>
		props.history.push(authAccount)

	const handleSignOutAsync = async () => {
		await authService.signOutAsync()
		setIsAuth(false)
		props.history.replace(home)
	}

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
			<Link className="navbar-brand" to={home}>すごい日本語</Link>
			<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
				<span className="navbar-toggler-icon"></span>
			</button>

			<div className="collapse navbar-collapse" id="navbarTogglerDemo02">
				<ul className="navbar-nav mr-auto mt-2 mt-lg-0">
					{
						(isAuth ? navLinksAuth : navLinksUnauth).map((x, i) => (
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
						<button type="button" className="close px-2 py-1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							<Octicon icon={KebabHorizontal} height={33}/>
						</button>
						<div className="dropdown-menu">
							{createOverflowMenuItem('Settings', Gear, handleSettings)}
							{isAuth &&
								<div>
									{createOverflowMenuItem('Account', Person, handleAccount)}
									<div className="dropdown-divider"></div>
									{createOverflowMenuItem('Sign out', SignOut, handleSignOutAsync)}
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

interface RouteLink {
	path: string,
	label: string
}

const createOverflowMenuItem = (text: string, icon: Icon, onClick: () => void) => (
	<button className="dropdown-item" type="button" onClick={onClick}>
		<Octicon icon={icon} height={20}/>
		<span className="pl-2">{text}</span>
	</button>
)