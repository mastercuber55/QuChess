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
  RotateCcw,
  Handshake,
} from "lucide-vue-next"

import "@chrisoakman/chessboardjs/dist/chessboard-1.0.0.min.css"
import Navbar from './components/Navbar.vue'
import { useBoard } from "@/composables/useBoard.js"
import PromotionMenu from './components/PromotionMenu.vue'
import { Input } from './components/ui/input'
import ChatWindow from "@/components/ChatWindow.vue"
import { Toaster } from './components/ui/sonner'

import { io } from "socket.io-client"
import { toast } from 'vue-sonner'

const name = prompt("Enter your name")

const socket = io(import.meta.env.DEV ? "http://localhost:8080" : undefined, { auth: { name } })
const { chess, undoMove } = useBoard()

socket.emit("match-create")

socket.on("match-found", (name) => {
  toast.success("Match found", { description: `Match with ${name}`})
})

</script>


<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <Toaster theme="dark" position="top-center" />
      <PromotionMenu />
      <div class="flex flex-col flex-1 h-full">
        <Navbar/>
        <main class="flex-1 p-2">
          <div class="flex flex-col lg:flex-row w-full gap-2.5 h-full">
            <Card class="p-2">
              <div class="overflow-hidden rounded-[calc(var(--radius)-0.25rem)]">
                <div id="board" class="-m-0.5 aspect-square w-[min(100vw-2rem,calc(100vh-5rem))]"></div>
              </div>
            </Card>
            <Card class="flex-1 p-4">
              <ChatWindow/>
              <div class="flex flex-row justify-between gap-2">

                <Button class="flex-1" variant="secondary">
                  <RotateCcw />
                  Undo
                </Button>

                <Button class="flex-1" variant="secondary">
                  <Handshake />
                  Draw
                </Button>

                <Button class="flex-1" variant="destructive">
                  <Flag />
                  Resign
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
:deep(.highlight) {
  background-image: radial-gradient(rgba(0, 0, 0, 0.2) 18%, transparent 18%) !important;
  background-repeat: no-repeat;
  background-position: center;
}
</style>