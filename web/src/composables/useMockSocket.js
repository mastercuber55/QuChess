import SocketMock from "socket.io-mock"
import { useStockfish } from "./useStockfish"
import { useBoard } from "./useBoard" 

let mock = null

export function useMockSocket() {

    if(!mock) {
        mock = new SocketMock()
        const { chess } = useBoard()
        const { getBestMove, getRandomName } = useStockfish()

        mock.on("match-create", () => {
            mock.emit("match-found", {
                opponent: getRandomName(),
                color: "white"
            })
        })
        mock.on("match-message", () => {})
        mock.on("match-move", async(playerMove) => {
            const move = await getBestMove(chess.fen())

            const moveMade = {
                from: move.slice(0, 2),
                to: move.slice(2, 4),
                promotion: move[4] || undefined
            }

            setTimeout(() => mock.emit("match-move", move), 250)
        })
    }

    return mock
}