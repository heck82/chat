'use strict'
let net = require('net')
require('ansicolor').nice
let clients = []
let server = net.createServer((socket)=>{
	socket.id = socket.remoteAddress+":"+socket.remotePort
	clients.push(socket)
	socket.on('end', ()=>{
		console.log(`${socket.name} has been disconected`)
		socket.destroy()
		clients.splice(clients.indexOf(socket), 1)
		clients.forEach((client)=>{
			client.write(socket.name.green+" has left a chat.".bright.cyan)
		})
	})
	socket.on("data", (data)=>{
		let obj = JSON.parse(data.toString().trim())
		socket.name = obj.name
		broadcast(obj, socket)
	})
	function broadcast (obj, sender){
		clients.forEach((client)=>{
			if(!obj.msg){
				client.write(`${obj.name.green} has join a chat`.bright.cyan)
				console.log(`${obj.name} has join a chat`)
			}else if(client != sender){
				client.write(`${obj.name.green} : ${obj.msg.bright.green}`)
				console.log(`${obj.name} : ${obj.msg}`)
			}
		})
	}
})
process.stdin.on('data', (data)=>{
	let count = clients.length
	if (data.toString().trim("\n") == "count"){
		console.log(count.toString())	
	}
})
server.listen(3000, (err)=>{
	if (err) throw err
	console.log("server listening on port 3000")
})
