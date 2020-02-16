export default interface WordListModel {
	wordId: string,
	original: string,
	translation: string,
	transcription: string | undefined,
	mark: number
}