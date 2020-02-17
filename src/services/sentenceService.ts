import { today } from 'functions/systemTypes/dateFunctions'
import SentenceDetailModel from 'models/sentence/sentenceDetailModel'
import SentenceListModel from 'models/sentence/sentenceListModel'
import { LooseObject } from 'models/system/looseObject'
import { sentenceDateCreated, sentenceOriginal, sentencesCollection, sentenceTranscription, sentenceTranslation } from 'resources/constants/firestoreConstants'
import { CollectionReference, SentenceFunc, SentencesFunc, Timestamp } from 'resources/types'
import FirestoreServiceBase from 'services/base/firestoreServiceBase'
import { singleton } from 'tsyringe'

@singleton()
export default class SentenceService extends FirestoreServiceBase {
	private readonly mSentenceMandatoryProps = [sentenceOriginal, sentenceTranslation, sentenceDateCreated]

	public readonly getListSubscription = (limit: number, sentencesFunc: SentencesFunc) => {
		const queryFunc = (x: CollectionReference) => x
			.orderBy(sentenceDateCreated, 'desc')
			.orderBy(sentenceOriginal, 'asc')
			.limit(limit)

		return FirestoreServiceBase.subscribeToCollection(sentencesCollection, queryFunc, docs => {
			const sentences = docs
				.map<SentenceListModel>(x => ({
					sentenceId: x.id,
					original: x.get(sentenceOriginal),
					translation: x.get(sentenceTranslation)
				}))

			sentencesFunc(sentences)
		})
	}

	public readonly getDetailSubscription = (sentenceId: string, sentenceFunc: SentenceFunc) =>
		FirestoreServiceBase.subscribeToDetail(sentencesCollection, sentenceId, doc => {
			const sentence = doc && doc.get(sentenceOriginal)
				? {
					sentenceId: doc.id,
					original: doc.get(sentenceOriginal),
					translation: doc.get(sentenceTranslation),
					transcription: doc.get(sentenceTranscription),
					dateCreated: (doc.get(sentenceDateCreated) as Timestamp).toDate()
				}
				: {}

			sentenceFunc(sentence as SentenceDetailModel)
		})

	public readonly saveDetailAsync = async (sentenceId: string | undefined, data: LooseObject) => {
		if (!sentenceId) {
			data[sentenceDateCreated] = today()
		}

		await FirestoreServiceBase.saveDetailAsync(sentencesCollection, sentenceId, data, this.mSentenceMandatoryProps)
	}
}