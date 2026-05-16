<script setup lang="ts">
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from '@/components/ui/navigation-menu'

import { SidebarTrigger } from './ui/sidebar';
import gameState from '@/states/game';

</script>

<template>
    <div class="bg-sidebar text-sidebar-foreground border-b border-sidebar-border h-11 px-4 flex items-center">
        <SidebarTrigger/>
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem class="px-3 text-sm font-semibold opacity-50 select-none">
                    {{ gameState.opponentName }} ⚔️ {{ gameState.playerName }}
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    </div>
</template>