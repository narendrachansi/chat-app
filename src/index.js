const express=require('express')
const app=require('./app')
const path=require('path')
const http=require('http')
const cors=require('cors')
const socketio=require('socket.io')
const PORT=process.env.PORT || 3001
const Filter=require('bad-words')
const {addUser,removeUser,getUser,getUsersByRoom} =require('../src/models/user')

// var whitelist = ['https://www.google.com']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
// app.use(cors())
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
    socket.emit('message','Welcome!','Admin')

    socket.on('join',(userObj,callback)=>{
        const {error,user}=addUser({id:socket.id,username:userObj.displayName,room:userObj.room})
        if(error){
            return callback(error)
        }
        socket.join(user.room)
        
         //it emits message to all clients except the particular connection in the specified room
        socket.broadcast.to(user.room).emit('message',user.username+' has joined!!','Admin')
        io.to(user.room).emit('userData',getUsersByRoom(user.room),user.room)
        callback()
    })

    // Listen handler to get message typed and sent from clients and emit those messages to all clients
    socket.on('sendMessage',(msg,callback)=>{
        const user=getUser(socket.id)
        const filter=new Filter()
        if(filter.isProfane(msg)){
            return callback('Profanity is not allowed!')
        }
        //it will only emit message to request sending client
        //socket.emit('message',msg)
        if(user){
            io.to(user.room).emit('message',msg,user.username)
            callback()
        }
                
    })
    socket.on('location',(coordinates,callback)=>{
        const user=getUser(socket.id)
        io.to(user.room).emit('locationMsg',`https://google.com/maps?q=${coordinates.latitude},${coordinates.longitude}&output=svembed`,user.username)
        callback()
    })


    // emits user left message when a user leaves
    socket.on('disconnect',()=>{
        const user=removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',`${user.username} has left!!!`, 'Admin')
            io.to(user.room).emit('userData',getUsersByRoom(user.room),user.room)
        }        
    })
})

server.listen(PORT,()=>{
    console.log('Server connected at port '+PORT)
})