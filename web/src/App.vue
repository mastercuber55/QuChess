<script setup>

import { onMounted } from 'vue'
import { Chess } from 'chess.js'
import { Button } from './components/ui/button'
import AppSidebar from '@/components/Sidebar.vue'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import $ from "jquery"

window.$ = $
window.jQuery = $

import "@chrisoakman/chessboardjs/dist/chessboard-1.0.0.min.css"
import Navbar from './components/Navbar.vue'

const chess = new Chess()

function removeHighlights() {
  $('#board .square-55d63').removeClass('highlight')
}

// Adds the highlight to a SPECIFIC square (e.g., 'e4')
function addHighlight(square) {
  $('#board .square-' + square).addClass('highlight')
}

let board = null

onMounted(async () => {
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

  window.addEventListener('resize', board.resize)
})


function onDrop(source, target, piece, newPos, oldPos, orientation) {
  const moves = chess.moves({ square: source, verbose: true })
  const isValid = moves.some(m => m.to === target)
  if (!isValid)
    return 'snapback'

  removeHighlights()
  chess.move({ from: source, to: target })
}

function onDragStart(source, piece, position, orientation) {
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
  <SidebarProvider>
    <AppSidebar />
    <div class="flex flex-col flex-1 h-full">
      <Navbar class="flex-none"/>
      <main class="flex-1 overflow-x-hidden m-2.5">
      <div class="flex w-full gap-2.5">
        <Card class="py-2 px-1.5">
          <div id="board" class="aspect-square h-[calc(100vh-5rem)]"></div>
        </Card>
        <Card class="flex-2">
          
        </Card>
      </div>
    </main>
    </div>
  </SidebarProvider>
</template>

<style scoped>

:deep(.highlight) {
  background-image: radial-gradient(rgba(0, 0, 0, 0.2) 18%,
      transparent 18%) !important;

  background-repeat: no-repeat;
  background-position: center;
}
</style>