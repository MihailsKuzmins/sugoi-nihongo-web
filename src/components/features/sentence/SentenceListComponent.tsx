import Octicon, { Plus } from '@primer/octicons-react'
import ComponentBase from 'components/ComponentBase'
import SentenceFormComponent from 'components/features/sentence/SentenceFormComponent'
import SentenceListModel from 'models/sentence/sentenceListModel'
import React from 'react'
import { Link } from 'react-router-dom'
import { h1IconHeight } from 'resources/constants/uiConstants'
import { sentenceList } from 'resources/routing/routes'
import SentenceService from 'services/sentenceService'
import ThemeService from 'services/ui/themeService'
import { container } from 'tsyringe'
import createSpinner from 'ui/createSpinner'

export default class SentenceListComponent extends ComponentBase<Props, State> {
	private readonly mSentenceService = container.resolve(SentenceService)
	private readonly mThemeService = container.resolve(ThemeService)

	private readonly mFormId = 'sentenceAdd'

	constructor(props: Props) {
		super(props)
		
		this.state = {sentences: undefined}
	}

	protected createSubscription = () =>
		this.mSentenceService.getListSubscription(25, x => this.setState({sentences: x}))

	public readonly render = () => {
		const {textColor, textColorBold} = this.mThemeService

		return (
			<div className="container">
				<div className="row col-12 m-0">
					<h1 className="text-left m-0" style={{color: textColorBold}}>Latest sentences</h1>
					<button type="button" className="close ml-auto" data-toggle="modal" data-target={`#${this.mFormId}`}
						style={{color: textColor}}>
						<Octicon icon={Plus} height={h1IconHeight}/>
					</button>
				</div>
				<hr style={{borderTopColor: textColor}} />
				{ this.state.sentences?.map((x, i) => this.createListItem(x, i)) }
				{ this.state.sentences?.length === 0 && <div style={{color: textColor}}>No sentences found</div> }
				{ this.state.sentences === undefined && createSpinner(textColor) }
				<SentenceFormComponent
					sentence={undefined}
					formId={this.mFormId}
					title='Add new sentence' />
			</div>
		)
	}

	private createListItem(sentence: SentenceListModel, index: number) {
		const originalSizing = 'col-sm-6 col-lg-5'
		const translationSizing = 'col-sm-6 col-lg-7'
		const {textColor, textColorBold, backgroundColor} = this.mThemeService
	
		return (
			<div className="card mb-2 text-left px-3 py-1" key={index} style={{backgroundColor: backgroundColor, borderColor: textColor}}>
				<div className="row text-muted d-none d-sm-flex">
					<p className={`${originalSizing} m-0`}>Original</p>
					<p className={`${translationSizing} m-0`}>Translation</p>
				</div>
				<div className="row">
					<Link className={`${originalSizing} font-weight-550 font-size-20`} to={`${sentenceList}/${sentence.sentenceId}`} style={{color: textColorBold}}>
						<p className="m-0">{sentence.original}</p>
					</Link>
					<p className={`${translationSizing} font-size-25 m-0`} style={{color: textColor}}>{sentence.translation}</p>
				</div>
			</div>
		)
	}
}

interface Props {}

interface State {
	sentences: SentenceListModel[] | undefined
}