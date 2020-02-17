import Disposable from "models/system/disposable";
import { Subscription } from "rxjs";

export default class SubDisposable implements Disposable {
	private readonly mArray: Subscription[] = []

	public add(sub: Subscription) {
		this.mArray.push(sub)
	}
		
	public dispose() {
		while (this.mArray.length > 0) {
			const sub = this.mArray.pop()
			sub?.unsubscribe()
		}
	}
}