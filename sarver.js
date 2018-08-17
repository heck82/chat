'use strict'
let net = require('net')
let clients = []
let server = net.createServer((socket)=>{
	socket.id = socket.remoteAddress+":"+socket.remotePort
	clients.push(socket)
	greating(socket, (name)=>{
		socket.name = name
		clients.forEach((client)=>{
			if (client != socket)
			client.write(`${socket.name} has join to chat.`)
		})
		return
	})
	function greating (socket, cb){
		socket.write("Welcome in chat!\nPlease enter your name:")
		socket.on("data", (data)=>{
			return cb(data.toString().trim("\n"))
		})
	}
	socket.on('end', ()=>{
		console.log(`${socket.id}(${socket.name}) has been disconected`)
		socket.destroy()
		clients.splice(clients.indexOf(socket), 1)
		clients.forEach((client)=>{
			client.write(`${socket.name} has left a chat.`)
		})
	})
//	socket.on("data", (data)=>{
//		console.log(data.toString())
//		socket.write(data.toString())
//	})
	function broadcast (msg, sender){
		clients.forEach((client)=>{
			if (client != sender){
				client.write(sender.name+" :> "+msg)
			}else{
				sender.write("me :> "+msg)
			}
		})
		console.log(msg)
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
