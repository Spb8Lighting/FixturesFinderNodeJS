function formToJSON(form) {
	let obj = {}, elements = form.querySelectorAll('input, select, textarea')
	for(let i = 0; i < elements.length; ++i) {
		let element = elements[i], type = element.type, name = element.name, value = element.value
		if(name && value && type != 'submit') {
			if(type == 'checkbox' && element.checked || type != 'checkbox') {
				obj[name] = value
			}
		}
	}
	return JSON.stringify(obj)
}
let socket = io('http://localhost:8080')
,		Results = document.getElementById('Results')
,		Form = document.getElementById('adminform')
// On Form Submit send to SocketServer
Form.addEventListener('submit', e => {
	e.preventDefault()
	let data = formToJSON(Form)
	console.log(data)
	socket.emit('action', data)
})
socket.on('TaskProgress', data => {
		// Set the receiver DIV for a given folder
			let FolderProgress = document.getElementById(data.folder)
		// If the receiver DIV doesn't exists, create it
			if(!FolderProgress) {
				Results.innerHTML = `<div id="${data.folder}">
				<h2></h2>
				<p>
					<progress value="0" max="100"></progress>
					<span></span>
				</p>
				</div>`
				FolderProgress = document.getElementById(data.folder)
			}
		// Then do the stuff
			let Advancement = FolderProgress.querySelector('progress')
			,		Percentage = FolderProgress.querySelector('span')
			,		Title = FolderProgress.querySelector('h2')
			Advancement.setAttribute('value', data.percentage)
			Percentage.innerHTML = data.percentage + '%'
			Title.innerHTML = data.description
 })
socket.on('fromServer', data => {
		 console.log(data)
 })
