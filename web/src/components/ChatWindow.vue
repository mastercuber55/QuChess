<script setup>
    import { ref } from 'vue';
    import { Input } from './ui/input';
    import { Button } from './ui/button';
    import { Card } from './ui/card';
    const opponentName = ref("Dwip")
</script>

<template>
    <Card variant="outline" class="p-4 flex-1">

    <div class="border-b pb-3">
        <h2 class="text-lg font-semibold tracking-tight text-center">
        Message ・ {{  opponentName  }}
        </h2>
    </div>

    <div class="flex-1">
        <!-- chat messages -->
    </div>

    <div class="flex gap-2 mt-3">
        <Input />
        <Button>></Button>
    </div>
    </Card>
</template>