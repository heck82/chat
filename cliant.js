'use strict'
let net = require('net')
let readline = require('readline')
let crypto = require('crypto')

let rl = readline.createInterface(process.stdin, process.stdout)
require('ansicolor').nice
if(process.argv.length < 3){
	console.error('please add port as argument'.bright.red)
	process.exit()
}
let port = process.argv[2]
//let port = 3000
let n = true
let obj = {}
let client = net.connect(port, '10.98.33.101', ()=>{
	console_out('**WELCOME to TROLOLO-CHAT**'.bgGreen.bright.yellow)
	rl.question('Please enter your nick: ', (name)=>{
		if (name.trim()){
			obj.name = name.trim()
			obj.type = "join"
			client.write(JSON.stringify(obj))
			rl.prompt(true)
		}else{
			console.error('name was not entered'.bright.red)
			process.exit()
		}
	})
	rl.on('line', (line)=>{
		if(line.trim()){
			obj.msg = encrypt(line.trim())
			obj.type = "msg"
			client.write(JSON.stringify(obj))
		}
		rl.prompt(true)
	})
})
function console_out(msg) {
	process.stdout.clearLine()
	process.stdout.cursorTo(0)
	console.log(msg)
	rl.prompt(true)
}
let cph = 'aes192'
let pass = 'zhopa'
function encrypt(text){
	var cipher = crypto.createCipher(cph, pass)
	var crypted = cipher.update(text,'utf8','hex')
	crypted += cipher.final('hex')
	return crypted
}
function decrypt(text){
	var decipher = crypto.createDecipher(cph, pass)
	var dec = decipher.update(text,'hex','utf8')
	dec += decipher.final('utf8')
	return dec
}
client.on('data', (data)=>{
	if(obj.name){
		let res = JSON.parse(data.toString().trim())
		if(res.msg)
			res.msg = decrypt(res.msg)
		switch(res.type){
			case "join":
				console_out(`[${res.time}] ${res.name.green} has joined to chat`.lightCyan)
				break
			case "msg":
				console_out(`[${res.time}] ${res.name} : ${res.msg.bright.green}`.green)
				break
			case "left":
				console_out(`[${res.time}] ${res.name.green} has left a chat`.cyan)
				break
		}
	}else{
		console_out(data.toString())
	}
})
client.on('error',(err)=>{
	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	console.error("conection failed\nplease try again later".bgRed.white)
	process.exit()
})
client.on('end', ()=>{
	let sec = 14
	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	console.log("connection interrupted".bgRed.white)
	console.log("please relogin".bgRed.white)
	/*	process.stdout.write("trying to reconnect ....Please wait 15 sec".bgGreen.white)
	let interv = setInterval(()=>{
		process.stdout.clearLine();
		process.stdout.cursorTo(0);
		process.stdout.write(`trying to reconnect ....Please wait ${sec} sec`.bgGreen.white)
		sec--
	},1000)
	setTimeout(()=>{
		clearInterval(interv)
		process.stdout.clearLine();
		process.stdout.cursorTo(0);
		client.connect(port, ()=>{
			console.log("connection esteblished".bgBlue.white)
			rl.prompt(true)
		})
	},15000)
	*/	process.exit()
})
