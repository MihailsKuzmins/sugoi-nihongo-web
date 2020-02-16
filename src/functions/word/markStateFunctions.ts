import { nonStudiableMark, maxMark, markExcellent, markGood, markAverage, minMark } from 'resources/constants/wordConstants'
import { MarkState } from 'resources/word/markState'

export const getMarkState = (mark: number) => {
	if (mark === nonStudiableMark)
		return MarkState.Excluded
	else if (mark >= markExcellent && mark <= maxMark)
		return MarkState.Excellent
	else if (mark >= markGood && mark < markExcellent)
		return MarkState.Good
	else if (mark >= markAverage && mark < markGood)
		return MarkState.Average
	else if (mark >= minMark && mark < markAverage)
		return MarkState.Bad
	else
		throw new Error(`Mark state is not know for: ${mark}`)
}