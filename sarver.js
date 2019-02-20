'use strict'
let net = require('net')
require('ansicolor').nice
let crypto = require('crypto')
let clients = []
let server = net.createServer()
server.on('connection',function(socket){
	socket.id = socket.remoteAddress+":"+socket.remotePort
	console.log(`[${timeNow()}] ${socket.id} is connected`)
	let obj = {}
	socket.write("online".green+": "+`${clients.length}`.lightCyan+" ( "+listName().bright.yellow+" )")
	socket.on('end', ()=>{
		if(socket.name){
			clients.splice(clients.indexOf(socket), 1)
			clients.forEach((client)=>{
				obj.type = "left"
				client.write(JSON.stringify(obj))
			})
		}
		console.log(`${socket.name} : [${socket.id}] has been disconected`)
		socket.destroy()
	})
	socket.on("data", (data)=>{
		try{
			obj = JSON.parse(data.toString().trim())
		}catch(err){
			if(err){
				socket.write(`go away\n`)
				console.log(`[${timeNow()}] ${socket.id} connection denied`)
				socket.destroy()
				return
			}
		}
		console.log(obj)
		socket.name = obj.name
		obj.time = timeNow()
		if(!obj.msg)
			clients.push(socket)
		socket.msg = obj.msg
		broadcast(obj, socket)
	})
	function listName (){
		let list = []
		clients.forEach((client)=>{
			list.push(client.name)
		})
		return list.join(" , ")
	}
	function broadcast (obj, sender){
		if(!obj.msg)
			console.log(`[${timeNow()}] ${obj.name} : [${socket.id}]  has join a chat`)
		if(obj.msg)
			console.log(`[${timeNow()}] ${obj.name} : ${obj.msg}`)
		clients.forEach((client)=>{
			if(client != sender){
				client.write(JSON.stringify(obj))
			}
		})
	}
})
function decrypt(text){
	let decipher = crypto.createDecipher('aes-256-ctr','zhopa')
	let dec = decipher.update(text,'hex','utf8')
	dec += decipher.final('utf8')
	return dec
}
function timeNow(){
	let d = new Date()
	let m = d.getMinutes()
	let h = d.getHours()
	return h+":"+ (m.toString().length<2 ? "0"+m : m)
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
