const users=[]
const addUser=({id,username,room})=>{
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()
    if(!username || !room){
        return {'error':'Username and room required!!'}
    }
    if(users.find(user=>user.username===username)){
        return {'error':'Username is already in use!!'}
    }
    const user={id,username,room}
    users.push(user)
    return {'user':user}
}

const removeUser=(id)=>{
    const index=users.findIndex(user=>user.id===id)
    if(index!==-1){
        //remove specified item with the given index from the array and return the removed item
        return users.splice(index,1)[0]
    }else{
        return {'error':"User doesn't exist!"}
    }
}

const getUser=(id)=>{
    user=users.find(user=>user.id===id)
    if(user){
        return user
    }else{
        return {'error':"User not found!"}
    }
}

const getUsersByRoom=(room)=>{
    roomUsers=users.filter(user=>user.room===room)
    if(roomUsers){
        return roomUsers
    }else{
        return {'error':"No users!"}
    }
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersByRoom
}
