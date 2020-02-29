import Octicon, { Pencil } from '@primer/octicons-react'
import ComponentBase from 'components/ComponentBase'
import GrammarRuleFormComponent from 'components/features/grammarRule/GrammarRuleFormComponent'
import GrammarRuleDetailModel from 'models/grammarRule/grammarRuleDetailModel'
import moment from 'moment'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { h3IconHeight } from 'resources/constants/uiConstants'
import GrammarRuleService from 'services/grammarRuleService'
import ThemeService from 'services/ui/themeService'
import { container } from 'tsyringe'
import createSpinner from 'ui/createSpinner'
import './GrammarRuleDetailComponent.css'

export default class GrammarRuleDetailComponent extends ComponentBase<Props, State> {
	private readonly mGrammarRuleService = container.resolve(GrammarRuleService)
	private readonly mThemeService = container.resolve(ThemeService)

	private readonly mFormId = 'grammarRuleEdit'

	constructor(props: Props) {
		super(props)
		
		this.state = {grammarRule: undefined}
	}

	protected createSubscription = () => {
		const { match: { params } } = this.props
		return this.mGrammarRuleService.getDetailSubscription(params.grammarRuleId, x => this.setState({grammarRule:x}))
	}

	public readonly render = () => {
		const {textColorBold, textColor, backgroundColorDark} = this.mThemeService

		return (
			<div>
				<div id="grammar-rule-content" className="container">
					<div className="row col-12 m-0">
						<h3 className="text-left m-0" style={{color: textColorBold}}>Grammar rule</h3>
						{this.state.grammarRule?.grammarRuleId &&
							<button type="button" className="close ml-auto" data-toggle="modal" data-target={`#${this.mFormId}`}
								style={{color: textColor}}>
								<Octicon icon={Pencil} height={h3IconHeight}/>
							</button>
						}
					</div>
					<hr style={{borderTopColor: textColor}} />
					{this.state.grammarRule === undefined && createSpinner(textColor)}
					{this.state.grammarRule?.grammarRuleId &&
						<div>
							{this.createDetailLayout(this.state.grammarRule)}
							<GrammarRuleFormComponent
								grammarRule={this.state.grammarRule}
								formId={this.mFormId}
								title='Edit grammar rule' />
						</div>
					}
				</div>
				{this.state.grammarRule?.grammarRuleId &&
					<footer id="grammar-rule-footer" style={{backgroundColor: backgroundColorDark, color: textColor}}>
						<div className="container">
							<p className="text-left m-0">
								Created on {moment(this.state.grammarRule.dateCreated).format('DD.MM.YYYY')}
							</p>
						</div>
					</footer>
				}
			</div>
		)
	}

	private createDetailLayout(grammarRule: GrammarRuleDetailModel) {
		const {textColorBold, textColor} = this.mThemeService

		return (
			<div>
				<h4 style={{color: textColorBold}}>{grammarRule.header}</h4>
				<p className="text-left font-size-20" style={{color: textColor}}>{grammarRule.body}</p>
			</div>
		)
	}
}

interface Props extends RouteComponentProps<{
	grammarRuleId: string
}> {}

interface State {
	grammarRule: GrammarRuleDetailModel | undefined
}