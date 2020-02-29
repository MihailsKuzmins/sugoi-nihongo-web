import { singleton } from 'tsyringe'

@singleton()
export default class ThemeService {
	private mIsNightMode: boolean = false
	private mColors: Colors = dayModeColors

	public get isNightMode() { return this.mIsNightMode }
	public set isNightMode(isNightMode: boolean) { 
		if (this.mIsNightMode === isNightMode)
			return
		
		this.mIsNightMode = isNightMode
		this.mColors = isNightMode ? nightModeColors : dayModeColors
	}

	public get mode() { return this.mColors.mode }
	public get backgroundColor() { return this.mColors.backgroundColor }
	public get backgroundColorDark() { return this.mColors.backgroundColorDark }
	public get textColor() { return this.mColors.textColor }
	public get textColorBold() { return this.mColors.textColorBold }
	public get inputBackgroundColorDisabled() { return this.mColors.inputBackgroundColorDisabled }
	public get colorBad() { return this.mColors.colorBad }
	public get colorGood() { return this.mColors.colorGood }
}

const dayModeColors: Colors = {
	mode: 'day',
	backgroundColor: '#ffffff',
	backgroundColorDark: '#f8f9fa',
	textColor: '#4a4a4a',
	textColorBold: '#000000',
	inputBackgroundColorDisabled: '#e8ecef',
	colorBad: '#ff4242',
	colorGood: '#32a848'
}

const nightModeColors: Colors = {
	mode: 'night',
	backgroundColor: '#303030',
	backgroundColorDark: '#262626',
	textColor: '#c1c1c1',
	textColorBold: '#ffffff',
	inputBackgroundColorDisabled: '#3d3b3b',
	colorBad: '#ff4242',
	colorGood: '#32a848'
}

interface Colors {
	mode: string,
	backgroundColor: string,
	backgroundColorDark: string,
	textColor: string,
	textColorBold: string,
	inputBackgroundColorDisabled: string,
	colorBad: string,
	colorGood: string
}