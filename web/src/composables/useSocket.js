import { io } from "socket.io-client"
import gameState from "@/states/game"
import { toast } from "vue-sonner"
import { useSFX } from "./useSFX"
import { useMockSocket } from "./useMockSocket"

let socket

const listenersRegistry = {}

const proxy = {
    on (event, callback) {

        if (!listenersRegistry[event]) {
            listenersRegistry[event] = []
        }
        listenersRegistry[event].push(callback)

        socket.on(event, callback)
    },
    off(event, callback) {

        if (listenersRegistry[event]) {
            listenersRegistry[event] = listenersRegistry[event].filter(cb => cb !== callback)
        }

        socket.off(event, callback)
    },
    emit(event, data) {
        socket.emit(event, data)
    },
}

export function useSocket(name) {
    if(!socket) {
        socket = io(import.meta.env.DEV ? `http://${window.location.hostname}:8080` : undefined, { auth: { name } })
    
        gameState.playerName = name

        const { playSound } = useSFX()

        proxy.on("match-found", ({ opponent, color }) => {

            gameState.playerColor = color
            gameState.opponentName = opponent
            gameState.matchActive = true

            playSound("Notify")
            toast.success("Match found", { description: `Match with ${opponent}・You are ${color}!` })
        })

        proxy.on("match-abandon", () => {

            if(!gameState.matchActive) return

            playSound("Notify")
            toast.success(`${gameState.opponentName} lost by abandoment!`)
        })

        proxy.on("opponent-cheated", () => {
            if(!gameState.matchActive) return

            playSound("Notify")
            toast.warning(`${gameState.opponentName} has been kicked for being suspected for cheating.!`)
        })

        proxy.on("invalid-move", () => {
            toast.error(`You have been kicked for being suspected for cheating!`)
        }) 
    }

    return proxy
}

export function switchToMockSocket() {

    const mock = useMockSocket()
    socket.disconnect()
    socket = mock.socketClient
    
    Object.keys(listenersRegistry).forEach((event) => {
        listenersRegistry[event].forEach((callback) => {
            socket.on(event, callback)
        })
    })
}