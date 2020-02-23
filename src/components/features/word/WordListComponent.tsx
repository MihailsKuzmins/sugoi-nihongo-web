import Octicon, { Plus } from '@primer/octicons-react'
import ComponentBase from 'components/ComponentBase'
import WordFormComponent from 'components/features/word/WordFormComponent'
import withNightMode, { NightModeProps } from 'components/_hoc/withNightMode'
import { getMarkState } from 'functions/word/markStateFunctions'
import WordListModel from 'models/word/wordListModel'
import React from 'react'
import { Link } from 'react-router-dom'
import { darkMode, h1IconHeight, lightMode } from 'resources/constants/uiConstants'
import { wordList } from 'resources/routing/routes'
import { lightBackground, lightTextBoldColor, lightTextColor, nightBackground, nightTextBoldColor, nightTextColor } from 'resources/ui/colors'
import WordService from 'services/wordService'
import { container } from 'tsyringe'
import createSpinner from 'ui/createSpinner'
import './WordListComponent.css'

class WordListComponent extends ComponentBase<Props, State> {
	private readonly mWordService = container.resolve(WordService)
	private readonly mFormId = 'wordAdd'

	constructor(props: Props) {
		super(props)

		this.state = { words: undefined }
	}

	protected createSubscription = () =>
		this.mWordService.getListSubscription(25, x => this.setState({words: x}))

	render = () => {
		const colors: Colors = this.props.isNightMode
			? {bgColor: nightBackground, textColor: nightTextColor, textBoldColor: nightTextBoldColor, cardBorderMode: lightMode}
			: {bgColor: lightBackground, textColor: lightTextColor, textBoldColor: lightTextBoldColor, cardBorderMode: darkMode}

		return (
			<div className="container">
				<div className="row col-12 m-0">
					<h1 className="text-left m-0" style={{color: colors.textBoldColor}}>Latest words</h1>
					<button type="button" className="close ml-auto" data-toggle="modal" data-target={`#${this.mFormId}`}
						style={{color: colors.textColor}}>
						<Octicon icon={Plus} height={h1IconHeight}/>
					</button>
				</div>
				<hr style={{borderTopColor: colors.textColor}} />
				{ this.state.words?.map((x, i) => createListItem(x, i, colors)) }
				{ this.state.words?.length === 0 && <div style={{color: colors.textColor}}>No words found</div> }
				{ this.state.words === undefined && createSpinner(this.props.isNightMode) }
				<WordFormComponent word={undefined} formId={this.mFormId} title='Add new word' isNightMode={this.props.isNightMode} />
			</div>
		)
	}
}

export default withNightMode<BasicProps>(WordListComponent)

interface BasicProps {}
interface Props extends NightModeProps, BasicProps {}

interface State {
	words: WordListModel[] | undefined
}

interface Colors {
	bgColor: string,
	textColor: string,
	textBoldColor: string,
	cardBorderMode: string
}

const createListItem = (word: WordListModel, index: number, colors: Colors) => {
	const originalSizing = 'col-sm-6 col-lg-5'
	const translationSizing = 'col-sm-6 col-lg-7'

	return (
		<div className={`card border-${colors.cardBorderMode} mb-2 text-left px-3 py-1 mark mark-${getMarkState(word.mark)}`} key={index}
			style={{backgroundColor: colors.bgColor}}>
			<div className="row text-muted d-none d-sm-flex">
				<p className={`${originalSizing} m-0`}>Original</p>
				<p className={`${translationSizing} m-0`}>Translation</p>
			</div>
			<div className="row" style={{color: colors.textColor}}>
				<Link className={`${originalSizing} font-weight-550 font-size-20`} to={`${wordList}/${word.wordId}`}
					style={{color: colors.textBoldColor}}>
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