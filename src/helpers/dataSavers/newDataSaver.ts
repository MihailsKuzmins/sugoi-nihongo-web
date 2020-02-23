import DataSaverBase from 'helpers/dataSavers/dataSaverBase'
import { LooseObject } from 'models/system/looseObject'
import { documentUserId } from 'resources/constants/firestoreConstants'
import { CollectionReference, MandatoryProps } from 'resources/types'

export default class NewDataSaver extends DataSaverBase {
	constructor(data: LooseObject, private readonly mUserId: string) {
		super(data)
	}

	public readonly saveDataAsync = async (collectionRef: CollectionReference) => {
		if (!this.data.hasOwnProperty(documentUserId))
			this.data[documentUserId] = this.mUserId

		const documentRef = collectionRef.doc()
		await documentRef.set(this.data)

		return documentRef.id
	}

	protected readonly checkDataInternal = (mandatoryProps: MandatoryProps) =>
		mandatoryProps.every(x => this.propertyNames.includes(x))
}