import React from 'react'

const createSpinner = (color: string) => {
	return (
		<div className="spinner-border" style={{color: color}} role="status">
			<span className="sr-only">Loading...</span>
		</div> 
	)
}

export default createSpinner