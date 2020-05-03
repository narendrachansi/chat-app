socket=io()
socket.on('message',(message)=>{
    console.log(message)
    //document.querySelector('#message').innerHTML=message

    document.getElementsByName('message-form')[0].addEventListener('submit',(e)=>{
        e.preventDefault()
        console.log(e.target.elements.inputMsg.value)
        socket.emit('sendMessage',e.target.elements.inputMsg.value)
        document.getElementsByName('inputMsg')[0].value=''
    })
})
