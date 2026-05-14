<script setup>
import { ref } from 'vue';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from '@/components/ui/switch'
import { Label } from './ui/label';
import { CardContent, CardAction } from './ui/card';
import { ScrollArea } from '@/components/ui/scroll-area'
import ScrollArea from './ui/scroll-area/ScrollArea.vue';

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
    <Card variant="outline" class="p-4 flex-1">

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

        <CardContent class="flex-1 flex flex-col gap-2 p-4 overflow-y-auto">
            <ScrollArea>
                <span v-for="(message, index) in messages" :key="index" class="p-2 px-4 rounded-xl"
                    :class="message.sender === opponentName ? 'bg-accent self-start' : 'bg-primary text-primary-foreground self-end'">
                    {{ message.content }}
                </span>
            </ScrollArea>
        </CardContent>

        <CardFooter class="flex gap-2">
            <Input />
            <Button>></Button>
        </CardFooter>
    </Card>
</template>