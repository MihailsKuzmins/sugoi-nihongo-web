import Octicon, { Pencil } from '@primer/octicons-react'
import ComponentBase from 'components/ComponentBase'
import SentenceFormComponent from 'components/features/sentence/SentenceFormComponent'
import SentenceDetailModel from 'models/sentence/sentenceDetailModel'
import moment from 'moment'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { h3IconHeight } from 'resources/constants/uiConstants'
import SentenceService from 'services/sentenceService'
import { container } from 'tsyringe'
import createSpinner from 'ui/createSpinner'
import './SentenceDetailComponent.css'

export default class SentenceDetailComponent extends ComponentBase<Props, State> {
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

	render = () => (
		<div>
			<div id="sentence-content" className="container">
				<div className="row col-12 m-0">
					<h3 className="text-left m-0">Sentence</h3>
					{this.state.sentence?.sentenceId &&
						<button type="button" className="close ml-auto" data-toggle="modal" data-target={`#${this.mFormId}`}>
							<Octicon icon={Pencil} height={h3IconHeight}/>
						</button>
					}
				</div>
				<hr/>
				{this.state.sentence === undefined && createSpinner()}
				{this.state.sentence?.sentenceId &&
					<div>
						{createDetailLayout(this.state.sentence)}
						<SentenceFormComponent sentence={this.state.sentence} formId={this.mFormId} title='Edit sentence' />
					</div>
				}
			</div>
			<footer id="sentence-footer">
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

interface Props extends RouteComponentProps<{
	sentenceId: string
}> {}

interface State {
	sentence: SentenceDetailModel | undefined
}

const createDetailLayout = (sentence: SentenceDetailModel) => {
	const positioning = sentence.transcription
		? {original: 'col-sm-12 col-lg-4', translation: 'col-sm-6 col-lg-4'}
		: {original: 'col-sm-6', translation: 'col-sm-6'}

	return (
		<div className="row text-left">
			{createItemLayout('Original', sentence.original, positioning.original)}
			{createItemLayout('Translation', sentence.translation, positioning.translation)}
			{sentence.transcription && createItemLayout('Transcription', sentence.transcription, 'col-sm-6 col-lg-4')}
		</div>
	)
}

const createItemLayout = (label: string, text: string, positioning: string | undefined = undefined) => {
	const positioningClass = 'col-12' + (positioning ? ` ${positioning}` : '')

	return (
		<div className={positioningClass}>
			<p className="text-muted">{label}</p>
			<p className="font-size-25">{text}</p>
		</div>
	)
}