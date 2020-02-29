import React from 'react'
import ThemeService from 'services/ui/themeService'
import { container } from 'tsyringe'
import './PublicHomepageComponent.css'

const PublicHomepageComponent: React.FC = () => {
	const {textColor, textColorBold, backgroundColor, backgroundColorDark, inputBackgroundColorDisabled} = container.resolve(ThemeService)

	const cards = [
		{title: 'Words', body: 'Save all the Japanese words you have learned in your native language with kanji and kana transcription'},
		{title: 'Sentences', body: 'Do not forget interesting sentences and expressions you have encountered'},
		{title: 'Grammar rules', body: 'Write down important grammar rules to know how to use the learned words in practice'},
	]

	return (
		<div className="container">
			<div className="jumbotron jumbotron-fluid mt-2" style={{backgroundColor: inputBackgroundColorDisabled}}>
				<div className="container">
					<h1 className="display-4" style={{color: textColorBold}}>Sugoi Nihongo</h1>
					<p className="lead" style={{color: textColor}}>Make notes of learning the cool Japanese language</p>
				</div>
			</div>
			<div className="text-left" style={{color: textColor}}>
				<p>こんいちは。</p>
				<p>"Sugoi Nihongo" tries to help you memorise specific words which you encounter while studying Japanese, so you are not bothered with some predefined, startup words which you might already know and do not care about any more. But the app requires you to study on your own as it is only a container of your specific knowledge.</p>
				<p>Not only can you store words, but also interesting sentences and grammar rules which are though to keep in mind all the time.</p>
				<p>Enhance your Japanese knowledge with word quizzes (from your native language to Japanese and vice versa) and grammar exercises and keep practising.</p>
				<p>I wish you good luck in mastering Japanese.</p>
			</div>
			<hr style={{borderTopColor: textColor}} />
			<div className="flexbox">
				{
					cards.map((x, i) => (
						<div className="card flex-item" key={i} style={{backgroundColor: backgroundColorDark, borderColor: textColor}}>
							<div className="card-header" style={{color: textColorBold}}>
								{x.title}
							</div>
							<div className="card-body" style={{backgroundColor: backgroundColor, color: textColor}}>
								<p className="card-text">{x.body}</p>
							</div>
						</div>
					))
				}
			</div>
		</div>
	)
}

export default PublicHomepageComponent