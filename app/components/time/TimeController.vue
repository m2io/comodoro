<script setup lang="ts">
import type { WorkerInputMessage, WorkerOutputMessage } from '@/types/timer'
import { TimerPhase, WorkerInput, WorkerOutput } from '@/types/timer'

const worker = shallowRef<Worker>()

const settings = useSettings()
const { appState, currentTimeFormatted, currentTime, currentPhaseInfo, currentProgressInPercent } = storeToRefs(settings)
const timerIsRunning = ref(false)

watch(currentTime, () => {
	useHead({
		title: currentPhaseInfo.value.pageTitle,
	})
})

function postMessage(message: WorkerInputMessage) {
	if (!worker.value) {
		console.warn('Worker not initialized')
		return
	}
	worker.value.postMessage(message)
}

function toggleTimer() {
	if (timerIsRunning.value) {
		postMessage({ type: WorkerInput.STOP_TIMER })
	} else {
		postMessage({ type: WorkerInput.START_TIMER, seconds: currentTime.value })
	}
	timerIsRunning.value = !timerIsRunning.value
}

const activeElement = useActiveElement()
const notUsingInput = computed(() => activeElement.value?.tagName !== 'INPUT' && activeElement.value?.tagName !== 'TEXTAREA')

const { space } = useMagicKeys()

whenever(logicAnd(space, notUsingInput), () => {
	toggleTimer()
})

function skipTimer() {
	postMessage({ type: WorkerInput.STOP_TIMER })
	settings.nextPhase()
	timerIsRunning.value = false
}

if (import.meta.client) {
	const audio = new Audio('/sounds/notification.ogg')
	worker.value = new Worker(new URL('@/workers/time.worker.ts', import.meta.url), { type: 'module' })
	worker.value.onmessage = (e: MessageEvent<WorkerOutputMessage>) => {
		const { type } = e.data
		switch (type) {
			case WorkerOutput.TIMER_TICK:
				currentTime.value = e.data.seconds
				break
			case WorkerOutput.TIMER_FINISHED:
				audio.play()
				settings.nextPhase()
				timerIsRunning.value = false
				if (appState.value.autoStartPomodoro && appState.value.currentPhase === TimerPhase.POMODORO) {
					toggleTimer()
				} else if (appState.value.autoStartBreak && (appState.value.currentPhase === TimerPhase.SHORT_BREAK || appState.value.currentPhase === TimerPhase.LONG_BREAK)) {
					toggleTimer()
				}
				break
			case WorkerOutput.ERROR:
				console.error('Worker error:', e.data.message)
				break
			default:
				console.error('Unknown message type:', type)
				break
		}
	}
}

onMounted(() => {
	useHead({
		title: currentPhaseInfo.value.pageTitle,
	})

	appState.value.currentPhase = TimerPhase.POMODORO
})

onUnmounted(() => {
	postMessage({ type: WorkerInput.STOP_TIMER })
	worker.value?.terminate()
})
</script>

<template>
	<section class="flex flex-col">
		<div class="flex items-center w-full">
			<TimePhaseSwitch />
		</div>
		<div class="flex flex-col-reverse items-center pt-12">
			<h1 class="mt-6 text-[10vw] font-semibold tabular-nums leading-none text-zinc-200 select-none">
				{{ currentTimeFormatted }}
			</h1>
			<div class="relative mt-2 mx-auto h-0.5 w-full rounded-full bg-zinc-900">
				<div
					class="absolute inset-0 rounded-full bg-zinc-300 transition-all duration-100 ease-out"
					:style="{ width: `${currentProgressInPercent}%` }"
				></div>
			</div>
			<h2 class="font-semibold uppercase tracking-wide text-zinc-400">
				{{ currentPhaseInfo.phaseTitle }}
			</h2>
		</div>

		<div class="mt-4 flex items-center justify-center gap-x-8">
			<BaseButton
				size="lg"
				@click="toggleTimer"
			>
				{{ timerIsRunning ? 'Pause' : 'Start' }}
			</BaseButton>
			<BaseButton
				icon-name="material-symbols-skip-next-rounded"
				icon-size="28"
				size="lg"
				@click="skipTimer"
			/>
		</div>
	</section>
</template>
