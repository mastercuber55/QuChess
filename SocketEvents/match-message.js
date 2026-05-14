export default ({ socket, matches }, content) => {
	if(!socket.data.matchID || !matches.has(socket.data.matchID)) 
		return socket.emit("invalid-matchID")

    if(content.trim() == "") return socket.emit("invalid-message")

	socket.to(socket.data.matchID).emit("match-message", content)
}