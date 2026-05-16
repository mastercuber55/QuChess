import express from "express"
import http from "node:http"
import fs from "node:fs"
import { Server } from "socket.io"
import crypto from "crypto"

const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer, {
  cors: true
})

app.use(express.static("./web/dist"));	

const availablePlayers = new Map()
const matches = new Map()

io.on("connection", async(socket) => {

    availablePlayers.set(socket.id, socket)

	const eventFiles = fs.readdirSync("./SocketEvents")

	socket.data = {
		userID: crypto.randomUUID(),
    	name: socket.handshake.auth.name || "Anonymous"
	}

	for (const file of eventFiles) {
	    const eventName = file.replace(".js", "")

	    const event = await import(`./SocketEvents/${file}`)

	    socket.on(eventName, (...args) => {
	      event.default({ io, socket, availablePlayers, matches }, ...args)
	    })
	  }
})

httpServer.listen(8080, "0.0.0.0",async() => {
    console.log("Application online")
})