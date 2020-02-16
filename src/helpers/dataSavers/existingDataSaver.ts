import DataSaverBase from 'helpers/dataSavers/dataSaverBase'
import { CollectionReference, MandatoryProps } from 'resources/types'
import { LooseObject } from 'models/system/looseObject'

export default class ExistingDataSaver extends DataSaverBase {
	constructor(data: LooseObject, private readonly mDocumentId: string) {
		super(data)
		
	}

	public readonly saveDataAsync = async (collectionRef: CollectionReference) => {
		await collectionRef.doc(this.mDocumentId).update(this.data)
		return this.mDocumentId
	}

	protected readonly checkDataInternal = (mandatoryProps: MandatoryProps) =>
		this.propertyNames
			.filter(x => mandatoryProps.includes(x))
			.every(x => this.data[x].constructor['name'] !== 'DeleteFieldValueImpl')
}