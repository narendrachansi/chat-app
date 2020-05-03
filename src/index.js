const express=require('express')
const app=require('./app')
const path=require('path')
const http=require('http')
const socketio=require('socket.io')
const PORT=process.env.PORT || 3000

/***
 * create http server
 */
const server=http.createServer(app)
/**
 * Create new socket instance using the http server
 */
const io=socketio(server)

//define path of public directory
const publicDirectoryPath=path.join(__dirname,'./public')
app.use(express.static(publicDirectoryPath))

app.get('/',(req,res)=>{
    res.render('index.html')
})

/**
 * Below function will be triggered when new client is connected
 */
io.on('connection',(socket)=>{
    // Emit welcome message when clients get connected to socket
    socket.emit('message','Welcome!')
    //it emits message to all clients except the particular connection
    socket.broadcast.emit('message','A new user has joined!!')
    // Listen handler to get message typed and sent from clients and emit those messages to all clients
    socket.on('sendMessage',(msg)=>{
        //it will only emit message to request sending client
        //socket.emit('message',msg)
        io.emit('message',msg)
    })
    // emits user left message when a user leaves
    socket.on('disconnect',()=>{
        io.emit('message','A user has left!!!')
    })
})

server.listen(PORT,()=>{
    console.log('Server connected at port '+PORT)
})