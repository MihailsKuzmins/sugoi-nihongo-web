import './GrammarRuleDetailComponent.css'
import React from 'react'
import { container } from 'tsyringe'
import GrammarRuleService from 'services/grammarRuleService'
import moment from 'moment'
import GrammarRuleDetailModel from 'models/grammarRule/grammarRuleDetailModel'
import { RouteComponentProps } from 'react-router-dom'
import ComponentBase from 'components/ComponentBase'
import createSpinner from 'ui/createSpinner'
import Octicon, {Pencil} from '@primer/octicons-react'
import { h3IconHeight } from 'resources/constants/uiConstants'
import GrammarRuleFormComponent from './GrammarRuleFormComponent'

export default class GrammarRuleDetailComponent extends ComponentBase<Props, State> {
	private readonly mGrammarRuleService = container.resolve(GrammarRuleService)
	private readonly mFormId = 'grammarRuleEdit'

	constructor(props: Props) {
		super(props)
		
		this.state = {grammarRule: undefined}
	}

	protected createSubscription = () => {
		const { match: { params } } = this.props
		return this.mGrammarRuleService.getDetailSubscription(params.grammarRuleId, x => this.setState({grammarRule:x}))
	}

	render = () => (
		<div>
			<div id="grammar-rule-content" className="container">
				<div className="row col-12 m-0">
					<h3 className="text-left m-0">Grammar rule</h3>
					{this.state.grammarRule?.grammarRuleId &&
						<button type="button" className="close ml-auto" data-toggle="modal" data-target={`#${this.mFormId}`}>
							<Octicon icon={Pencil} height={h3IconHeight}/>
						</button>
					}
				</div>
				<hr/>
				{this.state.grammarRule === undefined && createSpinner()}
				{this.state.grammarRule?.grammarRuleId &&
					<div>
						{createDetailLayout(this.state.grammarRule)}
						<GrammarRuleFormComponent grammarRule={this.state.grammarRule} formId={this.mFormId} title='Edit grammar rule' />
					</div>
				}
			</div>
			<footer id="grammar-rule-footer">
				<div className="container">
					{this.state.grammarRule?.grammarRuleId &&
						<p className="text-left m-0">
							Created on {moment(this.state.grammarRule.dateCreated).format('DD.MM.YYYY')}
						</p>
					}
				</div>
			</footer>
		</div>
	)
}

interface Props extends RouteComponentProps<{
	grammarRuleId: string
}> {}

interface State {
	grammarRule: GrammarRuleDetailModel | undefined
}

const createDetailLayout = (grammarRule: GrammarRuleDetailModel) => (
	<div>
		<h4>{grammarRule.header}</h4>
		<p className="text-left font-size-20">{grammarRule.body}</p>
	</div>
)