var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var JPush = require("./node_modules/jpush-sdk/lib/JPush/JPush.js");
var client = JPush.buildClient('52da0b984250c4c465c85983', 'ab154afc579faef4e0c6c3c4',5);

var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();//
var morgan = require('morgan');

var server = require('http').createServer(app);
var net = require('net');
 var server1 = net.createServer();
 var sockets = [];
 var send_socket_success = new Buffer([0xDD,0x05,0x06,0x04,0x05,0x02,0x01,0x17,0xEE]);
 /******TCP*******/
server1.on('connection', function(socket) {
    //console.log('got a new connection');
	console.log('got a new connection  '  +socket.remoteAddress);
	socket.write(send_socket_success);
	//console.log(send_socket_success);
    sockets.push(socket);
   //console.log('sockets length:', sockets.length);
     socket.on('data', function(data) { 
	 var send=new Buffer([0xDD,0x05,0x06,0x04,0x84,0x02,0x00,0x95,0xEE]);
	 socket.write(send);
	 console.log(send);
	 var Data = data.toString();
	 var daTa = data.toString('hex');
	 var type = daTa.substring(2,4);    //
	 var type1 = daTa.substring(40,42);    //
	 var type2 = daTa.substring(42,44);
	 var type3 = daTa.substring(56,58);
	 //console.log('type1:',type1+type2+type3);
	 //console.log('got data:', data.toString());
	 //console.log('got datahex:', data);
	 
	 var Tag = Data.substring(4,20);
	 
	 console.log('type:',type);
	 
	 var message2 = {
	"type":2,
	"mac":Tag,
	"pid":Tag,
	"warning":1
	}
	
	
	if (type1 == 04&&type2 == 02&&(type3==01||type3==02||type3==03)){
	 console.log("haoen_Jpush_success");
	client.push().setPlatform('ios', 'android')
    .setAudience(JPush.tag(Tag))
	
    .setNotification('豪恩安防', JPush.ios('安防设备异常，请点击查看',null,null,true,null,message2), JPush.android('安防设备异常，请点击查看', "思远安防", 1,message2))
    .setMessage('msg content')
    .setOptions(null, 86400,null,true)
	
    .send(function(err, res) {
        if (err) {
            console.log(err.message);
        } else {
			
            console.log('Sendno: ' + res.sendno);
            console.log('Msg_id: ' + res.msg_id);
        }
    });
	}
	 /*
	 //menci var send=new Buffer([0xDD,0x12,0x06,0x02,0x4c,0x48,0x30,0x31,0x30,0x31,0x33,0x31,0x30,0x30,0x31,0x36,0x30,0x34,0x44,0x46,0x89,0xEE]);

	 //menci var send2=new Buffer([0xDD,0x12,0x06,0x01,0x4c,0x48,0x30,0x31,0x30,0x31,0x33,0x31,0x30,0x30,0x31,0x36,0x30,0x34,0x44,0x46,0x88,0xEE]);
	 //yaokong var send=new Buffer([0xDD,0x12,0x06,0x01,0x4c,0x48,0x30,0x31,0x30,0x31,0x39,0x31,0x30,0x30,0x30,0x30,0x30,0x31,0x39,0x46,0x79,0xEE]);

	 //yaokong var send2=new Buffer([0xDD,0x12,0x06,0x02,0x4c,0x48,0x30,0x31,0x30,0x31,0x39,0x31,0x30,0x30,0x30,0x30,0x30,0x31,0x39,0x46,0x7A,0xEE]);
	if(Tag == 8605)
	{
	 socket.write(send);
	 console.log('send data:');
	 }
	 if(Tag == 8601)
	 {
		socket.write(send2);
		console.log('send data2:');
	 }*/
	 //socket.write(send2);
	 
    });
	
   socket.on('close', function() {
   console.log('connection closed');
         var index = sockets.indexOf(socket);
         sockets.splice(index, 1);
         console.log('sockets length:', sockets.length);
     });
	 socket.on('error', function (exc) {
		console.log("ignoring exception: " + exc);
	});
 });
 
 server1.on('error', function(err){
    console.log('Server error:', err.message);
 });
 server1.on('close', function() {
     console.log('Server closed');
 });
 server1.listen(27102);
 
app.use(bodyParser.json({limit: '1mb'}));  //这里指定参数使用 json 格式
app.use(bodyParser.urlencoded({  extended: true}))
app.post('/', function (req, res) {  
	
console.log("body"+req.body); 
console.log("host"+req.host);
res.send(req.body);
var type=JSON.parse(req.body.type);

//var result_type=JSON.stringify(req.body.type);
var rc = JSON.parse(0);
console.log("result_type:"+type );

var heartbeat={
	type: type,
	name:"heartbeat",
	from:"cloud"
}

if(type=='0')
{ 
	console.log("heartbeat_success");
	res.send(heartbeat);
}
else{
var mac = JSON.stringify(req.body.mac);
var Mac = JSON.parse(mac);
var pid = JSON.stringify(req.body.pid);
var Pid = JSON.parse(pid);
var status = JSON.stringify(req.body.status);
var Status = JSON.parse(status);
var warning = JSON.stringify(req.body.warning);
var Warning = JSON.parse(warning);
var Jpush={
	"type": type,
	"mac":Mac,
	"rc":rc
}
var message = {
	"type":type,
	"mac":Mac,
	"pid":Pid,
	"status":Status,
	"warning":Warning
}


res.send(Jpush);
console.log("siyuan_Jpush_success");
client.push().setPlatform('ios', 'android')
    .setAudience(JPush.tag(req.body.mac))//,JPush.alias(req.body.mac))
	
    .setNotification('思远安防', JPush.ios('安防设备异常，请点击查看',null,null,true,null,message), JPush.android('安防设备异常，请点击查看', "思远安防", 1,message))
    .setMessage('msg content')
    .setOptions(null, 86400,null,true)
	
    .send(function(err, res) {
        if (err) {
            console.log(err.message);
        } else {
			
            console.log('Sendno: ' + res.sendno);
            console.log('Msg_id: ' + res.msg_id);
        }
    });
	}
})
var PORT = process.env.PORT || 1000;server.listen(PORT)
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.post('/Config', function(req, res, next) {  
    console.log(req.body);//请求中还有参数data,data的值为一个json字符串  
// var data= eval_r('(' + req.body.data + ')');//需要将json字符串转换为json对象  
// console.log("data="+data.PhoneNumber);  
    console.log(req.body.PhoneNumber);//解析json格式数据  
    res.contentType('json');//返回的数据类型  
    res.send(JSON.stringify({ status:"success" }));//给客户端返回一个json格式的数据  
    res.end();  
	client.push().setPlatform('ios', 'android')
    .setAudience(JPush.registration_id(req.body.PhoneNumber))
    .setNotification('Hi, JPush', JPush.ios('ios alert'), JPush.android('android alert', null, 1))
    .setMessage('msg content')
    .setOptions(null, 60)
    .send(function(err, res) {
        if (err) {
            console.log(err.message);
        } else {
            console.log('Sendno: ' + res.sendno);
            console.log('Msg_id: ' + res.msg_id);
        }
    });
});  


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

 
module.exports = app;
