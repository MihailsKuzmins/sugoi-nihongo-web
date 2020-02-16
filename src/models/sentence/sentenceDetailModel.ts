export default interface SentenceDetailModel {
	sentenceId: string,
	original: string,
	translation: string,
	transcription: string | undefined,
	dateCreated: Date
}