export default ({ socket, availablePlayers, matches }) => {
    availablePlayers.delete(socket.id)

    const { matchID } = socket.data

    if(!matchID || !matches.has(matchID)) return
    
    socket.to(matchID).emit("match-abandon")

    matches.delete(matchID)

}