import type { UserAgentInfo } from '@/types/site'

export function detectUserAgent(): UserAgentInfo {
	const userAgent = navigator.userAgent
	const isMac = userAgent.includes('Mac OS X')
	const isWindows = userAgent.includes('Windows')
	const isLinux = userAgent.includes('Linux')
	const isChrome = userAgent.includes('Chrome')
	const isFirefox = userAgent.includes('Firefox')
	const isSafari = userAgent.includes('Safari')
	const isEdge = userAgent.includes('Edge')
	const isOpera = userAgent.includes('Opera')

	return {
		isMac,
		isWindows,
		isLinux,
		isChrome,
		isFirefox,
		isSafari,
		isEdge,
		isOpera,
	}
}
