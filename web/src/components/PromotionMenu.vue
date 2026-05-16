<script setup>

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import { Button } from './ui/button/index.js';

import { usePromotionMenu } from "@/composables/usePromotionMenu.js"

const { open, x, y, hidePromotionMenu, promoteFunc } = usePromotionMenu()

const options = [
    { label: 'Queen', icon: '♛', value: "q" },
    { label: 'Rook', icon: '♜', value: "r" },
    { label: 'Bishop', icon: '♝', value: "b" },
    { label: 'Knight', icon: '♞', value: "n" }
]

</script>

<template>
    <Popover v-model:open="open">
        <PopoverTrigger as-child>
            <!-- fake anchor point -->
            <div class="fixed w-0 h-0" :style="{ left: x + 'px', top: y + 'px' }" />
        </PopoverTrigger>

        <PopoverContent class="p-2 w-50">
            <div class="mb-2 text-center text-sm font-medium text-muted-foreground">
                Choose Piece
            </div>
            <div class="grid grid-cols-2 gap-2">
                <Button variant="secondary" v-for="option in options" @click="() => {
                    promoteFunc(option.value)
                    hidePromotionMenu()
                }" class="flex items-center gap-2">
                    <span class="text-lg">{{ option.icon }}</span>
                    <span>{{ option.label }}</span>
                </Button>
            </div>
        </PopoverContent>
    </Popover>
</template>
