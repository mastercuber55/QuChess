import { Chess } from 'chess.js'

export default ({ socket, matches }, move) => {

	const { matchID } = socket.data

    if (!matchID || !matches.has(matchID)) {
        return socket.emit("invalid-matchID")
    }

    const match = matches.get(matchID)
    const chess = new Chess(match.fen)

    try {
        chess.move(move)
        match.fen = chess.fen()
        matches.set(matchID, match)
        socket.to(matchID).emit("match-move", move)

    // eslint-disable-next-line no-unused-vars
    } catch (err) {
        socket.emit("invalid-move")

		socket.data.kickedForCheating = true
		socket.disconnect()
    }
}