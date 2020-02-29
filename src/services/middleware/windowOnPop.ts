import { singleton } from 'tsyringe'

@singleton()
export default class WindowOnPop {
	private mFuncs: Registration[] = []

	public register(key: string, func: () => void) {
		if (this.mFuncs.some(x => x.key === key)) {
			throw new Error(`The same key "${key}" already present`)
		}

		this.mFuncs.push({key: key, func: func})
	}

	public unregister(key: string) {
		this.mFuncs = this.mFuncs
			.filter(x => x.key !== key)
	}

	public run() {
		for (let i = 0; i < this.mFuncs.length; i++)
			this.mFuncs[i].func()
	}
}

interface Registration {
	key: string,
	func: () => void
}