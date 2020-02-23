import React from 'react'
import useGlobalState from 'helpers/useGlobalState'

function withNightMode<TProps>(WrappedComponent: React.ComponentType<TProps & NightModeProps>) {
	return (props: TProps) => {
		const [isNightMode,] = useGlobalState('isNightMode')

		return <WrappedComponent {...props} isNightMode={isNightMode} />
	}
}

export default withNightMode

export interface NightModeProps {
	isNightMode: boolean
}