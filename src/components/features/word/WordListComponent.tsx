import Octicon, { Plus } from '@primer/octicons-react'
import ComponentBase from 'components/ComponentBase'
import WordFormComponent from 'components/features/word/WordFormComponent'
import { getMarkState } from 'functions/word/markStateFunctions'
import WordListModel from 'models/word/wordListModel'
import React from 'react'
import { Link } from 'react-router-dom'
import { h1IconHeight } from 'resources/constants/uiConstants'
import { wordList } from 'resources/routing/routes'
import ThemeService from 'services/ui/themeService'
import WordService from 'services/wordService'
import { container } from 'tsyringe'
import createSpinner from 'ui/createSpinner'
import './WordListComponent.css'

export default class WordListComponent extends ComponentBase<Props, State> {
	private readonly mWordService = container.resolve(WordService)
	private readonly mThemeService = container.resolve(ThemeService)

	private readonly mFormId = 'wordAdd'

	constructor(props: Props) {
		super(props)

		this.state = { words: undefined }
	}

	protected createSubscription = () =>
		this.mWordService.getListSubscription(25, x => this.setState({words: x}))

	render = () => {
		const {textColor, textColorBold} = this.mThemeService

		return (
			<div className="container">
				<div className="row col-12 m-0">
					<h1 className="text-left m-0" style={{color: textColorBold}}>Latest words</h1>
					<button type="button" className="close ml-auto" data-toggle="modal" data-target={`#${this.mFormId}`}
						style={{color: textColor}}>
						<Octicon icon={Plus} height={h1IconHeight}/>
					</button>
				</div>
				<hr style={{borderTopColor: textColor}} />
				{ this.state.words?.map((x, i) => this.createListItem(x, i)) }
				{ this.state.words?.length === 0 && <div style={{color: textColor}}>No words found</div> }
				{ this.state.words === undefined && createSpinner(textColor) }
				<WordFormComponent
					word={undefined}
					formId={this.mFormId}
					title='Add new word' />
			</div>
		)
	}

	private createListItem(word: WordListModel, index: number) {
		const originalSizing = 'col-sm-6 col-lg-5'
		const translationSizing = 'col-sm-6 col-lg-7'
		const {backgroundColor, textColor, textColorBold} = this.mThemeService
	
		return (
			<div className={`card mb-2 text-left px-3 py-1 mark mark-${getMarkState(word.mark)}`} key={index}
				style={{backgroundColor: backgroundColor, borderColor: textColor}}>
				<div className="row text-muted d-none d-sm-flex">
					<p className={`${originalSizing} m-0`}>Original</p>
					<p className={`${translationSizing} m-0`}>Translation</p>
				</div>
				<div className="row" style={{color: textColor}}>
					<Link className={`${originalSizing} font-weight-550 font-size-20`} to={`${wordList}/${word.wordId}`}
						style={{color: textColorBold}}>
						<p className="m-0">{word.original}</p>
					</Link>
					<p className={`${translationSizing} font-size-25 m-0`}>{this.createTranslationText(word)}</p>
				</div>
			</div>
		)
	}
	
	private createTranslationText(model: WordListModel) {
		return model.transcription
		? `${model.translation} [${model.transcription}]`
		: model.translation
	}
}

interface Props {}

interface State {
	words: WordListModel[] | undefined
}