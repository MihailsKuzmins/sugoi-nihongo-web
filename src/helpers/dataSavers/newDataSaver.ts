import DataSaverBase from 'helpers/dataSavers/dataSaverBase'
import { CollectionReference, MandatoryProps } from 'resources/types'

export default class NewDataSaver extends DataSaverBase {
	public readonly saveDataAsync = async (collectionRef: CollectionReference) => {
		const documentRef = collectionRef.doc()
		await documentRef.set(this.data)

		return documentRef.id
	}

	protected readonly checkDataInternal = (mandatoryProps: MandatoryProps) =>
		mandatoryProps.every(x => this.propertyNames.includes(x))
}