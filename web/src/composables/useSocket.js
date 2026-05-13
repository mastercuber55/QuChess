import { io } from "socket.io-client"

let socket

export function useSocket(name) {
    if(!socket) {
        socket = io(import.meta.env.DEV ? `http://${window.location.hostname}:8080` : undefined, { auth: { name } })
    }

    return socket
}