import React from 'react'

export default abstract class ComponentBase<TProps = {}, TState = {}> extends React.Component<TProps, TState> {
	private mUnsubscribe: (() => void) | undefined

	componentDidMount() {
		super.componentDidMount?.()

		this.mUnsubscribe = this.createSubscription()
	}

	componentWillUnmount() {
		this.mUnsubscribe?.()
		super.componentWillUnmount?.()
	}

	protected abstract createSubscription: () => (() => void)
}