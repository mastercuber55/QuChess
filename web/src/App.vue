<script setup>

import { Button } from './components/ui/button'
import AppSidebar from '@/components/Sidebar.vue'
import { Textarea } from '@/components/ui/textarea'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Flag,
  ChevronLeft,
  ChevronRight,
  Handshake,
  Copy
} from "lucide-vue-next"

import "@chrisoakman/chessboardjs/dist/chessboard-1.0.0.min.css"
import Navbar from './components/Navbar.vue'
import { useBoard } from "@/composables/useBoard"
import PromotionMenu from './components/PromotionMenu.vue'
import { Input } from './components/ui/input'
import ChatWindow from "@/components/ChatWindow.vue"
import { Toaster } from './components/ui/sonner'
import { useSocket } from "@/composables/useSocket"
import { toast } from 'vue-sonner'
import { ref, computed, watch } from "vue"
import gameState from './states/game'
import { useSFX } from './composables/useSFX'

let name = sessionStorage.getItem('name');
while (!name) name = prompt("What is your name??")
sessionStorage.setItem('name', name)

const socket = useSocket(name)
const { playSound } = useSFX()
const { chess, getFenAtIndex, board, moveIndex } = useBoard()

async function copyPGN() {
    await navigator.clipboard.writeText(chess.pgn())
    toast.success("Game PGN copied!")
}

watch(moveIndex, () => {
  if(!gameState.matchActive || moveIndex.value == chess.moveNumber()) return
  const fen = getFenAtIndex(moveIndex.value)
  if(!fen) return 
  
  board.value.position(fen)
  playSound("Move")
})

</script>


<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <Toaster theme="dark" position="top-center" />
      <PromotionMenu />
      <div class="flex flex-col flex-1 h-full">
        <Navbar />
        <main class="flex-1 p-2">
          <div class="flex flex-col lg:flex-row w-full gap-2.5 h-full">
            <Card class="p-2">
              <div class="overflow-hidden rounded-[calc(var(--radius)-0.25rem)] touch-none">
                <div id="board" class="-m-0.5 aspect-square w-[min(100vw-2rem,calc(100vh-5rem))]"></div>
              </div>
            </Card>
            <Card class="flex-1 p-4">
              <ChatWindow />
              <div class="flex justify-between gap-2">

                <Button size="icon" variant="secondary" @click="moveIndex = Math.max(0, moveIndex - 1)">
                  <ChevronLeft />
                </Button>

                <Button size="icon" variant="secondary" @click="copyPGN">
                  <Copy />
                </Button>

                <Button size="icon" variant="secondary" class="flex-1">
                  <Handshake /> Draw
                </Button>

                <Button size="icon" variant="destructive" class="flex-1">
                  <Flag /> Resign
                </Button>

                <Button size="icon" variant="secondary" @click="moveIndex = Math.min(chess.moveNumber(), moveIndex + 1)">
                  <ChevronRight />
                </Button>

              </div>
            </Card>
          </div>
        </main>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<style scoped>
:deep(.highlight-legal-move) {
  background-image: radial-gradient(rgba(0, 0, 0, 0.2) 18%, transparent 18%) !important;
  background-repeat: no-repeat;
  background-position: center;
}

:deep(.highlight-move-from) {
  background-color: rgba(155, 115, 50, 0.79);
}

:deep(.highlight-move-to) {
  background-color: rgba(225, 179, 80, 0.741);
}
</style>