import React from 'react'
import { setModalNonCancellable, hideModal } from 'functions/uiFunctions'
import { LooseObject } from 'models/system/looseObject'
import FirestoreToItemModel from 'models/system/firestoreFieldToItemModel'
import { createSaveData } from 'functions/system/inputItemFunctions'
import SubDisposable from 'helpers/disposable/subDisposable'
import FormAlertComponent, { FormAlert } from 'components/system/misc/FormAlertComponent'
import FirestoreConstraintError from 'resources/errors/firestoreConstraintError'
import { ReplaySubject } from 'rxjs'

export default abstract class FormComponentBase<TProps extends Props> extends React.Component<TProps> {
	private readonly mIsLoadingSubject = new ReplaySubject<boolean>(1)
	private readonly mSubDisposable = new SubDisposable()
	private readonly mFormAlert = new FormAlert()

	public componentDidMount() {
		super.componentDidMount?.()
		setModalNonCancellable(this.props.formId)
		this.initSubscriptions(this.mSubDisposable)
	}

	public componentWillUnmount() {
		this.mSubDisposable.dispose()
		super.componentWillUnmount?.()
	}

	public readonly componentDidUpdate = (prevProps: Readonly<TProps>, prevState: Readonly<{}>) => {
		super.componentDidUpdate?.(prevProps, prevState)

		if (this.shouldUpdateInitialValues(prevProps, this.props))
			this.setItemInitialValues(this.props)
	}

	protected get isLoadingObservable() { return this.mIsLoadingSubject.asObservable() }

	protected initSubscriptions(d: SubDisposable) {}

	protected createFormAlertComponent() {
		return <FormAlertComponent alert={this.mFormAlert} />
	}

	protected readonly handleSubmitAsync = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		this.mFormAlert.reset()

		const saveFields = this.getSaveFields()
		const isValid = saveFields
			.every(x => x.item.isValid)

		if (!isValid)
			return

		this.mIsLoadingSubject.next(true)

		try {
			const saveData = createSaveData(saveFields)
			await this.saveValuesAsync(saveData)

			hideModal(this.props.formId)

			if (this.shouldResetValuesAfterSave())
				this.resetValues()
		} catch (e) {
			this.handleError(e)
		} finally {
			this.mIsLoadingSubject.next(false)
		}
	}

	protected abstract shouldUpdateInitialValues: (prevProps: TProps, newProps: TProps) => boolean
	protected abstract shouldResetValuesAfterSave: () => boolean
	protected abstract setItemInitialValues: (props: TProps) => void
	protected abstract getSaveFields: () => FirestoreToItemModel[]
	protected abstract saveValuesAsync: (data: LooseObject) => Promise<void>

	private readonly resetValues = () =>
		this.setItemInitialValues(this.props)

	private readonly handleError = (error: Error) => {
		switch (error.constructor) {
			case FirestoreConstraintError:
				const e = error as FirestoreConstraintError
				this.mFormAlert.alertMessage = `The same entry already exists: "${e.value}"`
				break
			default:
				throw error
		}
	}
}

interface Props {
	formId: string
}