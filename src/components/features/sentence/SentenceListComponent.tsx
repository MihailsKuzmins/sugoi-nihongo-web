import Octicon, { Plus } from '@primer/octicons-react'
import ComponentBase from 'components/ComponentBase'
import SentenceFormComponent from 'components/features/sentence/SentenceFormComponent'
import withNightMode, { NightModeProps } from 'components/_hoc/withNightMode'
import SentenceListModel from 'models/sentence/sentenceListModel'
import React from 'react'
import { Link } from 'react-router-dom'
import { darkMode, h1IconHeight, lightMode } from 'resources/constants/uiConstants'
import { sentenceList } from 'resources/routing/routes'
import { lightBackground, lightTextBoldColor, lightTextColor, nightBackground, nightTextBoldColor, nightTextColor } from 'resources/ui/colors'
import SentenceService from 'services/sentenceService'
import { container } from 'tsyringe'
import createSpinner from 'ui/createSpinner'

class SentenceListComponent extends ComponentBase<Props, State> {
	private readonly mSentenceService = container.resolve(SentenceService)
	private readonly mFormId = 'sentenceAdd'

	constructor(props: Props) {
		super(props)
		
		this.state = {sentences: undefined}
	}

	protected createSubscription = () =>
		this.mSentenceService.getListSubscription(25, x => this.setState({sentences: x}))

	render = () => {
		const colors: Colors = this.props.isNightMode
			? {bgColor: nightBackground, textColor: nightTextColor, textBoldColor: nightTextBoldColor, cardBorderMode: lightMode}
			: {bgColor: lightBackground, textColor: lightTextColor, textBoldColor: lightTextBoldColor, cardBorderMode: darkMode}


		return (
			<div className="container">
				<div className="row col-12 m-0">
					<h1 className="text-left m-0" style={{color: colors.textBoldColor}}>Latest sentences</h1>
					<button type="button" className="close ml-auto" data-toggle="modal" data-target={`#${this.mFormId}`}
						style={{color: colors.textColor}}>
						<Octicon icon={Plus} height={h1IconHeight}/>
					</button>
				</div>
				<hr style={{borderTopColor: colors.textColor}} />
				{ this.state.sentences?.map((x, i) => createListItem(x, i, colors)) }
				{ this.state.sentences?.length === 0 && <div style={{color: colors.textColor}}>No sentences found</div> }
				{ this.state.sentences === undefined && createSpinner(this.props.isNightMode) }
				<SentenceFormComponent
					sentence={undefined}
					formId={this.mFormId}
					title='Add new sentence'
					isNightMode={this.props.isNightMode} />
			</div>
		)
	}
}

export default withNightMode<BasicProps>(SentenceListComponent)

interface BasicProps {}
interface Props extends NightModeProps, BasicProps {}

interface State {
	sentences: SentenceListModel[] | undefined
}

interface Colors {
	bgColor: string,
	textColor: string,
	textBoldColor: string,
	cardBorderMode: string
}

const createListItem = (sentence: SentenceListModel, index: number, colors: Colors) => {
	const originalSizing = 'col-sm-6 col-lg-5'
	const translationSizing = 'col-sm-6 col-lg-7'

	return (
		<div className={`card border-${colors.cardBorderMode} mb-2 text-left px-3 py-1`} key={index} style={{backgroundColor: colors.bgColor}}>
			<div className="row text-muted d-none d-sm-flex">
				<p className={`${originalSizing} m-0`}>Original</p>
				<p className={`${translationSizing} m-0`}>Translation</p>
			</div>
			<div className="row" style={{color: colors.textColor}}>
				<Link className={`${originalSizing} font-weight-550 font-size-20`} to={`${sentenceList}/${sentence.sentenceId}`}
					style={{color: colors.textBoldColor}}>
					<p className="m-0">{sentence.original}</p>
				</Link>
				<p className={`${translationSizing} font-size-25 m-0`}>{sentence.translation}</p>
			</div>
		</div>
	)
}