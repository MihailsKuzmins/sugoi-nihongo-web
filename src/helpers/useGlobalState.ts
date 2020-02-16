import { createGlobalState } from 'react-hooks-global-state'
import GlobalState from 'models/system/globalState'

const initialState: GlobalState = {
	isAuthenticated: false
}

export default createGlobalState(initialState).useGlobalState