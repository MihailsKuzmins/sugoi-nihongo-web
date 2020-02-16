import { singleton } from 'tsyringe'
import FirestoreServiceBase from './base/firestoreServiceBase';
import { GrammarRulesFunc, GrammarRuleFunc, CollectionReference, Timestamp } from 'resources/types';
import { grammarRulesCollection, grammarRuleDateCreated, grammarRuleHeader, grammarRuleBody } from 'resources/constants/firestoreConstants';
import GrammarRuleListModel from 'models/grammarRule/grammarRuleListModel';
import GrammarRuleDetailModel from 'models/grammarRule/grammarRuleDetailModel';
import { LooseObject } from 'models/system/looseObject';

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
			data[grammarRuleDateCreated] = new Date()
		}

		await FirestoreServiceBase.saveDetailAsync(grammarRulesCollection, grammarRuleId, data, this.mGrammarRuleMandatoryProps)
	}
}