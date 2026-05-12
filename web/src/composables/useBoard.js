import $ from "jquery"
import { onMounted, onUnmounted, ref } from 'vue'
import { Chess } from 'chess.js'
import { usePromotionMenu } from "./usePromotionMenu.js"

const pendingMove = ref(null)
const { showPromotionMenu } = usePromotionMenu()

let board = null

const chess = new Chess()

const highlights = {
    add: (square) => $('#board .square-' + square).addClass('highlight'),
    removeAll: () => $('#board .square-55d63').removeClass('highlight')
}

window.$ = $
window.jQuery = $

export function useBoard() {


    onMounted(async () => {
        await import("@chrisoakman/chessboardjs/dist/chessboard-1.0.0.min.js")

        board = Chessboard('board', {
            draggable: true,
            onDrop,
            onDragStart,
            onSnapbackEnd: highlights.removeAll,
            onSnapEnd: () => board.position(chess.fen()),
            position: 'start',
            pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
        })

        window.addEventListener('resize', board.resize)
    })

    onUnmounted(() => {
        window.removeEventListener('resize', board?.resize)
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
        chess.move({ ...pendingMove.value, promotion: toPiece })
        pendingMove.value = null
        board.position(chess.fen())
    }

    function onDrop(source, target, piece, newPos, oldPos, orientation) {
        const moves = chess.moves({ square: source, verbose: true })
        const isValid = moves.some(m => m.to === target)
        if (!isValid)
            return 'snapback'

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
            chess.move({ from: source, to: target })
        }
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