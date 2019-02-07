'use strict'
let net = require('net')
require('ansicolor').nice
let crypto = require('crypto')
let clients = []
let server = net.createServer((socket)=>{
	socket.id = socket.remoteAddress+":"+socket.remotePort
	socket.write("some text")
	clients.push(socket)
	socket.on('end', ()=>{
		console.log(`${socket.name} : [${socket.id}] has been disconected`)
		socket.destroy()
		clients.splice(clients.indexOf(socket), 1)
		if(socket.name){
			clients.forEach((client)=>{
				client.write(socket.name.green+" has left a chat.".bright.cyan)
			})
		}
	})
	socket.on("data", (data)=>{
		let obj = JSON.parse(data.toString().trim())
		console.log(obj)
		socket.name = obj.name
		socket.msg = obj.msg
		broadcast(obj, socket)
	})
	function broadcast (obj, sender){
		if(!obj.msg)
			console.log(`[${timeNow()}] ${obj.name} : [${socket.id}]  has join a chat`)
		if(obj.msg)
			console.log(`[${timeNow()}] ${obj.name} : ${obj.msg}`)
		clients.forEach((client)=>{
			if(!obj.msg){
				client.write(`[${timeNow()}] ${obj.name.green} has join a chat`.bright.cyan)
			}else if(client != sender){
				obj.msg = decrypt(obj.msg)
				client.write(`[${timeNow()}] ${obj.name.green} : ${obj.msg.bright.green}`)
			}
		})
	}
})
function decrypt(text){
	var decipher = crypto.createDecipher('aes-256-ctr','zhopa')
	var dec = decipher.update(text,'hex','utf8')
	dec += decipher.final('utf8')
	return dec
}
function timeNow(){
	var d = new Date()
	var m = d.getMinutes()
	var h = d.getHours()
	return h+":"+m
}
process.stdin.on('data', (data)=>{
	let count = clients.length
	if (data.toString().trim("\n") == "count"){
		console.log(count.toString())	
	}
})
if(process.argv.length < 3){
	console.error('please add port as argument'.bright.red)
	process.exit()
}
server.listen(process.argv[2], '0.0.0.0', (err)=>{
	if (err) throw err
	console.log("server listening on port: "+process.argv[2].bright.green)
})
