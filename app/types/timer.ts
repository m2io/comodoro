export enum TimerPhase {
	POMODORO = 'pomodoro',
	SHORT_BREAK = 'shortBreak',
	LONG_BREAK = 'longBreak',
}

export enum WorkerOutput {
	TIMER_TICK = 'timer-tick',
	TIMER_FINISHED = 'timer-finished',
	ERROR = 'error',
}

interface TimerUpdateMessage {
	type: WorkerOutput.TIMER_TICK
	seconds: number
}

interface TimerFinishedMessage {
	type: WorkerOutput.TIMER_FINISHED
}

interface ErrorMessage {
	type: WorkerOutput.ERROR
	message: string
}

export type WorkerOutputMessage = TimerUpdateMessage | TimerFinishedMessage | ErrorMessage

export enum WorkerInput {
	START_TIMER = 'start-timer',
	STOP_TIMER = 'stop-timer',
	UPDATE_TIMER = 'update-timer',
}

interface StartTimerMessage {
	type: WorkerInput.START_TIMER
	seconds: number
}

interface StopTimerMessage {
	type: WorkerInput.STOP_TIMER
}

interface UpdateTimerMessage {
	type: WorkerInput.UPDATE_TIMER
	seconds: number
}

export type WorkerInputMessage = StartTimerMessage | StopTimerMessage | UpdateTimerMessage
