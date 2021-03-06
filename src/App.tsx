import 'reflect-metadata'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import NavBarComponent from 'components/system/NavBarComponent'
import SettingsComponent from 'components/system/SettingsComponent'
import useGlobalState from 'helpers/useGlobalState'
import $ from 'jquery'
import React, { Suspense } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { localStorageIsNightMode } from 'resources/constants/localStorageConstants'
import { authAccount, authSignIn, authSignUp, grammarRuleDetail, grammarRuleList, home, publicApps, sentenceDetail, sentenceList, wordDetail, wordList } from 'resources/routing/routes'
import AuthService from 'services/authService'
import WindowOnPop from 'services/middleware/windowOnPop'
import ThemeService from 'services/ui/themeService'
import { container } from 'tsyringe'
import './App.css'

const settingsFormId = 'settingsForm'

const App: React.FC = () => {
	const authService = container.resolve(AuthService)
	const themeService = container.resolve(ThemeService)
	const windowOnPop = container.resolve(WindowOnPop)

	const [isAuth, setIsAuth] = useGlobalState('isAuthenticated')
	const [isNightMode, setIsNightMode] = useGlobalState('isNightMode')

	const isNightModeSession = localStorage.getItem(localStorageIsNightMode) === 'true'
	if (isNightMode !== isNightModeSession)
		setIsNightMode(isNightModeSession)
	
	if (isAuth !== authService.isAuthenticated)
		setIsAuth(authService.isAuthenticated)

	themeService.isNightMode = isNightMode
	document.body.style.backgroundColor = themeService.backgroundColor
	$('#favicon').attr('href', `favicon-${themeService.mode}.png`)

	window.onpopstate = (_: PopStateEvent) =>
		windowOnPop.run()

	return (
		<Router>
			<div className="App">
				<NavBarComponent settingsFormId={settingsFormId} />
				<SettingsComponent formId={settingsFormId} />
				{isAuth
					? createAuthorisedUi()
					: createUnauthorisedUi()
				}
			</div>
		</Router>
	)
}

export default App

const PageNotFoundComponent = React.lazy(() => import('components/system/PageNotFoundComponent'))

const WordListComponent = React.lazy(() => import('components/features/word/WordListComponent'))
const WordDetailComponent = React.lazy(() => import('components/features/word/WordDetailComponent'))
const SentenceListComponent = React.lazy(() => import('components/features/sentence/SentenceListComponent'))
const SentenceDetailComponent = React.lazy(() => import('components/features/sentence/SentenceDetailComponent'))
const GrammarRuleListComponent = React.lazy(() => import('components/features/grammarRule/GrammarRuleListComponent'))
const GrammarRuleDetailComponent = React.lazy(() => import('components/features/grammarRule/GrammarRuleDetailComponent'))
const AuthAccountComponent = React.lazy(() => import('components/auth/AuthAccountComponent'))

const createAuthorisedUi = () => (
	<Suspense fallback={<div></div>}>
		<Switch>
			{/* Words */}
			<Route path={[wordList, home]} component={WordListComponent} exact />
			<Route path={wordDetail} component={WordDetailComponent} exact />

			{/* Sentences */}
			<Route path={sentenceList} component={SentenceListComponent} exact />
			<Route path={sentenceDetail} component={SentenceDetailComponent} exact />

			{/* GrammarRules */}
			<Route path={grammarRuleList} component={GrammarRuleListComponent} exact />
			<Route path={grammarRuleDetail} component={GrammarRuleDetailComponent} exact />

			{/* Auth */}
			<Route path={authAccount} component={AuthAccountComponent} exact />

			<Route component={PageNotFoundComponent} />
		</Switch>
	</Suspense>
)

const PublicHomepageComponent = React.lazy(() => import('components/public/PublicHomepageComponent'))
const PublicAppsComponent = React.lazy(() => import('components/public/PublicAppsComponent'))
const AuthSignInComponent = React.lazy(() => import('components/auth/AuthSignInComponent'))
const authSignUpComponent = React.lazy(() => import('components/auth/AuthSignUpComponent'))

const createUnauthorisedUi = () => (
	<Suspense fallback={<div></div>}>
		<Switch>
			<Route path={home} component={PublicHomepageComponent} exact />
			<Route path={publicApps} component={PublicAppsComponent} exact />

			{/* Auth */}
			<Route path={authSignIn} component={AuthSignInComponent} exact />
			<Route path={authSignUp} component={authSignUpComponent} exact />

			<Route component={PageNotFoundComponent} />
		</Switch>
	</Suspense>
)