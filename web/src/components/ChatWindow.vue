<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from '@/components/ui/switch'
import { Label } from './ui/label';
import { CardContent, CardAction } from './ui/card';
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSocket } from '@/composables/useSocket';
import { Filter } from 'bad-words'
import gameState from '@/states/game';

const filter = new Filter();
filter.removeWords("hell", "damn", "god", "pawn")

const censor = ref(true)
const socket = useSocket(null)
const input = ref("")

const rawMessages = ref([])

const messages = computed(() =>
    rawMessages.value.map(message => ({
        ...message,
        content: censor.value
            ? filter.clean(message.content)
            : message.content
    }))
)

function onMessage(content) {
    rawMessages.value.push({ sender: gameState.opponentName, content })
}

onMounted(() => {
    socket.on("match-message", onMessage)
})

onUnmounted(() => {
    socket.off("match-message", onMessage)
})

function sendMessage() {
    if(input.value.trim() == "") 
        return
    socket.emit("match-message", input.value)
    rawMessages.value.push({ sender: gameState.playerName, content: input.value })
    input.value = ""
}
</script>

<template>
    <Card variant="outline" class="p-4 flex flex-col h-[calc(100dvh-10rem)]">

        <CardHeader class="border-b pb-3 flex items-center justify-between">
            <CardTitle>
                <span class="font-semibold">
                    Message ・ {{ gameState.opponentName }}
                </span>
            </CardTitle>
            <CardAction class="flex gap-1">
                <Switch id="censor" v-model="censor" />
                <Label for="censor">Censor</Label>
            </CardAction>
        </CardHeader>

        <CardContent class="flex-1 min-h-0 p-0">
            <ScrollArea class="h-full w-full">
                <div class="p-4 space-y-2 flex flex-col">
                    <div v-for="(message, index) in messages" :key="index" class="flex"
                        :class="message.sender === gameState.opponentName ? 'justify-start' : 'justify-end'">
                        <span class="px-3 py-2 rounded-2xl max-w-[70%] wrap-break-word" :class="message.sender === gameState.opponentName
                            ? 'bg-accent text-foreground'
                            : 'bg-primary text-primary-foreground'">
                            {{ message.content }}
                        </span>
                    </div>
                </div>

            </ScrollArea>
        </CardContent>

        <CardFooter class="flex gap-2">
            <Input
                v-model="input"
                @keydown.enter="sendMessage"
            />
            
            <Button @click="sendMessage">
                >
            </Button>
        </CardFooter>
    </Card>
</template>