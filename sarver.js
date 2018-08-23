'use strict'
let net = require('net')
let clients = []
let server = net.createServer((socket)=>{
	socket.id = socket.remoteAddress+":"+socket.remotePort
	clients.push(socket)
	//	greating(socket, (name)=>{
	//		socket.name = name
	//		clients.forEach((client)=>{
	//			if (client != socket)
	//			client.write(`${socket.name} has join to chat.`)
	//		})
	//		return
	//	})
	//	function greating (socket, cb){
	//		socket.write("Welcome in chat!\nPlease enter your name:")
	//		socket.on("data", (data)=>{
	//			return cb(data.toString().trim("\n"))
	//		})
	//		return
	//	}
	socket.on('end', ()=>{
		console.log(`${socket.id}(${socket.name}) has been disconected`)
		socket.destroy()
		clients.splice(clients.indexOf(socket), 1)
		clients.forEach((client)=>{
			client.write(`${socket.name} has left a chat.`)
		})
	})

	socket.on("data", (data)=>{
		let obj = JSON.parse(data.toString().trim())
		//		console.log(data.toString())
		//		socket.write(data.toString())
		////		if (obj.type == "name"){
		////			socket.name = obj.name
		////			console.log(socket.name)
		////		}else{
		////		broadcast(obj.msg, socket)
		////		}

		socket.name = obj.name
		broadcast(obj, socket)

		//		console.log(data.toString())
	})

	function broadcast (obj, sender){
		clients.forEach((client)=>{
			if(!obj.msg){
				client.write(`${obj.name} has join a chat`)
				console.log(`${obj.name} has join a chat`)
			}else{
				client.write(`${obj.name} : ${obj.msg}`)
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
