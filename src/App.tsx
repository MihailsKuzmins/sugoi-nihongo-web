import React, { Suspense } from 'react'
import 'reflect-metadata'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css'
import 'bootstrap'
import { container } from 'tsyringe'
import AuthService from 'services/authService'
import useGlobalState from 'helpers/useGlobalState'
import NavBarComponent from 'components/system/NavBarComponent'
import { wordList, home, sentenceList, grammarRuleList, wordDetail, sentenceDetail, grammarRuleDetail } from 'resources/routing/routes'

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

// NB! Extracting <Suspense> into a function throws runtime exceptions (something with $$typeof)

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
			<Route path={sentenceDetail} component={SentenceDetailComponent} />

			{/* GrammarRules */}
			<Route path={grammarRuleList} component={GrammarRuleListComponent} exact />
			<Route path={grammarRuleDetail} component={GrammarRuleDetailComponent} exact />
		</Switch>
	</Suspense>
)

const createUnauthorisedUi = () => (
	<div>Not Signed In</div>
)