import crypto from "crypto"

export default ({ availablePlayers, matches }) => {

	if (availablePlayers.size < 2) return

	const p1 = availablePlayers.values().next().value
	availablePlayers.delete(p1.id)

	const p2 = availablePlayers.values().next().value
	availablePlayers.delete(p2.id)

	const whiteFirst = Math.random() < 0.5

	const white = whiteFirst ? p1 : p2
	const black = whiteFirst ? p2 : p1

	const matchID = crypto.randomUUID()

	white.data.matchID = matchID
	black.data.matchID = matchID

	white.join(matchID)
	black.join(matchID)

	matches.set(matchID, {
		white: white.data, black: black.data,
	})

	white.emit("match-found", {
		opponent: black.data.name,
		color: "white",
		matchID
	})

	black.emit("match-found", {
		opponent: white.data.name,
		color: "black",
		matchID
	})
}