import { today } from 'functions/systemTypes/dateFunctions'
import GrammarRuleDetailModel from 'models/grammarRule/grammarRuleDetailModel'
import GrammarRuleListModel from 'models/grammarRule/grammarRuleListModel'
import { LooseObject } from 'models/system/looseObject'
import { grammarRuleBody, grammarRuleDateCreated, grammarRuleHeader, grammarRulesCollection } from 'resources/constants/firestoreConstants'
import { CollectionReference, GrammarRuleFunc, GrammarRulesFunc, Timestamp } from 'resources/types'
import FirestoreServiceBase from 'services/base/firestoreServiceBase'
import { singleton } from 'tsyringe'

@singleton()
export default class GrammarRuleService extends FirestoreServiceBase {
	private readonly mGrammarRuleMandatoryProps = [grammarRuleDateCreated, grammarRuleBody, grammarRuleHeader]

	public readonly getListSubscription = (limit: number, grammarRulesFunc: GrammarRulesFunc) => {
		const queryFunc = (x: CollectionReference) => x
			.orderBy(grammarRuleDateCreated, 'desc')
			.orderBy(grammarRuleHeader, 'asc')
			.limit(limit)

		return FirestoreServiceBase.subscribeToCollection(grammarRulesCollection, queryFunc, docs => {
			const grammarRules = docs
				.map<GrammarRuleListModel>(x => ({
					grammarRuleId: x.id,
					header: x.get(grammarRuleHeader),
					body: x.get(grammarRuleBody)
				}))

			grammarRulesFunc(grammarRules)
		})
	}

	public readonly getDetailSubscription = (grammarRuleId: string, grammarRuleFunc: GrammarRuleFunc) =>
		FirestoreServiceBase.subscribeToDetail(grammarRulesCollection, grammarRuleId, doc => {
			const grammarRule = doc && doc.get(grammarRuleHeader)
				? {
					grammarRuleId: doc.id,
					header: doc.get(grammarRuleHeader),
					body: doc.get(grammarRuleBody),
					dateCreated: (doc.get(grammarRuleDateCreated) as Timestamp).toDate()
				}
				: {}

			grammarRuleFunc(grammarRule as GrammarRuleDetailModel)
		})

	public readonly saveDocumentAsync = async (grammarRuleId: string | undefined, data: LooseObject) => {
		if (!grammarRuleId) {
			data[grammarRuleDateCreated] = today()
		}

		await FirestoreServiceBase.saveDetailAsync(grammarRulesCollection, grammarRuleId, data, this.mGrammarRuleMandatoryProps)
	}
}