import FormComponentBase from 'components/FormComponentBase'
import TextAreaItemComponent, { TextAreaItem } from 'components/system/items/TextAreaItemComponent'
import CloseModalButtonComponent, { CloseModalButton } from 'components/system/misc/CloseModalButtonComponent'
import LoadingButtonComponent, { LoadingButton } from 'components/system/misc/LoadingButtonComponent'
import { hasNoKanji } from 'functions/japaneseFunctions'
import SubDisposable from 'helpers/disposable/subDisposable'
import JapaneseRule from 'helpers/items/rules/japaneseRule'
import JapaneseWithoutKanjiRule from 'helpers/items/rules/japaneseWithoutKanjiRule'
import NotJapaneseRule from 'helpers/items/rules/notJapaneseRule'
import NotNullOrWhiteSpaceRule from 'helpers/items/rules/notNullOrWhiteSpaceRule'
import SentenceDetailModel from 'models/sentence/sentenceDetailModel'
import { LooseObject } from 'models/system/looseObject'
import React from 'react'
import { sentenceOriginal, sentenceTranscription, sentenceTranslation } from 'resources/constants/firestoreConstants'
import { distinctUntilChanged, map } from 'rxjs/operators'
import SentenceService from 'services/sentenceService'
import ThemeService from 'services/ui/themeService'
import { container } from 'tsyringe'

export default class SentenceFormComponent extends FormComponentBase<Props> {
	private readonly mSentenceService = container.resolve(SentenceService)
	private readonly mThemeService = container.resolve(ThemeService)
	
	private readonly mLoadingButton = new LoadingButton('Save', 'Saving...')
	private readonly mCloseModalButton = new CloseModalButton()

	private readonly mOriginalItem: TextAreaItem
	private readonly mTranslationItem: TextAreaItem
	private readonly mTranscriptionItem: TextAreaItem

	constructor(props: Props) {
		super(props)

		const sentenceMaxLength = 100
		const notNullOrWhiteSpaceRule = new NotNullOrWhiteSpaceRule()

		this.mOriginalItem = new TextAreaItem('Original', 'sentenceOriginal', 'Sentece in your language...')
			.addRules(notNullOrWhiteSpaceRule, new NotJapaneseRule())
			.setMaxLength(sentenceMaxLength)

		this.mTranslationItem = new TextAreaItem('Translation', 'sentenceTranslation', 'Japanese sentence...')
			.addRules(notNullOrWhiteSpaceRule, new JapaneseRule())
			.setMaxLength(sentenceMaxLength)

		this.mTranscriptionItem = new TextAreaItem('Transcription', 'sentenceTranscription', 'Kana transcription of the sentence...')
			.addRules(notNullOrWhiteSpaceRule, new JapaneseWithoutKanjiRule())
			.setMaxLength(sentenceMaxLength)
		
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

	public readonly render = () => {
		const {textColorBold, backgroundColor, backgroundColorDark} = this.mThemeService

		return (
			<div className="modal fade m-0" id={this.props.formId} tabIndex={-1} role="dialog" aria-hidden="true">
				<div className="modal-dialog" role="document">
					<div className="modal-content" style={{backgroundColor: backgroundColorDark}}>
						<div className="modal-header" style={{color: textColorBold}}>
							<h5 className="modal-title">{this.props.title}</h5>
							<CloseModalButtonComponent button={this.mCloseModalButton} />
						</div>
						<div className="modal-body" style={{backgroundColor: backgroundColor}}>
							<form onSubmit={this.handleSubmitAsync}>
								<TextAreaItemComponent item={this.mOriginalItem} />
								<TextAreaItemComponent item={this.mTranslationItem} />
								<TextAreaItemComponent item={this.mTranscriptionItem} />
								<div className="modal-footer">
									<LoadingButtonComponent button={this.mLoadingButton} />
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		)
	}

	protected readonly getSaveFields = () => [
		{firestoreField: sentenceOriginal, item: this.mOriginalItem},
		{firestoreField: sentenceTranslation, item: this.mTranslationItem},
		{firestoreField: sentenceTranscription, item: this.mTranscriptionItem}
	]

	protected readonly saveValuesAsync = async (data: LooseObject) =>
		await this.mSentenceService.saveDetailAsync(this.props.sentence?.sentenceId, data)

	protected readonly shouldUpdateInitialValues = (prevProps: Props, newProps: Props) => 
		prevProps.sentence !== newProps.sentence

	protected readonly shouldResetValuesAfterSave = () =>
		this.props.sentence === undefined

	protected readonly setItemInitialValues = (props: Props) => {
		this.mOriginalItem.initialValue = props.sentence?.original ?? ''
		this.mTranslationItem.initialValue= props.sentence?.translation ?? ''
		this.mTranscriptionItem.initialValue= props.sentence?.transcription ?? ''
	}
}

interface Props {
	sentence: SentenceDetailModel | undefined
	formId: string,
	title: string
}