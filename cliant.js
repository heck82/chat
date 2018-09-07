'use strict'
let net = require('net')
let readline = require('readline')
let rl = readline.createInterface(process.stdin, process.stdout)
require('ansicolor').nice
if(process.argv.length < 3){
	console.error('please add port as argument'.bright.red)
	process.exit()
}
let n = true
let obj = {}
let client = net.connect(process.argv[2], (err)=>{
	//	console.log('connected')
	if (err) throw err	
})
console.log('**  WELCOME to CHANCK-Chat !!  **'.bgGreen.bright.yellow)
//console.log('plase enter your name:')
rl.question('Please enter your nick: ', (name)=>{
	obj.name = name
	if (name){
		client.write(JSON.stringify(obj))
	}
	rl.close()
})
//process.stdin.on("data", (data)=>{
//	let txt = data.toString().trim()
//	if(n == true && txt !=""|" "){
//		obj.name = txt
//		client.write(JSON.stringify(obj))
//		n = false
//	}else if(txt != ""|" "){
//		obj.msg = txt
//		client.write(JSON.stringify(obj))
//	}
//})
client.on('data', (data)=>{
	if(obj.name){
		console.log(data.toString())
	}
})
client.on('end', ()=>{
	console.log("connection interrupted".bgRed.white+"\nPlease reconnect".bgGreen.white)
	process.exit()
})
