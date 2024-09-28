import type { UserAgentInfo } from '@/types/site'
import { TimerPhase } from '~/types/timer'

const INITIAL_APP_STATE = {
	duration: {
		pomodoro: 25,
		shortBreak: 5,
		longBreak: 15,
	},
	// duration: {
	// 	pomodoro: 4 / 60,
	// 	shortBreak: 2 / 60,
	// 	longBreak: 3 / 60,
	// },
	autoStartPomodoro: false,
	autoStartBreak: false,
	longBreakInterval: 3,
	pomodoroCycleCount: 1,
	currentPhase: TimerPhase.POMODORO,
}

export const useSettings = defineStore('settings', () => {
	const appState = useLocalStorage('settings', { ...INITIAL_APP_STATE })
	const currentDuration = computed(() => {
		return appState.value.duration[appState.value.currentPhase] * 60
	})

	const userAgent = ref<UserAgentInfo | null>(null)

	const currentTime = ref(currentDuration.value)
	const currentTimeFormatted = computed(() => displaySecondsInMinutes(currentTime.value))

	watch(
		() => appState.value.currentPhase,
		() => {
			currentTime.value = currentDuration.value
		},
	)

	function resetAppState() {
		appState.value = { ...INITIAL_APP_STATE }
	}

	const currentPhaseInfo = computed(() => {
		if (appState.value.currentPhase === TimerPhase.SHORT_BREAK) {
			return {
				pageTitle: `${currentTimeFormatted.value} - Time to rest!`,
				phaseTitle: `Short Break #${appState.value.pomodoroCycleCount}`,
			}
		}

		if (appState.value.currentPhase === TimerPhase.LONG_BREAK) {
			return {
				pageTitle: `${currentTimeFormatted.value} - Time to rest!`,
				phaseTitle: `Long Break #${appState.value.pomodoroCycleCount}`,
			}
		}

		return {
			pageTitle: `${currentTimeFormatted.value} - Time to focus!`,
			phaseTitle: `Pomodoro #${appState.value.pomodoroCycleCount}`,
		}
	})

	const currentProgressInPercent = computed(() => {
		return Math.round(((currentDuration.value - currentTime.value) / currentDuration.value) * 100)
	})

	function nextPhase() {
		if (appState.value.currentPhase === TimerPhase.POMODORO) {
			if (appState.value.pomodoroCycleCount > 0 && appState.value.pomodoroCycleCount % appState.value.longBreakInterval === 0) {
				appState.value.currentPhase = TimerPhase.LONG_BREAK
			} else {
				appState.value.currentPhase = TimerPhase.SHORT_BREAK
			}
		} else {
			appState.value.currentPhase = TimerPhase.POMODORO
			appState.value.pomodoroCycleCount++
		}
	}

	function resetCycle() {
		appState.value.pomodoroCycleCount = 0
		appState.value.currentPhase = TimerPhase.POMODORO
	}

	return {
		appState,
		currentTime,
		currentTimeFormatted,
		currentPhaseInfo,
		currentProgressInPercent,
		resetAppState,
		currentDuration,
		nextPhase,
		resetCycle,
		userAgent,
	}
})
