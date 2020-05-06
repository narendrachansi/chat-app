socket=io()
const $messageForm=document.getElementsByName('message-form')[0]
const $inputMsg=document.getElementsByName('inputMsg')[0]
const $submitMsg=document.getElementById('submitMsg')
const $sendLocation=document.getElementById('send-location')
socket.on('message',(message)=>{
    console.log(message)
    //document.querySelector('#message').innerHTML=message
    $messageForm.addEventListener('submit',(e)=>{
        e.preventDefault()
        $submitMsg.setAttribute('disabled','disabled')
        socket.emit('sendMessage',e.target.elements.inputMsg.value,(error)=>{
            if(error) console.log(error)
            $submitMsg.removeAttribute('disabled')
            $inputMsg.value=''
            $inputMsg.focus()
        })
    })
    $sendLocation.addEventListener('click',()=>{
        $sendLocation.setAttribute('disabled','disabled')
        if(!navigator.geolocation){
            return alert("Your browser doesn't support geolocation")
        }
        navigator.geolocation.getCurrentPosition((position)=>{
            const latitude=position.coords.latitude
            const longitude=position.coords.longitude
            socket.emit('location',{latitude,longitude},()=>{
                $sendLocation.removeAttribute('disabled')
                console.log('Location shared!')
            })
        })
    })
})
