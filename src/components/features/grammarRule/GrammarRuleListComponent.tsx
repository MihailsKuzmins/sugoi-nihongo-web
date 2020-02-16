import React from 'react'
import {Link} from 'react-router-dom'
import { container } from 'tsyringe'
import GrammarRuleListModel from 'models/grammarRule/grammarRuleListModel'
import GrammarRuleService from 'services/grammarRuleService'
import createSpinner from 'ui/createSpinner'
import { grammarRuleList } from 'resources/routing/routes'
import { maxBodyLengthInList } from 'resources/constants/grammarRuleConstants'
import { trimWithEllipsis, removeWhiteSpaces } from 'functions/stringFunctions'
import ComponentBase from 'components/ComponentBase'
import GrammarRuleFormComponent from './GrammarRuleFormComponent'
import Octicon, {Plus} from '@primer/octicons-react'
import { h1IconHeight } from 'resources/constants/uiConstants'

export default class GrammarRuleListComponent extends ComponentBase<{}, State> {
	private readonly mGrammarRuleService = container.resolve(GrammarRuleService)
	private readonly mFormId = 'grammarRuleAdd'

	constructor(props: {}) {
		super(props)
		
		this.state = {grammarRules: undefined}
	}

	protected createSubscription = () =>
		this.mGrammarRuleService.getListSubscription(25, x => this.setState({grammarRules: x}))

	render = () => (
		<div className="container">
			<div className="row col-12 m-0">
				<h1 className="text-left m-0">Latest grammar rules</h1>
				<button type="button" className="close ml-auto" data-toggle="modal" data-target={`#${this.mFormId}`}>
					<Octicon icon={Plus} height={h1IconHeight}/>
				</button>
			</div>
			<hr/>
			{ this.state.grammarRules?.map((x, i) => createListItem(x, i)) }
			{ this.state.grammarRules?.length === 0 && "No grammar rules found" }
			{ this.state.grammarRules === undefined && createSpinner() }
			<GrammarRuleFormComponent grammarRule={undefined} formId={this.mFormId} title='Add new grammar rule' />
		</div>
	)
}

interface State {
	grammarRules: GrammarRuleListModel[] | undefined
}

const createListItem = (grammarRule: GrammarRuleListModel, index: number) => {
	const headerSizing = 'col-sm-6 col-lg-5'
	const bodySizing = 'col-sm-6 col-lg-7'

	return (
		<div className="card mb-2 text-left px-3 py-1" key={index}>
			<div className="row text-muted d-none d-sm-flex">
				<p className={headerSizing}>Header</p>
				<p className={bodySizing}>Body</p>
			</div>
			<div className="row font-size-20">
				<Link className={`${headerSizing} text-dark font-weight-550`} to={`${grammarRuleList}/${grammarRule.grammarRuleId}`}>
					<p className="m-0">{grammarRule.header}</p>
				</Link>
				<p className={`${bodySizing} m-0`}>{createBodyText(grammarRule.body)}</p>
			</div>
		</div>
	)
}

const createBodyText = (body: string) => {
	const trimmedBody = trimWithEllipsis(body, maxBodyLengthInList)
	return removeWhiteSpaces(trimmedBody)
}