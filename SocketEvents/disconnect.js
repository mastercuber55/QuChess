export default ({ socket, availablePlayers, matches }) => {
    availablePlayers.delete(socket.id)

    const { matchID } = socket.data

    if(!matchID || !matches.has(matchID)) return
    
    if(!socket.data.kickedForCheating)
        socket.to(matchID).emit("match-abandon")
    else 
        socket.to(matchID).emit("opponent-cheated")

    matches.delete(matchID)

}