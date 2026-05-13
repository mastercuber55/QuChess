import express from "express"
import http from "node:http"
import fs from "node:fs"
import { Server } from "socket.io"

const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173"
  }
})

app.use(express.static("./web/dist"));	

const availablePlayers = new Map()

io.on("connection", async(socket) => {
    
    console.log("bro joined")
    availablePlayers.set(socket.id, socket)

	const eventFiles = fs.readdirSync("./SocketEvents")

	let name = socket.handshake.auth.name || "Anonymous"

	for (const file of eventFiles) {
	    const eventName = file.replace(".js", "")

	    const event = await import(`./SocketEvents/${file}`)

	    socket.on(eventName, (...args) => {
	      event.default({ name, io, socket, availablePlayers }, ...args)
	    })
	  }
})

httpServer.listen(8080, async() => {
    console.log("Application online")
})