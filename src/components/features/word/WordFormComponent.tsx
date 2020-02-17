import FormComponentBase from 'components/FormComponentBase'
import CheckboxItemComponent, { CheckboxItem } from 'components/system/items/CheckboxItemComponent'
import InputItemComponent, { InputItem } from 'components/system/items/InputItemComponent'
import TextAreaItemComponent, { TextAreaItem } from 'components/system/items/TextAreaItemComponent'
import CloseModalButtonComponent, { CloseModalButton } from 'components/system/misc/CloseModalButtonComponent'
import LoadingButtonComponent, { LoadingButton } from 'components/system/misc/LoadingButtonComponent'
import { hasNoKanji } from 'functions/japaneseFunctions'
import SubDisposable from 'helpers/disposable/subDisposable'
import KanaOrKanjiRule from 'helpers/items/rules/kanaOrKanjiRule'
import KanaRule from 'helpers/items/rules/kanaRule'
import NotJapaneseRule from 'helpers/items/rules/notJapaneseRule'
import NotNullOrWhiteSpaceRule from 'helpers/items/rules/notNullOrWhiteSpaceRule'
import { LooseObject } from 'models/system/looseObject'
import WordDetailModel from 'models/word/wordDetailModel'
import React from 'react'
import { wordIsFavourite, wordIsStudiable, wordNotes, wordOriginal, wordTranscription, wordTranslation } from 'resources/constants/firestoreConstants'
import { distinctUntilChanged, map } from 'rxjs/operators'
import WordService from 'services/wordService'
import { container } from 'tsyringe'

export default class WordFormComponent extends FormComponentBase<Props> {
	private readonly mWordService = container.resolve(WordService)
	private readonly mLoadingButton = new LoadingButton('Save', 'Saving...')
	private readonly mCloseModalButton = new CloseModalButton()

	private readonly mOriginalItem: InputItem
	private readonly mTranslationItem: InputItem
	private readonly mTranscriptionItem: InputItem
	private readonly mNotesItem: TextAreaItem
	private readonly mIsStudiableItem: CheckboxItem
	private readonly mIsFavouriteItem: CheckboxItem

	constructor(props: Props) {
		super(props)

		const notNullOrWhiteSpaceRule = new NotNullOrWhiteSpaceRule()

		this.mOriginalItem = new InputItem('Original', 'wordOriginal', 'Word in your language...')
			.addRules(notNullOrWhiteSpaceRule, new NotJapaneseRule())
			.setMaxLength(32)

		this.mTranslationItem = new InputItem('Translation', 'wordTranslation', 'Japanese word...')
			.addRules(notNullOrWhiteSpaceRule, new KanaOrKanjiRule())
			.setMaxLength(16)

		this.mTranscriptionItem = new InputItem('Transcription', 'wordTranscription', 'Kana transcription of the word...')
			.addRules(notNullOrWhiteSpaceRule, new KanaRule())
			.setMaxLength(16)

		this.mNotesItem = new TextAreaItem('Notes', 'wordNotes', 'Additional info about the word...')
			.setMaxLength(100)

		this.mIsStudiableItem = new CheckboxItem('Is in study', 'wordIsStudiable')
		this.mIsFavouriteItem = new CheckboxItem('Is favourite', 'wordIsFavourite')
		
		this.setItemInitialValues(props)
	}

	protected initSubscriptions(d: SubDisposable) {
		super.initSubscriptions(d)

		const isLoadingDisp = this.isLoadingObservable
			.subscribe(x => {
				this.mLoadingButton.isLoading = x
				this.mCloseModalButton.isDisabled = x
			})
		d.add(isLoadingDisp)

		const isTranscriptionDisabledDisp = this.mTranslationItem.valueObservable
			.pipe(
				map(x => hasNoKanji(x)),
				distinctUntilChanged()
			).subscribe(x => this.mTranscriptionItem.isDisabled = x)
		d.add(isTranscriptionDisabledDisp)
	}

	readonly render = () => (
		<div className="modal fade m-0" id={this.props.formId} tabIndex={-1} role="dialog" aria-hidden="true">
			<div className="modal-dialog" role="document">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">{this.props.title}</h5>
						<CloseModalButtonComponent button={this.mCloseModalButton} />
					</div>
					<div className="modal-body">
						{this.createFormAlertComponent()}
						<form onSubmit={this.handleSubmitAsync}>
							<InputItemComponent item={this.mOriginalItem} />
							<InputItemComponent item={this.mTranslationItem} />
							<InputItemComponent item={this.mTranscriptionItem} />
							<TextAreaItemComponent item={this.mNotesItem} />
							{this.props.word && this.renderControlsForExistingWord()}
							<div className="modal-footer">
								<LoadingButtonComponent button={this.mLoadingButton} />
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	)

	private readonly renderControlsForExistingWord = () => (
		<div className="row">
			<div className="col-6">
				<CheckboxItemComponent item={this.mIsStudiableItem} />
			</div>
			<div className="col-6">
				<CheckboxItemComponent item={this.mIsFavouriteItem} />
			</div>
		</div>
	)

	protected readonly getSaveFields = () => [
		{firestoreField: wordOriginal, item: this.mOriginalItem},
		{firestoreField: wordTranslation, item: this.mTranslationItem},
		{firestoreField: wordTranscription, item: this.mTranscriptionItem},
		{firestoreField: wordNotes, item: this.mNotesItem},
		{firestoreField: wordIsStudiable, item: this.mIsStudiableItem},
		{firestoreField: wordIsFavourite, item: this.mIsFavouriteItem}
	]

	protected readonly saveValuesAsync = async (data: LooseObject) =>
		await this.mWordService.saveDocumentAsync(this.props.word?.wordId, data)

	protected readonly shouldUpdateInitialValues = (prevProps: Props, newProps: Props) => 
		prevProps.word !== newProps.word

	protected readonly shouldResetValuesAfterSave = () =>
		this.props.word === undefined

	protected readonly setItemInitialValues = (props: Props) => {
		this.mOriginalItem.initialValue = props.word?.original ?? ''
		this.mTranslationItem.initialValue = props.word?.translation ?? ''
		this.mTranscriptionItem.initialValue = props.word?.transcription ?? ''
		this.mNotesItem.initialValue = props.word?.notes ?? ''
		this.mIsStudiableItem.initialValue = props.word?.isStudiable ?? false
		this.mIsFavouriteItem.initialValue = props.word?.isFavourite ?? false
	}
}

interface Props {
	word: WordDetailModel | undefined,
	formId: string,
	title: string
}