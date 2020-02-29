import React from 'react'
import { Link } from 'react-router-dom'
import { linkInNewTabProps } from 'resources/constants/uiConstants'
import getOnGooglePlay from 'resources/images/get-on-google-play.png'
import signInSugoiNihongoNight from 'resources/images/sign-in-sugoi-nihongo-night.png'
import signInSugoiNihongoLight from 'resources/images/sign-in-sugoi-nihongo.png'
import { apacheLicence2 } from 'resources/misc/licenceTypes'
import { authSignIn } from 'resources/routing/routes'
import ThemeService from 'services/ui/themeService'
import { container } from 'tsyringe'
import './PublicAppsComponent.css'

const PublicAppsComponent: React.FC = () => {
	const {isNightMode, textColor, textColorBold} = container.resolve(ThemeService)
	
	const publicReposId = 'public-repositories'

	const apps = [{
		icon: getOnGooglePlay,
		alt: 'get-on-google-play',
		link: 'https://play.google.com/store/apps/details?id=jp.mihailskuzmins.sugoinihongoapp',
		text: 'Download the official app for Android from the Google Play',
		isInternal: false
	}, {
		icon: isNightMode ? signInSugoiNihongoNight : signInSugoiNihongoLight,
		alt: 'sign-in-sugoi-nihongo',
		link: authSignIn,
		text: 'Use the official web application',
		isInternal: true
	}]

	const publicRepos = [{
		title: 'Sugoi Nihongo for Android',
		link: 'https://github.com/MihailsKuzmins/sugoi-nihongo-android',
		licence: apacheLicence2
	}, {
		title: 'Sugoi Nihongo for Web browsers',
		link: 'https://github.com/MihailsKuzmins/sugoi-nihongo-web',
		licence: apacheLicence2
	}]

	return (
		<div className="container text-left">
			<div className="col-12">
				<h4 style={{color: textColorBold}}>Sugoi Nihongo applications</h4>
				<p style={{color: textColor}}>These applications are <b>open source</b>, i.e. the codebase of out apps is available to the public, so everyone can verify what the apps do with your devices. The code which is published in out <a href={`#${publicReposId}`}>public repositories</a> represents the same build as the apps you use.</p>
			</div>
			<div className="col-12 row">
				{
					apps.map((x, i) => {
						const img = <img src={x.icon} alt={x.alt} className="app-icon col-12"/>

						return (
							<div className="text-center col-12 col-sm-6" key={i} style={{color: textColor}}>
								{
									x.isInternal
										? (<Link to={x.link}>{img}</Link>)
										: (<a href={x.link} {...linkInNewTabProps}>{img}</a>)
								}
								<p className="mt-3">{x.text}</p>
							</div>
						)
					})
				}
			</div>
			<div id={publicReposId} className="col-12 mt-3">
				<h4 style={{color: textColorBold}}>Public repositories</h4>
				{
					publicRepos.map((x, i) => (
						<div className="public-repo-item" key={i}>
							<h5>
								<a href={x.link} {...linkInNewTabProps}>
									{x.title}
								</a>
							</h5>
							<p><span style={{color: textColor}}>Licensed under</span> <a href={x.licence.link} {...linkInNewTabProps}>{x.licence.title}</a></p>
						</div>
					))
				}
			</div>
		</div>
	)
}

export default PublicAppsComponent