export default ({ socket, matches }, move) => {
	if(!socket.data.matchID || !matches.has(socket.data.matchID)) 
		return socket.emit("invalid-matchID")

	socket.to(socket.data.matchID).emit("match-move", move)
}