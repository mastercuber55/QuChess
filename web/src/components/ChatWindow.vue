<script setup>
import { ref } from 'vue';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from '@/components/ui/switch'
import { Label } from './ui/label';
import { CardContent, CardAction } from './ui/card';
import { ScrollArea } from '@/components/ui/scroll-area'

const opponentName = ref("Dwip")
const selfName = ref("Cube")

const messages = ref([
    { sender: opponentName.value, content: "Hey" },
    { sender: selfName.value, content: "Hi man, how are you" },
    { sender: opponentName.value, content: "I'm good wby" },
    { sender: selfName.value, content: "Im good too lil vro" },
    { sender: opponentName.value, content: "I see" },
    { sender: selfName.value, content: "Hi man, how are you" },
    { sender: opponentName.value, content: "I'm good wby" },
    { sender: selfName.value, content: "Im good too lil vro" },
    { sender: opponentName.value, content: "I see" },
])
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
                <Switch id="censor" />
                <Label for="censor">Censor</Label>
            </CardAction>
        </CardHeader>

        <CardContent class="flex-1 min-h-0 p-0">
            <ScrollArea class="h-full w-full">
                <div class="p-4 space-y-2 flex flex-col">
                    <div v-for="(message, index) in messages" :key="index" class="flex"
                        :class="message.sender === opponentName ? 'justify-start' : 'justify-end'">
                        <span class="px-3 py-2 rounded-2xl max-w-[70%] break-words" :class="message.sender === opponentName
                            ? 'bg-accent text-foreground'
                            : 'bg-primary text-primary-foreground'">
                            {{ message.content }}
                        </span>
                    </div>
                </div>

            </ScrollArea>
        </CardContent>

        <CardFooter class="flex gap-2">
            <Input />
            <Button>></Button>
        </CardFooter>
    </Card>
</template>