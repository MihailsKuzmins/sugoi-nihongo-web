import Octicon, { Pencil } from '@primer/octicons-react'
import ComponentBase from 'components/ComponentBase'
import GrammarRuleFormComponent from 'components/features/grammarRule/GrammarRuleFormComponent'
import withNightMode, { NightModeProps } from 'components/_hoc/withNightMode'
import GrammarRuleDetailModel from 'models/grammarRule/grammarRuleDetailModel'
import moment from 'moment'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { h3IconHeight } from 'resources/constants/uiConstants'
import { lightNavBarColor, lightTextBoldColor, lightTextColor, nightNavBarColor, nightTextBoldColor, nightTextColor } from 'resources/ui/colors'
import GrammarRuleService from 'services/grammarRuleService'
import { container } from 'tsyringe'
import createSpinner from 'ui/createSpinner'
import './GrammarRuleDetailComponent.css'

class GrammarRuleDetailComponent extends ComponentBase<Props, State> {
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

	public readonly render = () => {
		const colors: Colors = this.props.isNightMode
			? {textColor: nightTextColor, textBoldColor: nightTextBoldColor, bgBoldColor: nightNavBarColor}
			: {textColor: lightTextColor, textBoldColor: lightTextBoldColor, bgBoldColor: lightNavBarColor}

		return (
			<div>
				<div id="grammar-rule-content" className="container">
					<div className="row col-12 m-0">
						<h3 className="text-left m-0" style={{color: colors.textBoldColor}}>Grammar rule</h3>
						{this.state.grammarRule?.grammarRuleId &&
							<button type="button" className="close ml-auto" data-toggle="modal" data-target={`#${this.mFormId}`}
								style={{color: colors.textColor}}>
								<Octicon icon={Pencil} height={h3IconHeight}/>
							</button>
						}
					</div>
					<hr/>
					{this.state.grammarRule === undefined && createSpinner(this.props.isNightMode)}
					{this.state.grammarRule?.grammarRuleId &&
						<div>
							{createDetailLayout(this.state.grammarRule, colors)}
							<GrammarRuleFormComponent
								grammarRule={this.state.grammarRule}
								formId={this.mFormId}
								title='Edit grammar rule'
								isNightMode={this.props.isNightMode}/>
						</div>
					}
				</div>
				<footer id="grammar-rule-footer" style={{backgroundColor: colors.bgBoldColor, color: colors.textColor}}>
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
}

export default withNightMode<BasicProps>(GrammarRuleDetailComponent)

interface BasicProps extends RouteComponentProps<{
	grammarRuleId: string
}> {}
interface Props extends NightModeProps, BasicProps {}

interface State {
	grammarRule: GrammarRuleDetailModel | undefined
}

interface Colors {
	textColor: string,
	textBoldColor: string,
	bgBoldColor: string
}

const createDetailLayout = (grammarRule: GrammarRuleDetailModel, colors: Colors) => (
	<div>
		<h4 style={{color: colors.textBoldColor}}>{grammarRule.header}</h4>
		<p className="text-left font-size-20" style={{color: colors.textColor}}>{grammarRule.body}</p>
	</div>
)