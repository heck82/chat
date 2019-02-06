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
	if (err) throw err	
})
console_out('**  WELCOME to CHANCK-Chat !!  **'.bgGreen.bright.yellow)
rl.question('Please enter your nick: ', (name)=>{
	obj.name = name
	if (name){
		client.write(JSON.stringify(obj))
	}
	rl.prompt(true)
})
rl.on('line', (line)=>{
	obj.msg = line
	client.write(JSON.stringify(obj))
	rl.prompt(true)
})
function console_out(msg) {
	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	console.log(msg);
	rl.prompt(true);
}

client.on('data', (data)=>{
	if(obj.name){
		console_out(data.toString())
	}
})
client.on('end', ()=>{
	console.log("connection interrupted".bgRed.white+"\nPlease reconnect".bgGreen.white)
	process.exit()
})
