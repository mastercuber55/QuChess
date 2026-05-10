<script setup>

import { onMounted } from 'vue'
import { Chess } from 'chess.js'
import $ from "jquery"

window.$ = $
window.jQuery = $

import "@chrisoakman/chessboardjs/dist/chessboard-1.0.0.min.css"

const chess = new Chess()

function removeHighlights() {
  $('#board .square-55d63').removeClass('highlight')
}

// Adds the highlight to a SPECIFIC square (e.g., 'e4')
function addHighlight(square) {
  $('#board .square-' + square).addClass('highlight')
}

let board = null

onMounted(async() => {
  await import("@chrisoakman/chessboardjs/dist/chessboard-1.0.0.min.js")

  const el = document.getElementById("board")
  el.innerHTML = ""

  board = Chessboard('board', {
    draggable: true,
    onDrop,
    onDragStart,
    onSnapbackEnd,
    position: 'start',
    pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
  })
})


function onDrop (source, target, piece, newPos, oldPos, orientation) {
  const moves = chess.moves({ square: source, verbose: true })
  const isValid = moves.some(m => m.to === target)
  if (!isValid)
    return 'snapback'

  removeHighlights()
  chess.move({ from: source, to: target })
}

function onDragStart (source, piece, position, orientation) {
  const moves = chess.moves({
    square: source,
    verbose: true
  })

  if (moves.length === 0) return false

  removeHighlights()
  moves.forEach((move) => {
    addHighlight(move.to)
  })
}

function onSnapbackEnd() {
  removeHighlights()
}

function undoMove() {
  chess.undo()
  board.position(chess.fen())
}

</script>

<template>
  <div class="container">
    <div id="board"></div>
    <button v-on:click="undoMove()">Undo</button>
  </div>
</template>

<style scoped>

.container {
  display: flex;  
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
}

#board {
  width: 55%
}

:deep(.highlight) {
  background-image: radial-gradient(
    rgba(0, 0, 0, 0.2) 18%, 
    transparent 18%
  ) !important;
  
  background-repeat: no-repeat;
  background-position: center;
}
</style>
