'use strict'
let net = require('net')
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

console.log('**WELCOME to '+'CHANCK'.bright.magenta+'-Chat !!**')
console.log('plase enter your name:')

process.stdin.on("data", (data)=>{
	let txt = data.toString().trim()
	if(n == true && txt !=""|" "){
		obj.name = txt
		client.write(JSON.stringify(obj))
		n = false
		//		console.log('entering name')
	}else if(txt != ""|" "){
		obj.msg = txt
		client.write(JSON.stringify(obj))
		//		console.log('is a msg')
	}
})

client.on('data', (data)=>{
	if(obj.name){
		console.log(data.toString())
	}
})

client.on('end', ()=>{
	console.log("connection interrupted".bgRed.white+"\nPlease reconnect".bgGreen.white)
	process.exit()
})




//	if (c == 0){
//		return client.write(`{"type" : "name", "name" : "${txt}"}`)
//	}else{
//		return client.write(`{"type" : "msg", "msg" : "${txt}"}`)
//	}
//	c ++
//	process.exit()
//})
//let stream = thr2(verify)
//function verify(chunk, _, next){
//	if (n == true){
//		name = chunk.toString().trim()
//		this.push('your name is '+chunk.toString().trim())
//		next()
//		n = false
//	}else{
//		this.push(name+' say '+chunk.toString().trim())
//	}
//}
//function end(done){
//	done()
//}
//process.stdin.pipe(stream).pipe(client)
//client.write("haha")

