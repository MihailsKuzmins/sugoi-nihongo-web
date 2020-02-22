import React from 'react'
import pageNotFound from 'resources/images/404.jpg'
import './PageNotFoundComponent.css'

const PageNotFoundComponent: React.FC = () => (
	<div className="container">
		<img src={pageNotFound} alt="404" className="image-404 mx-auto mb-4" />
		<h5>Page is not found</h5>
	</div>
)

export default PageNotFoundComponent