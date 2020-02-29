import Octicon, { Pencil } from '@primer/octicons-react'
import ComponentBase from 'components/ComponentBase'
import SentenceFormComponent from 'components/features/sentence/SentenceFormComponent'
import SentenceDetailModel from 'models/sentence/sentenceDetailModel'
import moment from 'moment'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { h3IconHeight } from 'resources/constants/uiConstants'
import SentenceService from 'services/sentenceService'
import ThemeService from 'services/ui/themeService'
import { container } from 'tsyringe'
import createSpinner from 'ui/createSpinner'
import './SentenceDetailComponent.css'

export default class SentenceDetailComponent extends ComponentBase<Props, State> {
	private readonly mSentenceService = container.resolve(SentenceService)
	private readonly mThemeService = container.resolve(ThemeService)

	private readonly mFormId = 'sentenceEdit'

	constructor(props: Props) {
		super(props)
		
		this.state = {sentence: undefined}
	}

	protected createSubscription = () => {
		const { match: { params } } = this.props
		return this.mSentenceService.getDetailSubscription(params.sentenceId, x => this.setState({sentence: x}))
	}

	public readonly render = () => {
		const {textColor, textColorBold, backgroundColorDark} = this.mThemeService

		return (
			<div>
				<div id="sentence-content" className="container">
					<div className="row col-12 m-0">
						<h3 className="text-left m-0" style={{color: textColorBold}}>Sentence</h3>
						{this.state.sentence?.sentenceId &&
							<button type="button" className="close ml-auto" data-toggle="modal" data-target={`#${this.mFormId}`}
								style={{color: textColor}}>
								<Octicon icon={Pencil} height={h3IconHeight}/>
							</button>
						}
					</div>
					<hr style={{borderTopColor: textColor}} />
					{this.state.sentence === undefined && createSpinner(textColor)}
					{this.state.sentence?.sentenceId &&
						<div>
							{this.createDetailLayout(this.state.sentence)}
							<SentenceFormComponent
								sentence={this.state.sentence}
								formId={this.mFormId}
								title='Edit sentence' />
						</div>
					}
				</div>
				{ this.state.sentence?.sentenceId &&
					<footer id="sentence-footer" style={{backgroundColor: backgroundColorDark, color: textColor}}>
						<div className="container">
							<p className="text-left m-0">
								Created on {moment(this.state.sentence.dateCreated).format('DD.MM.YYYY')}
							</p>
						</div>
					</footer>
				}
			</div>
		)
	}

	private createDetailLayout(sentence: SentenceDetailModel) {
		const positioning = sentence.transcription
			? {original: 'col-sm-12 col-lg-4', translation: 'col-sm-6 col-lg-4'}
			: {original: 'col-sm-6', translation: 'col-sm-6'}
	
		return (
			<div className="row text-left">
				{this.createItemLayout('Original', sentence.original, positioning.original)}
				{this.createItemLayout('Translation', sentence.translation, positioning.translation)}
				{sentence.transcription && this.createItemLayout('Transcription', sentence.transcription, 'col-sm-6 col-lg-4')}
			</div>
		)
	}
	
	private createItemLayout(label: string, text: string, positioning: string | undefined = undefined) {
		const positioningClass = 'col-12' + (positioning ? ` ${positioning}` : '')
		const {textColor} = this.mThemeService
	
		return (
			<div className={positioningClass}>
				<p className="text-muted m-0">{label}</p>
				<p className="font-size-25" style={{color: textColor}}>{text}</p>
			</div>
		)
	}
}

interface Props extends RouteComponentProps<{
	sentenceId: string
}> {}

interface State {
	sentence: SentenceDetailModel | undefined
}