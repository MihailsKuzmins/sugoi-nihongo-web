import { hideModal } from 'functions/uiFunctions'
import React from 'react'

function withClosingModal<TProps extends ModalProps>(WrappedComponent: React.ComponentType<TProps>) {
	return class Component extends React.Component<TProps> {
		public readonly componentWillUnmount = () => {
			hideModal(this.props.formId)
			super.componentWillUnmount?.()
		}

		public readonly render = () =>
			<WrappedComponent {...this.props} />
	}
}

export default withClosingModal

export interface ModalProps {
	formId: string
}