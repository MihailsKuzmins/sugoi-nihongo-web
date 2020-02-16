import Disposable from 'models/system/disposable'

export default class CompositeDisposable implements Disposable {
	private readonly mArray: Disposable[] = []

	public add(disposable: Disposable) {
		this.mArray.push(disposable)
	}

	public dispose() {
		while (this.mArray.length > 0) {
			const disposable = this.mArray.pop()
			disposable?.dispose()
		}
	}
}