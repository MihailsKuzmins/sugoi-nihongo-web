import Octicon, { Pencil } from '@primer/octicons-react'
import ComponentBase from 'components/ComponentBase'
import WordFormComponent from 'components/features/word/WordFormComponent'
import WordDetailModel from 'models/word/wordDetailModel'
import moment from 'moment'
import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { RouteComponentProps } from 'react-router-dom'
import { h3IconHeight } from 'resources/constants/uiConstants'
import ThemeService from 'services/ui/themeService'
import WordService from 'services/wordService'
import { container } from 'tsyringe'
import createSpinner from 'ui/createSpinner'
import './WordDetailComponent.css'

export default class WordDetailComponent extends ComponentBase<Props, State> {
	private readonly mWordService = container.resolve(WordService)
	private readonly mThemeService = container.resolve(ThemeService)

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
		const {textColor, textColorBold, backgroundColorDark} = this.mThemeService

		return (
			<div>
				<div id="word-content" className="container">
					<div className="row col-12 m-0">
						<h3 className="text-left m-0" style={{color: textColorBold}}>Word</h3>
						{this.state.word?.wordId &&
							<button type="button" className="close ml-auto" data-toggle="modal" data-target={`#${this.mFormId}`}
								style={{color: textColor}}>
								<Octicon icon={Pencil} height={h3IconHeight}/>
							</button>
						}
					</div>
					<hr style={{borderTopColor: textColor}} />
					{this.state.word === undefined && createSpinner(textColor)}
					{this.state.word?.wordId &&
						<div>
							{this.createDetailLayout(this.state.word)}
							<WordFormComponent
								word={this.state.word}
								formId={this.mFormId}
								title='Edit word' />
						</div>
					}
				</div>
				{ this.state.word?.wordId &&
					<footer id="word-footer" style={{backgroundColor: backgroundColorDark, color: textColor}}>
						<div className="container">
							<p className="text-left m-0">
								Created on {moment(this.state.word.dateCreated).format('DD.MM.YYYY')}
							</p>
						</div>
					</footer>
				}
			</div>
		)
	}

	private createDetailLayout (word: WordDetailModel) {
		const { textColor } = this.mThemeService

		const primarySectionPositioning = word.transcription
			? { original: 'col-sm-4', translation: 'col-sm-4' }
			: { original: 'col-sm-6', translation: 'col-sm-6' }
	
		const secondarySectionPositioning = 'col-12' + word.timesAccessed
			? 'col-sm-5'
			: ''
	
		const dateLastAccessed = word.dateLastAccessed
			? moment(word.dateLastAccessed).format('DD.MM.YYYY')
			: 'Never'
	
		const doughnutChartData = this.createDoughnutChartData(word.timesCorrect, word.timesAccessed)
		
		return (
			<div className="text-left">
				<div className="row mb-3">
					{this.createPrimaryItemLayout('Original', word.original, primarySectionPositioning.original)}
					{this.createPrimaryItemLayout('Translation', word.translation, primarySectionPositioning.translation)}
					{word.transcription && this.createPrimaryItemLayout('Transcription', word.transcription, 'col-sm-4')}
					{word.notes && this.createPrimaryItemLayout('Notes', word.notes)}
				</div>
				<hr style={{borderTopColor: textColor}} />
				<div className="row">
					<div className={secondarySectionPositioning}>
						{this.createSecondaryItemLayout('Mark', word.mark.toString())}
						{this.createSecondaryItemLayout('Last accessed', dateLastAccessed)}
						{this.createSecondaryItemLayout('Is in study', word.isStudiable ? 'Yes' : 'No')}
						{this.createSecondaryItemLayout('Is favourite', word.isFavourite ? 'Yes' : 'No')}
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
	
	private createPrimaryItemLayout(label: string, text: string, positioning: string | undefined = undefined) {
		const positioningClass = 'col-12' + (positioning ? ` ${positioning}` : '')
		const {textColor} = this.mThemeService
	
		return (
			<div className={positioningClass}>
				<p className="text-muted m-0">{label}</p>
				<p className="font-size-25" style={{color: textColor}}>{text}</p>
			</div>
		)
	}
	
	private createSecondaryItemLayout(label: string, text: string) {
		const {textColor} = this.mThemeService

		return (
			<p>
				<span className="text-muted">{label}: </span>
				<span className="font-size-20" style={{color: textColor}}>{text}</span>
			</p>
		)
	}
	
	private createDoughnutChartData(timesCorrect: number | undefined, timesAccessed: number | undefined) {
		if (!timesAccessed)
			return undefined
	
		const correct = timesCorrect ?? 0
		const wrong = timesAccessed - correct
		const {colorGood, colorBad} = this.mThemeService
	
		return {
			datasets: [{
				data: [correct, wrong],
				backgroundColor: [colorGood, colorBad]
			}],
			labels: [
				'Correct',
				'Wrong'
			]
		}
	}
}

interface Props extends RouteComponentProps<{
	wordId: string
}> {}

interface State {
	word: WordDetailModel | undefined
}