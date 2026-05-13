export default ({ socket, availablePlayers }) => {
	console.log("bro left")
    availablePlayers.delete(socket.id)
}