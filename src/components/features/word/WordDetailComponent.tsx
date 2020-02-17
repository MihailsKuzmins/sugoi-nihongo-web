import Octicon, { Pencil } from '@primer/octicons-react'
import ComponentBase from 'components/ComponentBase'
import WordFormComponent from 'components/features/word/WordFormComponent'
import WordDetailModel from 'models/word/wordDetailModel'
import moment from 'moment'
import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { RouteComponentProps } from 'react-router-dom'
import { h3IconHeight } from 'resources/constants/uiConstants'
import WordService from 'services/wordService'
import { container } from 'tsyringe'
import createSpinner from 'ui/createSpinner'
import './WordDetailComponent.css'

export default class WordDetailComponent extends ComponentBase<Props, State> {
	private readonly mWordService = container.resolve(WordService)
	private readonly mFormId = 'wordEdit'

	constructor(props: Props) {
		super(props)
		
		this.state = {word: undefined}
	}

	protected createSubscription = () => {
		const { match: { params } } = this.props
		return this.mWordService.getDetailSubscription(params.wordId, x => this.setState({word: x}))
	}

	public readonly render = () => (
		<div>
			<div id="word-content" className="container">
				<div className="row col-12 m-0">
					<h3 className="text-left m-0">Word</h3>
					{this.state.word?.wordId &&
						<button type="button" className="close ml-auto" data-toggle="modal" data-target={`#${this.mFormId}`}>
							<Octicon icon={Pencil} height={h3IconHeight}/>
						</button>
					}
				</div>
				<hr/>
				{this.state.word === undefined && createSpinner()}
				{this.state.word?.wordId &&
					<div>
						{createDetailLayout(this.state.word)}
						<WordFormComponent word={this.state.word} formId={this.mFormId} title='Edit word' />
					</div>
				}
			</div>
			<footer id="word-footer">
				<div className="container">
					{this.state.word?.wordId &&
						<p className="text-left m-0">
							Created on {moment(this.state.word.dateCreated).format('DD.MM.YYYY')}
						</p>
					}
				</div>
			</footer>
		</div>
	)
}

interface Props extends RouteComponentProps<{
	wordId: string
}> {}

interface State {
	word: WordDetailModel | undefined
}

const createDetailLayout = (word: WordDetailModel) => {
	const primarySectionPositioning = word.transcription
		? { original: 'col-sm-4', translation: 'col-sm-4' }
		: { original: 'col-sm-6', translation: 'col-sm-6' }

	const secondarySectionPositioning = 'col-12' + word.timesAccessed
		? 'col-sm-5'
		: ''

	const dateLastAccessed = word.dateLastAccessed
		? moment(word.dateLastAccessed).format('DD.MM.YYYY')
		: 'Never'

	const doughnutChartData = createDoughnutChartData(word.timesCorrect, word.timesAccessed)
	
	return (
		<div className="text-left">
			<div className="row mb-3">
				{createPrimaryItemLayout('Original', word.original, primarySectionPositioning.original)}
				{createPrimaryItemLayout('Translation', word.translation, primarySectionPositioning.translation)}
				{word.transcription && createPrimaryItemLayout('Transcription', word.transcription, 'col-sm-4')}
				{word.notes && createPrimaryItemLayout('Notes', word.notes)}
			</div>
			<hr/>
			<div className="row">
				<div className={secondarySectionPositioning}>
					{createSecondaryItemLayout('Mark', word.mark.toString())}
					{createSecondaryItemLayout('Last accessed', dateLastAccessed)}
					{createSecondaryItemLayout('Is in study', word.isStudiable ? 'Yes' : 'No')}
					{createSecondaryItemLayout('Is favourite', word.isFavourite ? 'Yes' : 'No')}
				</div>
				{doughnutChartData &&
					<div className="col-12 col-sm-7">
						<Doughnut data={doughnutChartData} />
					</div>
				}
			</div>
		</div>
	)
}

const createPrimaryItemLayout = (label: string, text: string, positioning: string | undefined = undefined) => {
	const positioningClass = 'col-12' + (positioning ? ` ${positioning}` : '')

	return (
		<div className={positioningClass}>
			<p className="text-muted">{label}</p>
			<p className="font-size-25">{text}</p>
		</div>
	)
}

const createSecondaryItemLayout = (label: string, text: string) => (
	<p>
		<span className="text-muted">{label}: </span>
		<span className="font-size-20">{text}</span>
	</p>
)

const createDoughnutChartData = (timesCorrect: number | undefined, timesAccessed: number | undefined) => {
	if (!timesAccessed)
		return undefined

	const correct = timesCorrect ?? 0
	const wrong = timesAccessed - correct

	return {
		datasets: [{
			data: [correct, wrong],
			backgroundColor: ['#32a848', '#ff4242']
		}],
		labels: [
			'Correct',
			'Wrong'
		]
	}
}