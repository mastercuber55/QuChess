<script setup lang="ts">
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from '@/components/ui/navigation-menu'
</script>

<template>
    <div class="bg-sidebar text-sidebar-foreground border-b border-sidebar-border h-11 px-4 flex items-center">
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem class="px-3 text-sm font-semibold opacity-50 select-none">
                    Dwip [400] vrs Cube Nerd [300]
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    </div>
</template>