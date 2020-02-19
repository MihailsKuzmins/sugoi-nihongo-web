import 'reflect-metadata'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import NavBarComponent from 'components/system/NavBarComponent'
import useGlobalState from 'helpers/useGlobalState'
import React, { Suspense } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { grammarRuleDetail, grammarRuleList, home, sentenceDetail, sentenceList, wordDetail, wordList, publicApps } from 'resources/routing/routes'
import AuthService from 'services/authService'
import { container } from 'tsyringe'
import './App.css'

const authService = container.resolve(AuthService)

const App: React.FC = () => {
	const [isAuth, setIsAuth] = useGlobalState('isAuthenticated')
	
	if (isAuth !== authService.isAuthenticated)
		setIsAuth(authService.isAuthenticated)

	return (
		<Router>
			<div className="App">
				<NavBarComponent />
				{isAuth
					? createAuthorisedUi()
					: createUnauthorisedUi()
				}
			</div>
		</Router>
	)
}

export default App

const WordListComponent = React.lazy(() => import('components/features/word/WordListComponent'))
const WordDetailComponent = React.lazy(() => import('components/features/word/WordDetailComponent'))
const SentenceListComponent = React.lazy(() => import('components/features/sentence/SentenceListComponent'))
const SentenceDetailComponent = React.lazy(() => import('components/features/sentence/SentenceDetailComponent'))
const GrammarRuleListComponent = React.lazy(() => import('components/features/grammarRule/GrammarRuleListComponent'))
const GrammarRuleDetailComponent = React.lazy(() => import('components/features/grammarRule/GrammarRuleDetailComponent'))
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
		</Switch>
	</Suspense>
)

const PublicHomepageComponent = React.lazy(() => import('components/public/PublicHomepageComponent'))
const PublicAppsComponent = React.lazy(() => import('components/public/PublicAppsComponent'))
const createUnauthorisedUi = () => (
	<Suspense fallback={<div></div>}>
		<Switch>
			<Route path={home} component={PublicHomepageComponent} exact />
			<Route path={publicApps} component={PublicAppsComponent} exact />
		</Switch>
	</Suspense>
)