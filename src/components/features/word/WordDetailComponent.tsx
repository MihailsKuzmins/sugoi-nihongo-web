import Octicon, { Pencil } from '@primer/octicons-react'
import ComponentBase from 'components/ComponentBase'
import WordFormComponent from 'components/features/word/WordFormComponent'
import withNightMode, { NightModeProps } from 'components/_hoc/withNightMode'
import WordDetailModel from 'models/word/wordDetailModel'
import moment from 'moment'
import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { RouteComponentProps } from 'react-router-dom'
import { h3IconHeight } from 'resources/constants/uiConstants'
import { lightNavBarColor, lightTextBoldColor, lightTextColor, nightNavBarColor, nightTextBoldColor, nightTextColor } from 'resources/ui/colors'
import WordService from 'services/wordService'
import { container } from 'tsyringe'
import createSpinner from 'ui/createSpinner'
import './WordDetailComponent.css'

class WordDetailComponent extends ComponentBase<Props, State> {
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

	public readonly render = () => {
		const colors: Colors = this.props.isNightMode
			? {textColor: nightTextColor, textBoldColor: nightTextBoldColor, bgBoldColor: nightNavBarColor}
			: {textColor: lightTextColor, textBoldColor: lightTextBoldColor, bgBoldColor: lightNavBarColor}

		return (
			<div>
				<div id="word-content" className="container">
					<div className="row col-12 m-0">
						<h3 className="text-left m-0" style={{color: colors.textBoldColor}}>Word</h3>
						{this.state.word?.wordId &&
							<button type="button" className="close ml-auto" data-toggle="modal" data-target={`#${this.mFormId}`}
								style={{color: colors.textColor}}>
								<Octicon icon={Pencil} height={h3IconHeight}/>
							</button>
						}
					</div>
					<hr/>
					{this.state.word === undefined && createSpinner(this.props.isNightMode)}
					{this.state.word?.wordId &&
						<div>
							{createDetailLayout(this.state.word, colors)}
							<WordFormComponent word={this.state.word} formId={this.mFormId} title='Edit word' isNightMode={this.props.isNightMode} />
						</div>
					}
				</div>
				<footer id="word-footer" style={{backgroundColor: colors.bgBoldColor, color: colors.textColor}}>
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
}

export default withNightMode<BasicProps>(WordDetailComponent)

interface BasicProps extends RouteComponentProps<{
	wordId: string
}> {}
interface Props extends NightModeProps, BasicProps {}

interface State {
	word: WordDetailModel | undefined
}

interface Colors {
	textColor: string,
	textBoldColor: string,
	bgBoldColor: string
}

const createDetailLayout = (word: WordDetailModel, colors: Colors) => {
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
				{createPrimaryItemLayout('Original', word.original, colors, primarySectionPositioning.original)}
				{createPrimaryItemLayout('Translation', word.translation, colors, primarySectionPositioning.translation)}
				{word.transcription && createPrimaryItemLayout('Transcription', word.transcription, colors, 'col-sm-4')}
				{word.notes && createPrimaryItemLayout('Notes', word.notes, colors)}
			</div>
			<hr/>
			<div className="row">
				<div className={secondarySectionPositioning}>
					{createSecondaryItemLayout('Mark', word.mark.toString(), colors)}
					{createSecondaryItemLayout('Last accessed', dateLastAccessed, colors)}
					{createSecondaryItemLayout('Is in study', word.isStudiable ? 'Yes' : 'No', colors)}
					{createSecondaryItemLayout('Is favourite', word.isFavourite ? 'Yes' : 'No', colors)}
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

const createPrimaryItemLayout = (label: string, text: string, colors: Colors, positioning: string | undefined = undefined) => {
	const positioningClass = 'col-12' + (positioning ? ` ${positioning}` : '')

	return (
		<div className={positioningClass}>
			<p className="text-muted m-0">{label}</p>
			<p className="font-size-25" style={{color: colors.textColor}}>{text}</p>
		</div>
	)
}

const createSecondaryItemLayout = (label: string, text: string, colors: Colors) => (
	<p>
		<span className="text-muted">{label}: </span>
		<span className="font-size-20" style={{color: colors.textColor}}>{text}</span>
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