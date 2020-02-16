import { Item } from 'components/system/items/ItemComponentBase'

export default interface FirestoreToItemModel {
	firestoreField: string,
	item: Item
}