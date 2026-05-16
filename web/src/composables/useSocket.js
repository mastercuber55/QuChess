import { io } from "socket.io-client"
import gameState from "@/states/game"
import { toast } from "vue-sonner"
import { useSFX } from "./useSFX"

let socket

export function useSocket(name) {
    if(!socket) {
        socket = io(import.meta.env.DEV ? `http://${window.location.hostname}:8080` : undefined, { auth: { name } })
    
        gameState.playerName = name

        const { playSound } = useSFX()

        socket.on("match-found", ({ opponent, color }) => {

            gameState.playerColor = color
            gameState.opponentName = opponent
            gameState.matchActive = true

            playSound("Notify")
            toast.success("Match found", { description: `Match with ${opponent}・You are ${color}!` })
        })

        socket.on("match-abandon", () => {

            if(!gameState.matchActive) return

            playSound("Notify")
            toast.success(`${gameState.opponentName} lost by abandoment!`)
        })

        socket.on("opponent-cheated", () => {
            if(!gameState.matchActive) return

            playSound("Notify")
            toast.warning(`${gameState.opponentName} has been kicked for being suspected for cheating.!`)
        })

        socket.on("invalid-move", () => {
            toast.error(`You have been kicked for being suspected for cheating!`)
        }) 
    }

    return socket
}