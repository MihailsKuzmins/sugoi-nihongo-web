import FirestoreToItemModel from "models/system/firestoreFieldToItemModel"
import { LooseObject } from "models/system/looseObject"

export const createSaveData = (saveFields: FirestoreToItemModel[]) => {
	const object: LooseObject = {}

	saveFields
		.filter(x => x.item.isValueChanged || x.item.isDisabled)
		.forEach(x => {
			const value = x.item.isDisabled
				? undefined
				: x.item.valueAny
			
			object[x.firestoreField] = value
		})

	return object
}