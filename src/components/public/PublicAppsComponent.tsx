import React from 'react'
import getOnGooglePlay from 'resources/images/get-on-google-play.png'
import signInSugoiNihongo from 'resources/images/sign-in-sugoi-nihongo.png'
import './PublicAppsComponent.css'
import { authSignIn } from 'resources/routing/routes'
import { linkInNewTabProps } from 'resources/constants/uiConstants'
import { apacheLicence2 } from 'resources/misc/licenceTypes'

const PublicAppsComponent: React.FC = () => {
	const publicReposId = 'public-repositories'

	const apps = [{
		icon: getOnGooglePlay,
		link: 'https://play.google.com/store/apps/details?id=jp.mihailskuzmins.sugoinihongoapp',
		text: 'Download the official app for Android from the Google Play',
		props: linkInNewTabProps
	}, {
		icon: signInSugoiNihongo,
		link: authSignIn,
		text: 'Use the official web application',
		props: {}
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
				<h4>Sugoi Nihongo applications</h4>
				<p>These applications are <b>open source</b>, i.e. the codebase of out apps is available to the public, so everyone can verify what the apps do with your devices. The code which is published in out <a href={`#${publicReposId}`}>public repositories</a> represents the same build as the apps you use.</p>
			</div>
			<div className="col-12 row">
				{
					apps.map((x, i) => (
						<div className="text-center col-12 col-sm-6" key={i}>
							<a href={x.link} {...x.props}>
								<img src={x.icon} alt="get-on-google-play" className="app-icon col-12"/>
							</a>
							<p className="mt-3">{x.text}</p>
						</div>
					))
				}
			</div>
			<div id={publicReposId} className="col-12 mt-3">
				<h4>Public repositories</h4>
				{
					publicRepos.map((x, i) => (
						<div className="public-repo-item" key={i}>
							<h5>
								<a href={x.link} {...linkInNewTabProps}>
									{x.title}
								</a>
							</h5>
							<p>Licensed under <a href={x.licence.link} {...linkInNewTabProps}>{x.licence.title}</a></p>
						</div>
					))
				}
			</div>
		</div>
	)
}

export default PublicAppsComponent