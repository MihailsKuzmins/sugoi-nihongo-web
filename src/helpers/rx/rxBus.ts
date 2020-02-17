import { LooseObjectV } from 'models/system/looseObjectV'
import { ReplaySubject, Subject } from 'rxjs'
import { distinctUntilChanged } from 'rxjs/operators'

export default abstract class RxBus {
	private static readonly mMessageBus: LooseObjectV<Subject<any>> = {}

	public static send<T>(value: T, contract: string) {
		RxBus.initSubjectIfNecessary<T>(contract)
			.next(value)
	}

	public static listen<T>(contract: string) {
		return RxBus.initSubjectIfNecessary<T>(contract)
			.pipe(
				distinctUntilChanged()
			)
	}

	private static initSubjectIfNecessary<T>(contract: string): Subject<T> {
		const currentContract = RxBus.mMessageBus[contract]
		if (currentContract !== undefined)
			return currentContract

		const newContract = new ReplaySubject<T>(1)
		RxBus.mMessageBus[contract] = newContract

		return newContract
	}
} 