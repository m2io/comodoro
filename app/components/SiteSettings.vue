<script setup lang="ts">
import BaseStepper from './base/BaseStepper.vue'

const settings = useSettings()

const { appState } = storeToRefs(settings)
</script>

<template>
	<div>
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-xl text-zinc-50 font-semibold  tracking-w">
				Comodoro Settings
			</h2>
			<BaseButton
				size="md"
				@click="settings.resetAppState"
			>
				Reset to default
			</BaseButton>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-5">
			<BaseStepper
				v-model="appState.duration.pomodoro"
				:display-value="`${appState.duration.pomodoro} min`"
				class="border border-zinc-700/50 bg-zinc-800 px-4 py-2 rounded-lg"
				label="Pomodoro"
				:min="1"
				:max="60"
				:steps="1"
			/>
			<BaseStepper
				v-model="appState.duration.shortBreak"
				:display-value="`${appState.duration.shortBreak} min`"
				class="border border-zinc-700/50 bg-zinc-800 px-4 py-2 rounded-lg"
				label="Short break"
				:min="1"
				:max="60"
				:steps="1"
			/>
			<BaseStepper
				v-model="appState.duration.longBreak"
				:display-value="`${appState.duration.longBreak} min`"
				class="border border-zinc-700/50 bg-zinc-800 px-4 py-2 rounded-lg"
				label="Long break"
				:min="1"
				:max="60"
				:steps="1"
			/>
			<BaseStepper
				v-model="appState.longBreakInterval"
				class="border border-zinc-700/50 bg-zinc-800 px-4 py-2 rounded-lg"
				label="Long break interval"
				:min="1"
				:max="60"
				:steps="1"
			/>
			<div class="border border-zinc-700/50 bg-zinc-800 px-4 py-2 rounded-lg flex flex-col justify-between gap-y-4">
				<BaseToggle
					v-model="appState.autoStartPomodoro"
					label="Auto start pomodoro"
				/>
				<BaseToggle
					v-model="appState.autoStartBreak"
					label="Auto start break"
				/>
			</div>
		</div>
	</div>
</template>
