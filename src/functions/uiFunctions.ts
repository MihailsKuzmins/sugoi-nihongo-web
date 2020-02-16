import $ from 'jquery'

export const setModalNonCancellable = (id: string) => {
	$(`#${id}`).modal({
		keyboard: false,
		backdrop: 'static',
		show: false
	})
}

export const hideModal = (id: string) => {
	$(`#${id}`).modal('hide')
}

export const showModal = (id: string) => {
	$(`#${id}`).modal('show')
}