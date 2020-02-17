import Octicon, { Plus } from '@primer/octicons-react'
import ComponentBase from 'components/ComponentBase'
import SentenceFormComponent from 'components/features/sentence/SentenceFormComponent'
import SentenceListModel from 'models/sentence/sentenceListModel'
import React from 'react'
import { Link } from 'react-router-dom'
import { h1IconHeight } from 'resources/constants/uiConstants'
import { sentenceList } from 'resources/routing/routes'
import SentenceService from 'services/sentenceService'
import { container } from 'tsyringe'
import createSpinner from 'ui/createSpinner'

export default class SentenceListComponent extends ComponentBase<{}, State> {
	private readonly mSentenceService = container.resolve(SentenceService)
	private readonly mFormId = 'sentenceAdd'

	constructor(props: {}) {
		super(props)
		
		this.state = {sentences: undefined}
	}

	protected createSubscription = () =>
		this.mSentenceService.getListSubscription(25, x => this.setState({sentences: x}))

	render = () => (
		<div className="container">
			<div className="row col-12 m-0">
				<h1 className="text-left m-0">Latest sentences</h1>
				<button type="button" className="close ml-auto" data-toggle="modal" data-target={`#${this.mFormId}`}>
					<Octicon icon={Plus} height={h1IconHeight}/>
				</button>
			</div>
			<hr/>
			{ this.state.sentences?.map((x, i) => createListItem(x, i)) }
			{ this.state.sentences?.length === 0 && "No sentences found" }
			{ this.state.sentences === undefined && createSpinner() }
			<SentenceFormComponent sentence={undefined} formId={this.mFormId} title='Add new sentence' />
		</div>
	)
}

interface State {
	sentences: SentenceListModel[] | undefined
}

const createListItem = (sentence: SentenceListModel, index: number) => {
	const originalSizing = 'col-sm-6 col-lg-5'
	const translationSizing = 'col-sm-6 col-lg-7'

	return (
		<div className="card mb-2 text-left px-3 py-1" key={index}>
			<div className="row text-muted d-none d-sm-flex">
				<p className={originalSizing}>Original</p>
				<p className={translationSizing}>Translation</p>
			</div>
			<div className="row">
				<Link className={`${originalSizing} text-dark font-weight-550 font-size-20`} to={`${sentenceList}/${sentence.sentenceId}`}>
					<p className="m-0">{sentence.original}</p>
				</Link>
				<p className={`${translationSizing} font-size-25 m-0`}>{sentence.translation}</p>
			</div>
		</div>
	)
}