import { WorkerInput, type WorkerInputMessage, WorkerOutput } from '@/types/timer'

let timerInterval: number | null = null
let startTimestamp = Date.now()
let totalSecondsCounted = 0
let maxSeconds = 0
let timerValue = 0

function initializeSeconds(seconds = 0) {
	startTimestamp = Date.now()
	totalSecondsCounted = 0
	maxSeconds = seconds
	timerValue = seconds
}

function calcGapSeconds() {
	const gapMSecFromStart = Date.now() - startTimestamp
	const gapSecFromStart = Math.round(gapMSecFromStart / 1000)
	const gapSecFromLastTime = gapSecFromStart - totalSecondsCounted
	totalSecondsCounted += gapSecFromLastTime
	const overSec = totalSecondsCounted > maxSeconds ? totalSecondsCounted - maxSeconds : 0

	const gapSeconds = gapSecFromLastTime - overSec

	return gapSeconds > 0 ? gapSeconds : 1
}

function handleStopTimer() {
	if (timerInterval) {
		globalThis.clearInterval(timerInterval)
		timerInterval = null
	}
}

function startInterval() {
	if (timerInterval) {
		globalThis.clearInterval(timerInterval)
	}

	timerInterval = globalThis.setInterval(() => {
		const gapSeconds = calcGapSeconds()
		timerValue -= gapSeconds
		postMessage({ type: WorkerOutput.TIMER_TICK, seconds: timerValue })

		if (totalSecondsCounted >= maxSeconds) {
			handleStopTimer()
			postMessage({ type: WorkerOutput.TIMER_FINISHED })
		}
	}, 1000) as unknown as number
}

globalThis.addEventListener('message', (e: MessageEvent<WorkerInputMessage>) => {
	try {
		const { type } = e.data

		switch (type) {
			case WorkerInput.START_TIMER:
				initializeSeconds(e.data.seconds)
				startInterval()
				break
			case WorkerInput.STOP_TIMER:
				handleStopTimer()
				break
			default:
				throw new Error('Unknown message type')
		}
	} catch (error) {
		postMessage({ type: 'error', message: error })
	}
})
