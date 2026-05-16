import { reactive } from "vue"

export default reactive({
    opponentName: "[Waiting...]",
    opponentELO: "400",
    playerName: "Anonymous",
    playerELO: "400",
    playerColor: null,
    matchActive: false
})