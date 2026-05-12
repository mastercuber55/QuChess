import { ref } from "vue"

const open = ref(false)
const x = ref(0)
const y = ref(0)

export function usePromotionMenu() {

    let promote = null

    function showPromotionMenu(data) {
        x.value = data.x
        y.value = data.y
        open.value = true
    }

    function hidePromotionMenu() {
        open.value = false
    }

    return { open, x, y, showPromotionMenu, hidePromotionMenu }
}