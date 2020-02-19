import Octicon, { KebabHorizontal, Gear, Person, Icon } from '@primer/octicons-react'
import useGlobalState from 'helpers/useGlobalState'
import React from 'react'
import { Link } from 'react-router-dom'
import { grammarRuleList, home, sentenceList, wordList, publicApps } from 'resources/routing/routes'
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

const NavBarComponent: React.FC = () => {
	const authService = container.resolve(AuthService)
	const [isAuth, setIsAuth] = useGlobalState('isAuthenticated')

	const handleSettings = () => {
		console.log('settings')
	}

	const handleAccount = () => {
		console.log('account')
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
				<div className="dropdown">
					<div className="btn-group dropleft">
						<button type="button" className="close px-2 py-1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							<Octicon icon={KebabHorizontal} height={33}/>
						</button>
						<div className="dropdown-menu">
							{createOverflowMenuItem('Settings', Gear, handleSettings)}
							{isAuth && createOverflowMenuItem('Account', Person, handleAccount)}
						</div>
					</div>
				</div>
			</div>
		</nav>
	)
}

export default NavBarComponent

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