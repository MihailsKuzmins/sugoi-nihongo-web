import Octicon, { Pencil } from '@primer/octicons-react'
import ComponentBase from 'components/ComponentBase'
import SentenceFormComponent from 'components/features/sentence/SentenceFormComponent'
import withNightMode, { NightModeProps } from 'components/_hoc/withNightMode'
import SentenceDetailModel from 'models/sentence/sentenceDetailModel'
import moment from 'moment'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { h3IconHeight } from 'resources/constants/uiConstants'
import { lightNavBarColor, lightTextBoldColor, lightTextColor, nightNavBarColor, nightTextBoldColor, nightTextColor } from 'resources/ui/colors'
import SentenceService from 'services/sentenceService'
import { container } from 'tsyringe'
import createSpinner from 'ui/createSpinner'
import './SentenceDetailComponent.css'

class SentenceDetailComponent extends ComponentBase<Props, State> {
	private readonly mSentenceService = container.resolve(SentenceService)
	private readonly mFormId = 'sentenceEdit'

	constructor(props: Props) {
		super(props)
		
		this.state = {sentence: undefined}
	}

	protected createSubscription = () => {
		const { match: { params } } = this.props
		return this.mSentenceService.getDetailSubscription(params.sentenceId, x => this.setState({sentence: x}))
	}

	render = () => {
		const colors: Colors = this.props.isNightMode
			? {textColor: nightTextColor, textBoldColor: nightTextBoldColor, bgBoldColor: nightNavBarColor}
			: {textColor: lightTextColor, textBoldColor: lightTextBoldColor, bgBoldColor: lightNavBarColor}

		return (
			<div>
				<div id="sentence-content" className="container">
					<div className="row col-12 m-0">
						<h3 className="text-left m-0" style={{color: colors.textBoldColor}}>Sentence</h3>
						{this.state.sentence?.sentenceId &&
							<button type="button" className="close ml-auto" data-toggle="modal" data-target={`#${this.mFormId}`}
								style={{color: colors.textColor}}>
								<Octicon icon={Pencil} height={h3IconHeight}/>
							</button>
						}
					</div>
					<hr/>
					{this.state.sentence === undefined && createSpinner(this.props.isNightMode)}
					{this.state.sentence?.sentenceId &&
						<div>
							{createDetailLayout(this.state.sentence, colors)}
							<SentenceFormComponent
								sentence={this.state.sentence}
								formId={this.mFormId}
								title='Edit sentence'
								isNightMode={this.props.isNightMode} />
						</div>
					}
				</div>
				<footer id="sentence-footer" style={{backgroundColor: colors.bgBoldColor, color: colors.textColor}}>
					<div className="container">
						{this.state.sentence?.sentenceId &&
							<p className="text-left m-0">
								Created on {moment(this.state.sentence.dateCreated).format('DD.MM.YYYY')}
							</p>
						}
					</div>
				</footer>
			</div>
		)
	}
}

export default withNightMode<BasicProps>(SentenceDetailComponent)

interface BasicProps extends RouteComponentProps<{
	sentenceId: string
}> {}
interface Props extends NightModeProps, BasicProps {}

interface State {
	sentence: SentenceDetailModel | undefined
}

interface Colors {
	textColor: string,
	textBoldColor: string,
	bgBoldColor: string
}

const createDetailLayout = (sentence: SentenceDetailModel, colors: Colors) => {
	const positioning = sentence.transcription
		? {original: 'col-sm-12 col-lg-4', translation: 'col-sm-6 col-lg-4'}
		: {original: 'col-sm-6', translation: 'col-sm-6'}

	return (
		<div className="row text-left">
			{createItemLayout('Original', sentence.original, colors, positioning.original)}
			{createItemLayout('Translation', sentence.translation, colors, positioning.translation)}
			{sentence.transcription && createItemLayout('Transcription', sentence.transcription, colors, 'col-sm-6 col-lg-4')}
		</div>
	)
}

const createItemLayout = (label: string, text: string, colors: Colors, positioning: string | undefined = undefined) => {
	const positioningClass = 'col-12' + (positioning ? ` ${positioning}` : '')

	return (
		<div className={positioningClass}>
			<p className="text-muted m-0">{label}</p>
			<p className="font-size-25" style={{color: colors.textColor}}>{text}</p>
		</div>
	)
}