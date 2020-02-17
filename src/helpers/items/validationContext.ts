import 'functions/systemTypes/arrayFunctions'
import SubDisposable from 'helpers/disposable/subDisposable'
import RuleBase from 'helpers/items/rules/ruleBase'
import SourceList from 'helpers/rx/sourceList'
import Disposable from 'models/system/disposable'
import { combineLatest, Observable, ReplaySubject } from 'rxjs'
import { distinctUntilChanged, map, publish, startWith } from 'rxjs/operators'

export default class ValidationContext<T> implements Disposable {
	private readonly mDisposable = new SubDisposable()
	private readonly mRuleSource = new SourceList<RuleBase<T>>()

	private readonly mIsValidSibject = new ReplaySubject<boolean>(1)
	private readonly mErrorMessageSubject = new ReplaySubject<string | undefined>()

	private mIsValid: boolean = false
	private mErrorMessage: string | undefined

	constructor(valueObservable: Observable<T>) {
		const ruleObservable = publish<RuleBase<T> | undefined>()(
			combineLatest(
				valueObservable,
				this.mRuleSource.collectionChanged.pipe(startWith([]))
			).pipe(
				map(x => x[1].firstOrDefault<RuleBase<T>>(y => !y.validate(x[0])) ),
			))

		const isValidDisp = ruleObservable
			.pipe(
				map(x => x === undefined),
				distinctUntilChanged()
			).subscribe(x => this.isValidInternal = x)
		this.mDisposable.add(isValidDisp)

		const errorMessageDisp = ruleObservable
			.pipe(
				map(x => x?.errorMessage),
				distinctUntilChanged()
			).subscribe(x => this.errorMessageInternal = x)
		this.mDisposable.add(errorMessageDisp)

		const ruleDisp = ruleObservable.connect()
		this.mDisposable.add(ruleDisp)
	}

	public get isValidObservable() { return this.mIsValidSibject.asObservable() }
	public get errorMessageObservable() { return this.mErrorMessageSubject.asObservable() }

	public get isValid() { return this.mIsValid }
	private set isValidInternal(isValid: boolean) { 
		this.mIsValid = isValid;
		this.mIsValidSibject.next(isValid)
	}

	public get errorMessage() { return this.mErrorMessage }
	private set errorMessageInternal(errorMessage: string | undefined) {
		this.mErrorMessage = errorMessage
		this.mErrorMessageSubject.next(errorMessage)
	}

	public addRule(rule: RuleBase<T>) {
		this.mRuleSource.add(rule)
	}

	public addRules(...rules: RuleBase<T>[]) {
		this.mRuleSource.addMany(...rules)
	}

	public dispose() {
		this.mDisposable.dispose()
	}
}