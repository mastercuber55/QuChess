import SocketMock from "socket.io-mock"
import { useStockfish } from "./useStockfish"
import { useBoard } from "./useBoard" 

let mock = null

export function useMockSocket() {

    if(!mock) {
        mock = new SocketMock()
        const { chess } = useBoard()
        const { getBestMove, getRandomName } = useStockfish()

        async function sendMove(playerMove) {
            const move = await getBestMove(chess.fen())
            
            if (!move || move === "(none)") {
                return console.log(move);
            }
    
            const moveMade = {
                from: move.slice(0, 2),
                to: move.slice(2, 4),
                promotion: move[4] || undefined
            }

            setTimeout(() => mock.emit("match-move", move), 500 + Math.random() * 2500)
        }

        mock.on("match-create", () => {

            const color = Math.random() < 0.5 ? "white" : "black"

            mock.emit("match-found", {
                opponent: getRandomName(),
                color
            })

            if(color == "black") sendMove()
        })
        mock.on("match-message", () => {})
        mock.on("match-move", sendMove)
    }

    return mock
}