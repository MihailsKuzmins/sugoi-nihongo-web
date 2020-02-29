import Octicon, { Plus } from '@primer/octicons-react'
import ComponentBase from 'components/ComponentBase'
import GrammarRuleFormComponent from 'components/features/grammarRule/GrammarRuleFormComponent'
import { removeWhiteSpaces, trimWithEllipsis } from 'functions/systemTypes/stringFunctions'
import GrammarRuleListModel from 'models/grammarRule/grammarRuleListModel'
import React from 'react'
import { Link } from 'react-router-dom'
import { maxBodyLengthInList } from 'resources/constants/grammarRuleConstants'
import { h1IconHeight } from 'resources/constants/uiConstants'
import { grammarRuleList } from 'resources/routing/routes'
import GrammarRuleService from 'services/grammarRuleService'
import ThemeService from 'services/ui/themeService'
import { container } from 'tsyringe'
import createSpinner from 'ui/createSpinner'

export default class GrammarRuleListComponent extends ComponentBase<Props, State> {
	private readonly mGrammarRuleService = container.resolve(GrammarRuleService)
	private readonly mThemeService = container.resolve(ThemeService)

	private readonly mFormId = 'grammarRuleAdd'

	constructor(props: Props) {
		super(props)
		
		this.state = {grammarRules: undefined}
	}

	protected createSubscription = () =>
		this.mGrammarRuleService.getListSubscription(25, x => this.setState({grammarRules: x}))

	public readonly render = () => {
		const {textColorBold, textColor} = this.mThemeService

		return (
			<div className="container">
				<div className="row col-12 m-0">
					<h1 className="text-left m-0" style={{color: textColorBold}}>Latest grammar rules</h1>
					<button type="button" className="close ml-auto" data-toggle="modal" data-target={`#${this.mFormId}`}
						style={{color: textColor}}>
						<Octicon icon={Plus} height={h1IconHeight}/>
					</button>
				</div>
				<hr style={{borderTopColor: textColor}} />
				{ this.state.grammarRules?.map((x, i) => this.createListItem(x, i)) }
				{ this.state.grammarRules?.length === 0 && <div style={{color: textColor}}>No grammar rules found</div> }
				{ this.state.grammarRules === undefined && createSpinner(textColor) }
				<GrammarRuleFormComponent
					grammarRule={undefined}
					formId={this.mFormId}
					title='Add new grammar rule' />
			</div>
		)
	}

	private createListItem(grammarRule: GrammarRuleListModel, index: number) {
		const headerSizing = 'col-sm-6 col-lg-5'
		const bodySizing = 'col-sm-6 col-lg-7'
		const {backgroundColor, textColor, textColorBold} = this.mThemeService
	
		return (
			<div className="card mb-2 text-left px-3 py-1" key={index} style={{backgroundColor: backgroundColor, borderColor: textColor}}>
				<div className="row text-muted d-none d-sm-flex">
					<p className={`${headerSizing} m-0`}>Header</p>
					<p className={`${bodySizing} m-0`}>Body</p>
				</div>
				<div className="row font-size-20">
					<Link className={`${headerSizing} font-weight-550`} to={`${grammarRuleList}/${grammarRule.grammarRuleId}`}
						style={{color: textColorBold}}>
						<p className="m-0">{grammarRule.header}</p>
					</Link>
					<p className={`${bodySizing} m-0`} style={{color: textColor}}>{this.createBodyText(grammarRule.body)}</p>
				</div>
			</div>
		)
	}
	
	private createBodyText(body: string) {
		const trimmedBody = trimWithEllipsis(body, maxBodyLengthInList)
		return removeWhiteSpaces(trimmedBody)
	}
}

interface Props {}

interface State {
	grammarRules: GrammarRuleListModel[] | undefined
}