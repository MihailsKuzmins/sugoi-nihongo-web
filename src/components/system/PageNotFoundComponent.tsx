import React from 'react'
import pageNotFoundNight from 'resources/images/404-night.jpg'
import pageNotFound from 'resources/images/404.jpg'
import ThemeService from 'services/ui/themeService'
import { container } from 'tsyringe'
import './PageNotFoundComponent.css'

const PageNotFoundComponent: React.FC = () => {
	const {textColor, isNightMode} = container.resolve(ThemeService)
	const image = isNightMode ? pageNotFoundNight : pageNotFound
	
	return (
		<div className="container mt-2">
			<img src={image} alt="404" className="image-404 mx-auto mb-4" />
			<h5 style={{color: textColor}}>Page is not found</h5>
		</div>
	)
}

export default PageNotFoundComponent