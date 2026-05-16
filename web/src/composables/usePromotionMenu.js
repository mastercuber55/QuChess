import { ref } from "vue"

const open = ref(false)
const x = ref(0)
const y = ref(0)
const promoteFunc = ref(null)

export function usePromotionMenu() {

    function showPromotionMenu(data, promote) {
        x.value = data.x
        y.value = data.y
        open.value = true
        promoteFunc.value = promote
    }

    function hidePromotionMenu() {
        open.value = false
    }

    return { open, x, y, showPromotionMenu, hidePromotionMenu, promoteFunc }
}