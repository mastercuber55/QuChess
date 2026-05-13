export default ({ availablePlayers }) => {
	if(availablePlayers.size >= 2) {
		const players = [...availablePlayers.values()]

		const p1 = players[0]
		const p2 = players[1]

		p1.emit("match-found", p2.handshake.auth.name)
		p2.emit("match-found", p1.handshake.auth.name)

		availablePlayers.delete(p1.id)
		availablePlayers.delete(p2.id)
		
	}
}