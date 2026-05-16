<script setup lang="ts">
import {
  Settings, Swords,
  History,
  Users,
  Tv,
  LayoutDashboard,
  Castle
} from 'lucide-vue-next'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

import { Item } from "@/components/ui/item"
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'; 

import gameState from '@/states/game';

// Menu items.
const items = [
  {
    title: 'Play',
    url: '#',
    icon: Swords,
  },
  {
    title: 'History',
    url: '#',
    icon: History,
  },
  {
    title: 'Leaderboard',
    url: '#',
    icon: LayoutDashboard, // Global rankings
  },
  {
    title: 'Watch',
    url: '#',
    icon: Tv, // Spectating high-rated games
  },
  {
    title: 'Friends',
    url: '#',
    icon: Users, // Social and friend lists
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings, // Board themes, pieces, and sounds
  },
]
</script>

<template>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <div class="flex items-center overflow-hidden mx-3 my-2 gap-1">
           <Castle/>
            <span class="group-data-[state=collapsed]:hidden font-semibold ">
              QuChess
            </span>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in items" :key="item.title">
              <SidebarMenuButton as-child>
                <a :href="item.url">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter class="m-1  flex">
      <Item class="bg-accent p-1.5 flex-1 flex items-center overflow-hidden max-h-11 group-data-[state=collapsed]:bg-transparent group-data-[state=collapsed]:-mx-1 transition-all">
        <Avatar class="shrink-0">
          <AvatarImage :src="`https://api.dicebear.com/9.x/shapes/svg?seed=${gameState.playerName}`"></AvatarImage>
          <AvatarFallback>{{ gameState.playerName?.slice(0, 2) || '??' }}</AvatarFallback>
        </Avatar>
        <div class="flex flex-col leading-tight group-data-[state=collapsed]:hidden">
          <span class="font-semibold whitespace-nowrap">{{ gameState.playerName }}</span>
          <small class="text-sidebar-foreground/60">🏆 {{ gameState.playerELO }}</small>
        </div>
        <Settings class="flex ml-auto group-data-[state=collapsed]:hidden"/>
      </Item>
    </SidebarFooter>
  </Sidebar>
</template>
