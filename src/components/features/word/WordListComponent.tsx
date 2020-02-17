import Octicon, { Plus } from '@primer/octicons-react'
import ComponentBase from 'components/ComponentBase'
import WordFormComponent from 'components/features/word/WordFormComponent'
import { getMarkState } from 'functions/word/markStateFunctions'
import WordListModel from 'models/word/wordListModel'
import React from 'react'
import { Link } from 'react-router-dom'
import { h1IconHeight } from 'resources/constants/uiConstants'
import { wordList } from 'resources/routing/routes'
import WordService from 'services/wordService'
import { container } from 'tsyringe'
import createSpinner from 'ui/createSpinner'
import './WordListComponent.css'

export default class WordListComponent extends ComponentBase<{}, State> {
	private readonly mWordService = container.resolve(WordService)
	private readonly mFormId = 'wordAdd'

	constructor(props: {}) {
		super(props)

		this.state = { words: undefined }
	}

	protected createSubscription = () =>
		this.mWordService.getListSubscription(25, x => this.setState({words: x}))

	render = () => (
		<div className="container">
			<div className="row col-12 m-0">
				<h1 className="text-left m-0">Latest words</h1>
				<button type="button" className="close ml-auto" data-toggle="modal" data-target={`#${this.mFormId}`}>
					<Octicon icon={Plus} height={h1IconHeight}/>
				</button>
			</div>
			<hr/>
			{ this.state.words?.map((x, i) => createListItem(x, i)) }
			{ this.state.words?.length === 0 && "No words found" }
			{ this.state.words === undefined && createSpinner() }
			<WordFormComponent word={undefined} formId={this.mFormId} title='Add new word' />
		</div>
	)
}

interface State {
	words: WordListModel[] | undefined
}

const createListItem = (word: WordListModel, index: number) => {
	const originalSizing = 'col-sm-6 col-lg-5'
	const translationSizing = 'col-sm-6 col-lg-7'

	return (
		<div className={`card mb-2 text-left px-3 py-1 mark mark-${getMarkState(word.mark)}`} key={index}>
			<div className="row text-muted d-none d-sm-flex">
				<p className={originalSizing}>Original</p>
				<p className={translationSizing}>Translation</p>
			</div>
			<div className="row">
				<Link className={`${originalSizing} text-dark font-weight-550 font-size-20`} to={`${wordList}/${word.wordId}`}>
					<p className="m-0">{word.original}</p>
				</Link>
				<p className={`${translationSizing} font-size-25 m-0`}>{createTranslationText(word)}</p>
			</div>
		</div>
	)
}

const createTranslationText = (model: WordListModel) =>
	model.transcription
		? `${model.translation} [${model.transcription}]`
		: model.translation