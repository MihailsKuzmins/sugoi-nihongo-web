export default interface WordDetailModel {
	wordId: string,
	original: string,
	translation: string,
	transcription: string | undefined,
	notes: string | undefined,
	mark: number,
	dateLastAccessed: Date | undefined,
	isFavourite: boolean,
	isStudiable: boolean,
	timesAccessed: number | undefined,
	timesCorrect: number | undefined,
	dateCreated: Date
}