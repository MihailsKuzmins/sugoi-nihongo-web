import { MandatoryProps, CollectionReference } from 'resources/types'
import { LooseObject } from 'models/system/looseObject'

export default abstract class DataSaverBase implements DataSaver {
	private readonly mPropertyNames: string[]

	public constructor(protected readonly data: LooseObject) {
		this.mPropertyNames = Object.getOwnPropertyNames(data)
	}

	protected get propertyNames() { return this.mPropertyNames }

	public readonly checkData = (mandatoryProps: MandatoryProps) =>
		mandatoryProps && mandatoryProps.length > 0
			? this.checkDataInternal(mandatoryProps)
			: true

	public abstract saveDataAsync: (collectionRef: CollectionReference) => Promise<string>
	protected abstract checkDataInternal: (mandatoryProps: MandatoryProps) => boolean
}

interface DataSaver {
	checkData(mandatoryProps: MandatoryProps): boolean
	saveDataAsync(collectionRef: CollectionReference): Promise<string>
}