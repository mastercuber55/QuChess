<script setup>
import { ref, computed } from 'vue';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from '@/components/ui/switch'
import { Label } from './ui/label';
import { CardContent, CardAction } from './ui/card';
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSocket } from '@/composables/useSocket';
import { Filter } from 'bad-words'

const filter = new Filter();

const opponentName = ref("")
const selfName = ref("")
const censor = ref(true)
const socket = useSocket(null)
const input = ref("")

const messages = computed(() =>
  censor.value ? censoredMessages.value : originalMessages.value
)

const originalMessages = ref([])
const censoredMessages = ref([])

socket.on("match-found", ({ opponent }) => {
    opponentName.value = opponent
    selfName.value = socket.data.name
})

socket.on("match-message", content => {
    originalMessages.value.push({ sender: opponentName.value, content })
    censoredMessages.value.push({ sender: opponentName.value, content: filter.clean(content) })
})

function sendMessage() {
    if(input.value.trim() == "") 
        return
    socket.emit("match-message", input.value)
    originalMessages.value.push({ sender: selfName.value, content: input.value })
    censoredMessages.value.push({ sender: selfName.value, content: filter.clean(input.value) })
    input.value = null
}
</script>

<template>
    <Card variant="outline" class="p-4 flex flex-col h-[calc(100dvh-10rem)]">

        <CardHeader class="border-b pb-3 flex items-center justify-between">
            <CardTitle>
                <span class="font-semibold">
                    Message ・ {{ opponentName }}
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
                        :class="message.sender === opponentName ? 'justify-start' : 'justify-end'">
                        <span class="px-3 py-2 rounded-2xl max-w-[70%] wrap-break-word" :class="message.sender === opponentName
                            ? 'bg-accent text-foreground'
                            : 'bg-primary text-primary-foreground'">
                            {{ message.content }}
                        </span>
                    </div>
                </div>

            </ScrollArea>
        </CardContent>

        <CardFooter class="flex gap-2">
            <Input v-model="input"/>
            <Button @click="sendMessage()">></Button>
        </CardFooter>
    </Card>
</template>