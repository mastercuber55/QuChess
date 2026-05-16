import $ from "jquery"
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { Chess, DEFAULT_POSITION } from 'chess.js'
import { usePromotionMenu } from "./usePromotionMenu.js"
import { useSocket } from "./useSocket.js"
import { getBestMove } from "./useStockfish.js"
import { useSFX } from "./useSFX.js"

import gameState from "@/states/game.js"
import { toast } from "vue-sonner"

const { playSound } = useSFX()
const pendingMove = ref(null)
const { showPromotionMenu } = usePromotionMenu()

// Temprorarily modifiable by outside files until next move
const moveIndex = ref(1)

let board = ref(null)
let stockfish = null

const chess = new Chess()

const highlights = {
    variants: ["legal-move", "move-from", "move-to"],
    add(square, variant) {
        if (!this.variants.includes(variant))
            console.warn("Invalid highlight variant passed for adding", variant)
        $(`#board .square-${square}`).addClass(`highlight-${variant}`)
    },
    remove(square, variant) {
        if (!this.variants.includes(variant))
            console.warn("Invalid highlight variant passed for removing", variant)
        $(`#board .square-${square}`).removeClass(`highlight-${variant}`)
    },
    removeAll(variant) {
        if (!this.variants.includes(variant))
            console.warn("Invalid highlight variant passed for removing all", variant)
        $('#board .square-55d63').removeClass(`highlight-${variant}`)
    }
}

window.$ = $
window.jQuery = $

export function useBoard() {

    const socket = useSocket(null)
    window.socket = socket

    onMounted(async () => {
        await import("@chrisoakman/chessboardjs/dist/chessboard-1.0.0.min.js")

        board.value = Chessboard('board', {
            draggable: true,
            onDrop,
            onDragStart,
            onSnapbackEnd: () => highlights.removeAll("legal-move"),
            onSnapEnd: () => board.value.position(chess.fen()),
            position: 'start',
            pieceTheme: '/pieces/{piece}.png'
        })

        window.addEventListener('resize', board.value.resize)


        socket.emit("match-create")
        // setTimeout(() => {
        //     if (playerColor) return

        //     playerColor = "white"
        //     stockfish = true
        //     socket.disconnect()
        //     board.value.position("start")
        //     chess.reset()
        // }, 10000) // In case that no match is found

        socket.on("match-move", (move) => {
            const moveMade = chess.move(move)
            checkMoveStatus(moveMade)
            board.value.position(chess.fen())
        })

        watch(() => gameState.matchActive, (matchStart) => {
            if (!matchStart) return

            chess.reset()
            board.value.position(chess.fen())
            board.value.orientation(gameState.playerColor)

            chess.header(
                "Event", "QyuChess Casual Match",
                "Site", window.location.origin,
                "Date", new Date().toISOString().slice(0, 10).replaceAll("-", "."),
                "Round", "-",
                "White", gameState.playerColor === "white"
                    ? gameState.playerName
                    : gameState.opponentName,
                "Black", gameState.playerColor === "black"
                    ? gameState.playerName
                    : gameState.opponentName,
                "TimeControl", "Unlimited",
                "Variant", "Standard"
            )
        })
    })

    onUnmounted(() => {
        window.removeEventListener('resize', board.value?.resize)
        socket.off("match-move")
        socket.off("match-found")
        socket.disconnect()
    })

    function showLastMove(move) {
        highlights.removeAll("move-from")
        highlights.removeAll("move-to")

        highlights.add(move.from, "move-from")
        highlights.add(move.to, "move-to")
    }
    function checkGameStatus() {
        if (chess.isCheckmate()) {
            playSound("Checkmate")
            const loser = chess.turn() === 'w' ? 'white' : 'black'

            if (gameState.playerColor === loser) {
                toast.error(`${gameState.opponentName} won by checkmate!`)
            } else {
                toast.success(`${gameState.playerName} won by checkmate!`)
            }
            return gameState.matchActive = false
        }

        if (chess.inCheck()) {
            playSound("Check")
        }

        if (chess.isDraw()) {
            playSound("Draw")

            if (chess.isStalemate())
                toast.info("Game over by stalemate!")
            else if (chess.isInsufficientMaterial())
                toast.info("Game over by insufficient material!")
            else if (chess.isThreefoldRepetition())
                toast.info("Game over by three fold repetition!")
            else if (chess.isDrawByFiftyMoves())
                toast.info("Game over by 50 moves!")

            return gameState.matchActive = false
        }
    }
    function checkMoveStatus(move) {
        if (move.isCapture()) {
            playSound("Capture")
        } else {
            playSound("Move")
        }
        showLastMove(move)
        moveIndex.value = chess.history().length - 1
        checkGameStatus()
    }

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
        const move = chess.move({ ...pendingMove.value, promotion: toPiece })
        checkMoveStatus(move)
        pendingMove.value = null
        board.value.position(chess.fen())
    }

    function onDrop(source, target, piece, newPos, oldPos, orientation) {
        const moves = chess.moves({ square: source, verbose: true })
        const isValid = moves.some(m => m.to === target)

        if (!isValid || !gameState.matchActive)
            return 'snapback'

        if (
            (gameState.playerColor === "white" && chess.turn() !== "w") ||
            (gameState.playerColor === "black" && chess.turn() !== "b")
        ) {
            return "snapback"
        }

        highlights.removeAll("legal-move")

        const willPromote = isPromotion(source, target)

        if (willPromote) {
            const squareEl = document.querySelector(`.square-${target}`)
            const rect = squareEl.getBoundingClientRect()
            showPromotionMenu({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height,
            }, promote)

            pendingMove.value = { from: source, to: target }
            board.value.position(chess.fen(), false)
        } else {
            socket.emit("match-move", { from: source, to: target })
            const move = chess.move({ from: source, to: target })
            checkMoveStatus(move)

        }

        if (stockfish)
            setTimeout(makeStockfishMove, 100)
    }

    async function makeStockfishMove() {
        const move = await getBestMove(chess.fen(), 1)

        const moveMade = chess.move({
            from: move.slice(0, 2),
            to: move.slice(2, 4),
            promotion: move[4] || "q"
        })

        checkMoveStatus(moveMade)

        board.value.position(chess.fen())
    }

    function onDragStart(source, piece, position, orientation) {
        const moves = chess.moves({
            square: source,
            verbose: true
        })

        if (moves.length === 0) return false

        highlights.removeAll("legal-move")
        moves.forEach((move) => {
            highlights.add(move.to, "legal-move")
        })
    }

    function getFenAtIndex(index) {
        const history = chess.history({ verbose: true })

        if(index == -1) return DEFAULT_POSITION;

        return history[index].after
    }

    return { chess, board, getFenAtIndex, moveIndex }
}