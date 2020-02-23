import React from 'react'
import { darkMode, lightMode } from 'resources/constants/uiConstants'

const createSpinner = (isNightMode: boolean) => {
	const mode = isNightMode ? lightMode : darkMode

	return (
		<div className={`spinner-border text-${mode}`} role="status">
			<span className="sr-only">Loading...</span>
		</div> 
	)
}

export default createSpinner