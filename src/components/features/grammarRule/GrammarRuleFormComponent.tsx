import FormComponentBase from 'components/FormComponentBase'
import InputItemComponent, { InputItem } from 'components/system/items/InputItemComponent'
import TextAreaItemComponent, { TextAreaItem } from 'components/system/items/TextAreaItemComponent'
import CloseModalButtonComponent, { CloseModalButton } from 'components/system/misc/CloseModalButtonComponent'
import LoadingButtonComponent, { LoadingButton } from 'components/system/misc/LoadingButtonComponent'
import withClosingModal from 'components/_hoc/withClosingModal'
import SubDisposable from 'helpers/disposable/subDisposable'
import NotNullOrWhiteSpaceRule from 'helpers/items/rules/notNullOrWhiteSpaceRule'
import GrammarRuleDetailModel from 'models/grammarRule/grammarRuleDetailModel'
import { LooseObject } from 'models/system/looseObject'
import React from 'react'
import { grammarRuleBody, grammarRuleHeader } from 'resources/constants/firestoreConstants'
import GrammarRuleService from 'services/grammarRuleService'
import ThemeService from 'services/ui/themeService'
import { container } from 'tsyringe'

class GrammarRuleFormComponent extends FormComponentBase<Props> {
	private readonly mGrammarRuleService = container.resolve(GrammarRuleService)
	private readonly mThemeService = container.resolve(ThemeService)

	private readonly mLoadingButton = new LoadingButton('Save', 'Saving...')
	private readonly mCloseModalButton = new CloseModalButton()

	private readonly mHeaderItem: InputItem
	private readonly mBodyItem: TextAreaItem

	constructor(props: Props) {
		super(props)

		const notNullOrWhiteSpaceRule = new NotNullOrWhiteSpaceRule()

		this.mHeaderItem = new InputItem('Header', 'grammarRuleHeader', 'Header of the rule...')
			.addRule(notNullOrWhiteSpaceRule)
			.setMaxLength(64)

		this.mBodyItem = new TextAreaItem('Body', 'grammarRuleBody', 'Main text of the rule...', 10)
			.addRule(notNullOrWhiteSpaceRule)
			.setMaxLength(4096)

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
	}

	public readonly render = () => {
		const {textColorBold, backgroundColorDark, backgroundColor} = this.mThemeService

		return (
			<div className="modal fade m-0" id={this.props.formId} tabIndex={-1} role="dialog" aria-hidden="true">
				<div className="modal-dialog modal-xl" role="document">
					<div className="modal-content" style={{backgroundColor: backgroundColorDark}}>
						<div className="modal-header" style={{color: textColorBold}}>
							<h5 className="modal-title">{this.props.title}</h5>
							<CloseModalButtonComponent button={this.mCloseModalButton} />
						</div>
						<div className="modal-body" style={{backgroundColor: backgroundColor}}>
							<form onSubmit={this.handleSubmitAsync}>
								<InputItemComponent item={this.mHeaderItem} />
								<TextAreaItemComponent item={this.mBodyItem} />
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
		{firestoreField: grammarRuleHeader, item: this.mHeaderItem},
		{firestoreField: grammarRuleBody, item: this.mBodyItem}
	]

	protected readonly saveValuesAsync = async (data: LooseObject) => 
		await this.mGrammarRuleService.saveDocumentAsync(this.props.grammarRule?.grammarRuleId, data)

	protected readonly shouldUpdateInitialValues = (prevProps: Props, newProps: Props) => 
		prevProps.grammarRule !== newProps.grammarRule

	protected readonly shouldResetValuesAfterSave = () =>
		this.props.grammarRule === undefined

	protected readonly setItemInitialValues = (props: Props) => {
		this.mHeaderItem.initialValue = props.grammarRule?.header ?? ''
		this.mBodyItem.initialValue = props.grammarRule?.body ?? ''
	}
}

export default withClosingModal(GrammarRuleFormComponent)

interface Props {
	grammarRule: GrammarRuleDetailModel | undefined,
	formId: string,
	title: string
}