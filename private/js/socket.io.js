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
	// Block form submit
		e.preventDefault()
	// Empty Results firstly
		Results.innerHTML = ''
	// Get All form data into JSON
		let data = formToJSON(Form)
	// Send data to socket server
		socket.emit('action', data)
})
socket.on('TaskProgress', data => {
		// Set the receiver DIV for a given folder
			let FolderProgress = document.getElementById(data.folder)
		// If the receiver DIV doesn't exists, create it
			if(!FolderProgress) {
				let Container = document.createElement('div')
				Container.setAttribute('id', data.folder)
				Container.setAttribute('class', 'ingestion')
				Container.innerHTML = `<h2></h2>
				<h3>FileSystem</h3>
				<div class="FileSystem">
					<p></p>
					<p>
						<progress value="0" max="100"></progress>
						<span></span>
					</p>
				</div>
				<h3>Accessories</h3>
				<div class="Accessories">
					<p></p>
					<p>
						<progress value="0" max="100"></progress>
						<span></span>
					</p>
				</div>
				<h3>Charts</h3>
				<div class="Charts">
					<p></p>
					<p>
						<progress value="0" max="100"></progress>
						<span></span>
					</p>
				</div>`
				Results.appendChild(Container)
				FolderProgress = document.getElementById(data.folder)
			}
		// Then do the stuff
		if(data.Type != 'Init') {
			let Advancement = FolderProgress.querySelector('.' + data.Type + ' progress')
			,		Percentage = FolderProgress.querySelector('.' + data.Type + ' span')
			,		Title = FolderProgress.querySelector('.' + data.Type + ' p:first-child')
			Advancement.setAttribute('value', data.percentage)
			Percentage.innerHTML = data.percentage + '%'
			Title.innerHTML = data.description
		} else {
			FolderProgress.querySelector('h2').innerHTML = data.description
		}
 })
socket.on('fromServer', data => {
		 console.log(data)
 })
