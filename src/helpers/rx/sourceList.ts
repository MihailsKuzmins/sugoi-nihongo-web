import { Subject } from 'rxjs'
import { map, startWith } from 'rxjs/operators'

export default class SourceList<T> {
	private readonly mArray: T[] = []
	private readonly mCollectionChangedSubject = new Subject<void>()

	public readonly collectionChanged = this.mCollectionChangedSubject
		.asObservable()
		.pipe(
			map(_ => this.mArray),
			startWith(this.mArray)
		)

	add(item: T) {
		this.mArray.push(item)
		this.invokeNext()
	}

	addMany(...items: T[]) {
		this.mArray.push(...items)
		this.invokeNext()
	}

	private readonly invokeNext = () =>
		this.mCollectionChangedSubject.next(undefined)
}