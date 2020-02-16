import WordListModel from "models/word/wordListModel"
import SentenceListModel from "models/sentence/sentenceListModel"
import GrammarRuleListModel from "models/grammarRule/grammarRuleListModel"
import GrammarRuleDetailModel from "models/grammarRule/grammarRuleDetailModel"
import SentenceDetailModel from "models/sentence/sentenceDetailModel"
import WordDetailModel from "models/word/wordDetailModel"

export type RecaptchaVerifier = firebase.auth.RecaptchaVerifier

// Firestore
export type Timestamp = firebase.firestore.Timestamp
export type CollectionReference = firebase.firestore.CollectionReference
export type Query = firebase.firestore.Query
export type QuerySnapshot = firebase.firestore.QueryDocumentSnapshot
export type DocumentSnapshot = firebase.firestore.DocumentSnapshot
export type QueryFunc = ((collectionRef: CollectionReference) => Query) | undefined
export type SnapshotsFunc = (snapshots: QuerySnapshot[]) => void
export type SnapshotFunc = (snapshot: DocumentSnapshot | undefined) => void

// System
export type MandatoryProps = string[]

// Word
export type WordsFunc = (words: WordListModel[]) => void
export type WordFunc = (word: WordDetailModel | undefined) => void

// Sentences
export type SentencesFunc = (sentences: SentenceListModel[]) => void
export type SentenceFunc = (sentence: SentenceDetailModel | undefined) => void

// Grammar rules
export type GrammarRulesFunc = (grammarRules: GrammarRuleListModel[]) => void
export type GrammarRuleFunc = (grammarRule: GrammarRuleDetailModel | undefined) => void