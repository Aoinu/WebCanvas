var app = require("http").createServer(handler),
	io = require("socket.io").listen(app),
	settings = require("./settings"),
	fs = require("fs");


app.listen(settings.port,settings.host);
function handler(req,res){
	if(req.url === "/webCanvas.html?"){
		fs.readFile(__dirname + "/webCanvas.html",function(err,data){
			if(err){
				res.writeHead(500);
				return res.end("Error");
			}
			res.writeHead(200);
			res.write(data);
			res.end();		
		});
	}else{
		fs.readFile(__dirname + req.url,function(err,data){
			if(err){
				res.writeHead(500);
				return res.end("Error");
			}
			res.writeHead(200);
			res.write(data);
			res.end();		
		});
	}
	
}

io.sockets.on("connection",function(socket){
	//クライアントからのチャットメッセージ受信、配信処理
	socket.on("send_msg_fromClient",function(data){
		console.log(data.msg);
		socket.set("client_name",data.name);
		socket.get("client_name",function(err,name){
			io.sockets.emit("send_msg_fromServer","["+name+"] "+data.msg);
		});
	});
	//送信されてきた描画情報を送信元以外のクライアントに転送
	socket.on("draw_line_fromClient",function(data){
		socket.broadcast.json.emit("draw_line_fromServer",data);
	});
});
