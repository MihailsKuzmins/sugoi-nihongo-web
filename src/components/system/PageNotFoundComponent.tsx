import useGlobalState from 'helpers/useGlobalState'
import React from 'react'
import pageNotFoundNight from 'resources/images/404-night.jpg'
import pageNotFound from 'resources/images/404.jpg'
import { lightTextColor, nightTextColor } from 'resources/ui/colors'
import './PageNotFoundComponent.css'

const PageNotFoundComponent: React.FC = () => {
	const [isNightMode,] = useGlobalState('isNightMode')
	
	const nightOpts: ModeOpts = isNightMode
		? {image: pageNotFoundNight, textColor: nightTextColor}
		: {image: pageNotFound, textColor: lightTextColor}

	return (
		<div className="container mt-2">
			<img src={nightOpts.image} alt="404" className="image-404 mx-auto mb-4" />
			<h5 style={{color: nightOpts.textColor}}>Page is not found</h5>
		</div>
	)
}

export default PageNotFoundComponent

interface ModeOpts {
	image: string,
	textColor: string
}