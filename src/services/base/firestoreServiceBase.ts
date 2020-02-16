import firebase from 'firebase/app'
import 'firebase/firestore'
import { QueryFunc, SnapshotsFunc, SnapshotFunc, Timestamp, MandatoryProps } from 'resources/types'
import { defaultDate, defaultBool, defaultNumber } from 'resources/constants/firestoreConstants'
import { LooseObject } from 'models/system/looseObject'
import NewDataSaver from 'helpers/dataSavers/newDataSaver'
import ExistingDataSaver from 'helpers/dataSavers/existingDataSaver'

export default abstract class FirestoreServiceBase {
	private static get database() { return firebase.firestore() }

	protected static readonly subscribeToCollection = (collection: string, queryFunc: QueryFunc, snapshotsFunc: SnapshotsFunc) =>
		FirestoreServiceBase.createCollectionQuery(collection, queryFunc)
			.onSnapshot(x => snapshotsFunc(x.docs), _ => snapshotsFunc([]))

	protected static readonly subscribeToDetail = (collection: string, documentId: string, snapshotFunc: SnapshotFunc) =>
		FirestoreServiceBase.database.collection(collection)
			.doc(documentId)
			.onSnapshot(x => snapshotFunc(x), _ => snapshotFunc(undefined))

	protected static readonly getCollectionAsync = async (collection: string, queryFunc: QueryFunc) => {
		const querySnapshot = await FirestoreServiceBase.createCollectionQuery(collection, queryFunc)
			.get()
		
		return querySnapshot.docs
	}

	protected static readonly saveDetailAsync = async (collection: string, documentId: string | undefined, data: LooseObject, mandatpryProps: MandatoryProps) => {
		const isNewEntry = documentId === undefined
		const saveData = FirestoreServiceBase.cleanSaveData(data, isNewEntry, mandatpryProps)

		if (Object.keys(saveData).length === 0)
			return

		const dataSaver = isNewEntry
			? new NewDataSaver(saveData)
			: new ExistingDataSaver(saveData, documentId!)

		if (!dataSaver.checkData(mandatpryProps))
			throw new Error(`Save data check failed: ${dataSaver.constructor['name']}`)

		const collectionRef = FirestoreServiceBase.database.collection(collection)
		return await dataSaver.saveDataAsync(collectionRef)
	}

	protected static readonly getDateOrUndefined = (dateAny: any | undefined) => {
		if (!dateAny)
			return undefined

		const date = (dateAny as Timestamp).toDate()
		return date.getMilliseconds() === defaultDate.getMilliseconds()
			? undefined
			: date
	}

	private static readonly createCollectionQuery = (collection: string, queryFunc: QueryFunc) => {
		const collectionRef = FirestoreServiceBase.database.collection(collection)
		return queryFunc?.(collectionRef) ?? collectionRef
	}

	private static readonly cleanSaveData = (saveData: LooseObject, isNewEntry: boolean, mandatpryProps: MandatoryProps) => {
		const deleteValue = isNewEntry
			? undefined
			: firebase.firestore.FieldValue.delete()

		const mapValue = (value: any) => {
			switch (typeof value) {
				case typeof '':
					return getStringValue(value)
				case typeof defaultBool:
					return getValue(value, defaultBool)
				case typeof defaultNumber:
					return getValue(value, defaultNumber)
				case typeof defaultDate:
					return getValue((value as Date).getMilliseconds(), defaultDate.getMilliseconds())
				default:
					return getValue(value, undefined)
			}
		}

		const getStringValue = (value: string) => {
			const trimmedValue = value.trim()

			return trimmedValue.length > 0
				? trimmedValue
				: deleteValue
		}

		const getValue = <T>(value: T, defaultValue: T) => 
			value !== defaultValue
				? value
				: deleteValue

		const object: LooseObject = {}

		// that complicated, because we need to include possible empty props for deletion and empty mandatory props
		// I use map() before filter() because we would still need to evaluate values in filter, in this case values
		// are computed only once
		Object.getOwnPropertyNames(saveData)
			.map(x => {
				const value = saveData[x]

				if (mandatpryProps.includes(x)) {
					const val = value instanceof String
						? value.trim()
						: value
					
					return [x, val] as const
				}
				
				const val = mapValue(value)
				return [x, val] as const
			}).filter(x => mandatpryProps.includes(x[0]) || x[1] !== undefined)
			.forEach(x => object[x[0]] = x[1])

		return object
	}
}