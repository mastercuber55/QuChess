import $ from "jquery"
import { onMounted, onUnmounted, ref } from 'vue'
import { Chess } from 'chess.js'
import { usePromotionMenu } from "./usePromotionMenu.js"
import { useSocket } from "./useSocket.js"
import { toast } from "vue-sonner"
import { getBestMove } from "./useStockfish.js"

const pendingMove = ref(null)
const { showPromotionMenu } = usePromotionMenu()

let board = null
let stockfish = null
let playerColor = null

const chess = new Chess()

const highlights = {
    add: (square) => $('#board .square-' + square).addClass('highlight'),
    removeAll: () => $('#board .square-55d63').removeClass('highlight')
}

window.$ = $
window.jQuery = $

export function useBoard() {

    const socket = useSocket(null)

    onMounted(async () => {
        await import("@chrisoakman/chessboardjs/dist/chessboard-1.0.0.min.js")
        
        board = Chessboard('board', {
            draggable: true,
            onDrop,
            onDragStart,
            onSnapbackEnd: highlights.removeAll,
            onSnapEnd: () => board.position(chess.fen()),
            position: 'start',
            pieceTheme: '/pieces/{piece}.png'
        })

        window.addEventListener('resize', board.resize)

            
        socket.emit("match-create")
        setTimeout(() => {
            if(playerColor) return

            playerColor = "white"
            stockfish = true
            socket.disconnect()
            console.log("Against stockfish lil bro")
            board.position("start")
            chess.reset()
        }, 10000) // In case that no match is found
    })

    onUnmounted(() => {
        window.removeEventListener('resize', board?.resize)
        socket.disconnect()
    })

    socket.on("match-move", (move) => {
        chess.move(move)
        board.position(chess.fen())
    })

    socket.on("match-found", ({ opponent, color }) => {
        toast.success("Match found", { description: `Match with ${opponent}・You are ${color}!`})
        board.orientation(color)
        playerColor = color
        board.position("start")
        chess.reset()
    })

    function isPromotion(source, target) {
        const piece = chess.get(source)

        if (!piece || piece.type !== 'p')
            return false

        const rank = target[1] // "8" from "a8"

        return (
            (piece.color === 'w' && rank === '8') ||
            (piece.color === 'b' && rank === '1')
        )
    }

    function promote(toPiece) {
        socket.emit("match-move", { ...pendingMove.value, promotion: toPiece })
        chess.move({ ...pendingMove.value, promotion: toPiece })
        pendingMove.value = null
        board.position(chess.fen())
    }

    function onDrop(source, target, piece, newPos, oldPos, orientation) {
        const moves = chess.moves({ square: source, verbose: true })
        const isValid = moves.some(m => m.to === target)

        if (!isValid)
            return 'snapback'

        if (
            (playerColor === "white" && chess.turn() !== "w") ||
            (playerColor === "black" && chess.turn() !== "b")
        ) {
            return "snapback"
        }

        highlights.removeAll()

        const willPromote = isPromotion(source, target)

        if (willPromote) {
            const squareEl = document.querySelector(`.square-${target}`)
            const rect = squareEl.getBoundingClientRect()
            showPromotionMenu({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height,
            }, promote)

            pendingMove.value = { from: source, to: target }
            board.position(chess.fen(), false)
        } else {
            socket.emit("match-move", { from: source, to: target })
            chess.move({ from: source, to: target })
        }

        if(stockfish)
            setTimeout(makeStockfishMove, 100)
    }

    async function makeStockfishMove() {
        const move = await getBestMove(chess.fen(), 1)

        console.log(move)

        chess.move({
            from: move.slice(0, 2),
            to: move.slice(2, 4),
            promotion: move[4] || "q"
        })

        board.position(chess.fen())
    }

    function onDragStart(source, piece, position, orientation) {
        const moves = chess.moves({
            square: source,
            verbose: true
        })

        if (moves.length === 0) return false

        highlights.removeAll()
        moves.forEach((move) => {
            highlights.add(move.to)
        })
    }

    function undoMove() {
        chess.undo()
        board.position(chess.fen())
    }

    return { chess, undoMove, promote }
}