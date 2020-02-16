import React from 'react'
import { ReplaySubject, Observable, combineLatest } from 'rxjs'
import { startWith, distinctUntilChanged, map } from 'rxjs/operators'
import SubDisposable from 'helpers/disposable/subDisposable'
import CompositeDisposable from 'helpers/disposable/compositeDisposable'
import ValidationContext from 'helpers/items/validationContext'
import RuleBase from 'helpers/items/rules/ruleBase'
import Disposable from 'models/system/disposable'

export default abstract class ItemComponentBase<TValue, TProps extends { item: ItemBase<TValue> }, TState extends StateBase<TValue>> extends React.PureComponent<TProps, TState> {
	private readonly mDisposable = new CompositeDisposable()
	private readonly mSubDisposable = new SubDisposable()

	constructor(props: TProps) {
		super(props)
		
		this.mDisposable.add(props.item)
	}

	public readonly componentDidMount = () => {
		super.componentDidMount?.()
		this.initSubscriptions(this.mSubDisposable)
	}

	public readonly componentWillUnmount = () => {
		this.mSubDisposable.dispose()
		this.mDisposable.dispose()
		super.componentWillUnmount?.()
	}

	protected initSubscriptions(d: SubDisposable) {
		const { valueObservable, isDisabledObservable, isValidObservable, errorMessageObservable } = this.props.item

		const valueDisp = valueObservable
			.subscribe(x => this.setState({value: x}))
		d.add(valueDisp)

		const idDisabledDisp = isDisabledObservable
			.subscribe(x => this.setState({isDisabled: x}))
		d.add(idDisabledDisp)

		const isValidDisp = isValidObservable
			.subscribe(x => this.setState({isValid: x}))
		d.add(isValidDisp)

		const errorMessageDisp = errorMessageObservable
			.subscribe(x => this.setState({errorMessage: x}))
		d.add(errorMessageDisp)
	}

	protected getInitialState(props: TProps): StateBase<TValue> {
		return {
			value: props.item.value,
			isDisabled: props.item.isDisabled,
			isValid: props.item.isValid,
			errorMessage: props.item.errorMessage
		}
	}
}

export abstract class ItemBase<TValue> implements Item, Disposable {
	private readonly mValueSubject = new ReplaySubject<TValue>(1)
	private readonly mIsDisabledSubject = new ReplaySubject<boolean>(1)
	private readonly mIsValidSubject = new ReplaySubject<boolean>(1)
	
	private readonly mValueObservable: Observable<TValue>
	private readonly mIsDisabledObservable: Observable<boolean>
	private readonly mIsValidObservable: Observable<boolean>

	private readonly mDisposable = new CompositeDisposable()
	private readonly mValidationContext: ValidationContext<TValue>

	private mInitialValue: TValue
	private mIsDisabled: boolean = false
	private mIsValid: boolean = false

	constructor(public readonly label: string, private mValue: TValue) {
		this.mInitialValue = mValue
		this.mValueObservable = this.mValueSubject.asObservable()
			.pipe(
				startWith(mValue),
				distinctUntilChanged()
			)
		
		this.mIsDisabledObservable = this.mIsDisabledSubject.asObservable()
			.pipe(
				startWith(this.mIsDisabled),
				distinctUntilChanged()
			)

		this.mIsValidObservable = this.mIsValidSubject.asObservable()
			.pipe(
				startWith(this.mIsValid),
				distinctUntilChanged()
			)

		this.mValidationContext = new ValidationContext(this.mValueObservable)
		this.mDisposable.add(this.mValidationContext)

		combineLatest(
			this.mValidationContext.isValidObservable,
			this.mIsDisabledObservable
		).pipe(
			map(x => x[1] ? true : x[0]),
			distinctUntilChanged()
		).subscribe(x =>  this.isValidInternal = x)
	}

	public get valueAny(): any { return this.mValue }

	public get value() { return this.mValue }
	public set value(value: TValue) { 
		if (this.mValue === value)
			return

		this.mValue = value
		this.mValueSubject.next(value)
	}

	public get initialValue() { return this.mInitialValue }
	public set initialValue(value: TValue) {
		this.value = value

		if (this.mInitialValue !== value)
			this.mInitialValue = value
	}

	public get isDisabled() { return this.mIsDisabled }
	public set isDisabled(isDisabled: boolean) {
		if (this.mIsDisabled === isDisabled)
			return

		this.mIsDisabled = isDisabled
		this.mIsDisabledSubject.next(isDisabled)
	}

	public get isValid() { return this.mIsValid }
	private set isValidInternal(isValid: boolean) {
		if (this.mIsValid === isValid)
			return

		this.mIsValid = isValid
		this.mIsValidSubject.next(isValid)
	}

	public get errorMessage() { return this.mValidationContext.errorMessage }
	public get errorMessageObservable() { return this.mValidationContext.errorMessageObservable }

	public get isValueChanged() { return this.mValue !== this.mInitialValue }

	public get valueObservable() { return this.mValueObservable }
	public get isDisabledObservable() { return this.mIsDisabledObservable }
	public get isValidObservable() { return this.mIsValidObservable }

	protected addRule(rule: RuleBase<TValue>) {
		this.mValidationContext.addRule(rule)
	}

	protected addRules(...rules: RuleBase<TValue>[]) {
		this.mValidationContext.addRules(...rules)
	}

	public dispose() {
		this.mDisposable.dispose()
	}
}

export interface Item {
	valueAny: any
	isValueChanged: boolean
	isDisabled: boolean,
	isValid: boolean,
	errorMessage: string | undefined
}

interface StateBase<T> {
	value: T,
	isDisabled: boolean,
	isValid: boolean,
	errorMessage: string | undefined
}