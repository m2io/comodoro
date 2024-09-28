<script setup lang="ts">
import { TimerPhase } from '~/types/timer'

const settings = useSettings()
const { appState } = storeToRefs(settings)
const phases = [{ title: 'Pomodoro', id: TimerPhase.POMODORO }, { title: 'Short Break', id: TimerPhase.SHORT_BREAK }, { title: 'Long Break', id: TimerPhase.LONG_BREAK }]
</script>

<template>
	<nav class="flex justify-around w-full">
		<button
			v-for="phase in phases"
			:key="phase.id"
			class="px-6 py-2  rounded-full font-semibold "
			:class="{
				'bg-zinc-800 text-zinc-200 ': appState.currentPhase === phase.id,
				'text-zinc-500 hover:bg-zinc-800': appState.currentPhase !== phase.id,
			}"
			@click="appState.currentPhase = phase.id"
		>
			{{ phase.title }}
		</button>
	</nav>
</template>
