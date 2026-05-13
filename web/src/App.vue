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

const { chess, undoMove } = useBoard()

</script>


<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <PromotionMenu />
      <div class="flex flex-col flex-1 h-full">
        <Navbar/>
        <main class="flex-1 p-2">
          <div class="flex flex-col lg:flex-row w-full gap-2.5 h-full">
            <Card class="p-2">
              <div class="overflow-hidden rounded-[calc(var(--radius)-0.25rem)]">
                <div id="board" class="-m-0.5 aspect-square w-full max-w-[calc(100vh-5rem)]"></div>
              </div>
            </Card>
            <Card class="flex-1 p-4">
              <Card variant="outline" class="p-4 flex-1">

                <div class="border-b pb-3">
                  <h2 class="text-lg font-semibold tracking-tight text-center">
                    Message ・ Dwip
                  </h2>
                </div>

                <div class="flex-1">
                  <!-- chat messages -->
                </div>

                <div class="flex gap-2 mt-3">
                  <Input />
                  <Button>></Button>
                </div>
              </Card>
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