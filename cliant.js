'use strict'
let net = require('net')
let client = net.connect(process.argv[2], (err)=>{
	if (err) throw err
	console.log('connected to server')
})
process.stdin.on("data", (data)=>{
	let msg = data.toString().trim("\n")
return client.write(msg)
})
//client.write("haha")
client.on('data', (data)=>{
	console.log(data.toString())
})
client.on('end', ()=>{
	console.log("connection interrupted\nPlease reconnect")
	process.exit()
})
