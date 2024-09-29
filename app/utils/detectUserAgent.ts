import type { UserAgentInfo } from '@/types/site'

export function detectUserAgent(): UserAgentInfo {
	return {
		isMac: navigator.userAgent.includes('Mac OS X'),
		isWindows: navigator.userAgent.includes('Windows'),
		isLinux: navigator.userAgent.includes('Linux'),
	}
}
