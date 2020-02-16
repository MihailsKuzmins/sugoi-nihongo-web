import { singleton } from 'tsyringe'
import FirestoreServiceBase from 'services/base/firestoreServiceBase'
import { CollectionReference, WordsFunc, WordFunc, Timestamp } from 'resources/types'
import { wordsCollection, wordDateCreated, wordOriginal, wordTranslation, wordTranscription, wordMark, wordNotes, wordDateLastAccessed, wordIsFavourite, wordIsStudiable, wordTimesAccessed, wordTimesCorrect, defaultBool, defaultDate } from 'resources/constants/firestoreConstants'
import WordListModel from 'models/word/wordListModel'
import WordDetailModel from 'models/word/wordDetailModel'
import { LooseObject } from 'models/system/looseObject'
import { minMark, nonStudiableMark } from 'resources/constants/wordConstants'
import FirestoreConstraintError from 'resources/errors/firestoreConstraintError'

@singleton()
export default class WordService extends FirestoreServiceBase {
	private readonly mWordMandatoryProps = [wordOriginal, wordTranslation, wordDateCreated, wordDateLastAccessed, wordIsStudiable, wordMark]

	public readonly getListSubscription = (limit: number, wordsFunc: WordsFunc) => {
		const queryFunc = (x: CollectionReference) => x
			.orderBy(wordDateCreated, 'desc')
			.orderBy(wordOriginal, 'asc')
			.limit(limit)

		return FirestoreServiceBase.subscribeToCollection(wordsCollection, queryFunc, docs => {
			const words = docs
				.map<WordListModel>(x => ({
					wordId: x.id,
					original: x.get(wordOriginal),
					translation: x.get(wordTranslation),
					transcription: x.get(wordTranscription),
					mark: x.get(wordIsStudiable) ? x.get(wordMark) : nonStudiableMark
				}))

			wordsFunc(words)
		})
	}

	public readonly getDetailSubscription = (wordId: string, wordFunc: WordFunc) =>
		FirestoreServiceBase.subscribeToDetail(wordsCollection, wordId, doc => {
			const word = doc && doc.get(wordOriginal)
				? {
					wordId: doc.id,
					original: doc.get(wordOriginal),
					translation: doc.get(wordTranslation),
					transcription: doc.get(wordTranscription),
					mark: doc.get(wordMark),
					notes: doc.get(wordNotes),
					dateLastAccessed: FirestoreServiceBase.getDateOrUndefined(doc.get(wordDateLastAccessed)),
					isFavourite: doc.get(wordIsFavourite) ?? defaultBool,
					isStudiable: doc.get(wordIsStudiable),
					timesAccessed: doc.get(wordTimesAccessed),
					timesCorrect: doc.get(wordTimesCorrect),
					dateCreated: (doc.get(wordDateCreated) as Timestamp).toDate()
				}
				: {}

			wordFunc(word as WordDetailModel)
		})

	public readonly saveDocumentAsync = async (wordId: string | undefined, data: LooseObject) => {
		const saveAsync = async () => {
			if (!wordId) {
				data[wordDateCreated] = new Date()
				data[wordDateLastAccessed] = defaultDate
				data[wordIsStudiable] = true
				data[wordMark] = minMark
			}

			await FirestoreServiceBase.saveDetailAsync(wordsCollection, wordId, data, this.mWordMandatoryProps)
		}

		if (data.hasOwnProperty(wordOriginal)) {
			const checkQuery = (x: CollectionReference) => x
				.where(wordOriginal, '==', data[wordOriginal])
				.limit(1)

			const constraintWords = await FirestoreServiceBase.getCollectionAsync(wordsCollection, checkQuery)

			if (constraintWords.length > 0)
				throw new FirestoreConstraintError(data[wordOriginal], wordOriginal, wordsCollection)
		}

		await saveAsync()
	}
}