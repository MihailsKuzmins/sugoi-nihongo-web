import Octicon, { Gear } from '@primer/octicons-react'
import useGlobalState from 'helpers/useGlobalState'
import React from 'react'
import { Link } from 'react-router-dom'
import { grammarRuleList, home, sentenceList, wordList } from 'resources/routing/routes'
import AuthService from 'services/authService'
import { container } from 'tsyringe'

const navLinks: Array<RouteLink> = [
	{ path: wordList, label: 'Words' },
	{ path: sentenceList, label: 'Sentences' },
	{ path: grammarRuleList, label: 'Grammar rules' },
]

const NavBarComponent: React.FC = () => {
	const authService = container.resolve(AuthService)
	const [isAuth, setIsAuth] = useGlobalState('isAuthenticated')

	const handleSignOutAsync = async () => {
		await authService.signOutAsync()
		setIsAuth(false)
	}

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
			<Link className="navbar-brand" to={home}>すごい日本語</Link>
			{isAuth &&
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
			}
			
			{isAuth &&
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
					<div className="dropdown">
						<div className="btn-group dropleft">
							<button type="button" className="close" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								<Octicon icon={Gear} height={33}/>
							</button>
							<div className="dropdown-menu">
								<button className="dropdown-item" type="button" onClick={handleSignOutAsync}>Sign out</button>
							</div>
						</div>
					</div>
				</div>
			}
		</nav>
	)
}

export default NavBarComponent

interface RouteLink {
	path: string,
	label: string
}