import Octicon, { Plus } from '@primer/octicons-react'
import ComponentBase from 'components/ComponentBase'
import GrammarRuleFormComponent from 'components/features/grammarRule/GrammarRuleFormComponent'
import withNightMode, { NightModeProps } from 'components/_hoc/withNightMode'
import { removeWhiteSpaces, trimWithEllipsis } from 'functions/systemTypes/stringFunctions'
import GrammarRuleListModel from 'models/grammarRule/grammarRuleListModel'
import React from 'react'
import { Link } from 'react-router-dom'
import { maxBodyLengthInList } from 'resources/constants/grammarRuleConstants'
import { h1IconHeight, lightMode, darkMode } from 'resources/constants/uiConstants'
import { grammarRuleList } from 'resources/routing/routes'
import { lightBackground, lightTextBoldColor, lightTextColor, nightBackground, nightTextBoldColor, nightTextColor } from 'resources/ui/colors'
import GrammarRuleService from 'services/grammarRuleService'
import { container } from 'tsyringe'
import createSpinner from 'ui/createSpinner'

class GrammarRuleListComponent extends ComponentBase<Props, State> {
	private readonly mGrammarRuleService = container.resolve(GrammarRuleService)
	private readonly mFormId = 'grammarRuleAdd'

	constructor(props: Props) {
		super(props)
		
		this.state = {grammarRules: undefined}
	}

	protected createSubscription = () =>
		this.mGrammarRuleService.getListSubscription(25, x => this.setState({grammarRules: x}))

	public readonly render = () => {
		const colors: Colors = this.props.isNightMode
			? {bgColor: nightBackground, textColor: nightTextColor, textBoldColor: nightTextBoldColor, cardBorderMode: lightMode}
			: {bgColor: lightBackground, textColor: lightTextColor, textBoldColor: lightTextBoldColor, cardBorderMode: darkMode}

		return (
			<div className="container">
				<div className="row col-12 m-0">
					<h1 className="text-left m-0" style={{color: colors.textBoldColor}}>Latest grammar rules</h1>
					<button type="button" className="close ml-auto" data-toggle="modal" data-target={`#${this.mFormId}`}
						style={{color: colors.textColor}}>
						<Octicon icon={Plus} height={h1IconHeight}/>
					</button>
				</div>
				<hr style={{borderTopColor: colors.textColor}} />
				{ this.state.grammarRules?.map((x, i) => createListItem(x, i, colors)) }
				{ this.state.grammarRules?.length === 0 && <div style={{color: colors.textColor}}>No grammar rules found</div> }
				{ this.state.grammarRules === undefined && createSpinner(this.props.isNightMode) }
				<GrammarRuleFormComponent
					grammarRule={undefined}
					formId={this.mFormId}
					title='Add new grammar rule'
					isNightMode={this.props.isNightMode} />
			</div>
		)
	}
}

export default withNightMode<BasicProps>(GrammarRuleListComponent)

interface BasicProps {}
interface Props extends NightModeProps, BasicProps {}

interface State {
	grammarRules: GrammarRuleListModel[] | undefined
}

interface Colors {
	bgColor: string,
	textColor: string,
	textBoldColor: string,
	cardBorderMode: string
}

const createListItem = (grammarRule: GrammarRuleListModel, index: number, colors: Colors) => {
	const headerSizing = 'col-sm-6 col-lg-5'
	const bodySizing = 'col-sm-6 col-lg-7'

	return (
		<div className={`card border-${colors.cardBorderMode} mb-2 text-left px-3 py-1`} key={index} style={{backgroundColor: colors.bgColor}}>
			<div className="row text-muted d-none d-sm-flex">
				<p className={`${headerSizing} m-0`}>Header</p>
				<p className={`${bodySizing} m-0`}>Body</p>
			</div>
			<div className="row font-size-20" style={{color: colors.textColor}}>
				<Link className={`${headerSizing} font-weight-550`} to={`${grammarRuleList}/${grammarRule.grammarRuleId}`}
					style={{color: colors.textBoldColor}}>
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