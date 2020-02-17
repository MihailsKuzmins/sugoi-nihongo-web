import GlobalState from 'models/system/globalState'
import { createGlobalState } from 'react-hooks-global-state'

const initialState: GlobalState = {
	isAuthenticated: false
}

export default createGlobalState(initialState).useGlobalState