'use strict'
let net = require('net')
let clients = []
let server = net.createServer((socket)=>{
	socket.id = socket.remoteAddress+":"+socket.remotePort
	clients.push(socket)
	greating(socket)
	function greating (socket){
		socket.write("Welcome in chat!\nPlease enter your name:")
		return ()=>{
			socket.on("data", (data)=>{
				socket.name = data.toString().trim("\n")
				broadcast(`${socket.name} has joined to chat!`, socket)
			})
		}
	}
	socket.on('end', ()=>{
		console.log(`${socket.id} has been disconected`)
		socket.destroy()
		clients.splice(clients.indexOf(socket), 1)
	})
	socket.on("data", (data)=>{
		console.log(data.toString())
		socket.write(data.toString())
	})
	function broadcast (msg, sender){
		clients.forEach((client)=>{
			if (client != sender){
				client.write(client.name+">"+msg)
			}else{
				sender.write("me>"+msg)
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
