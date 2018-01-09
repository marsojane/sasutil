export function format(...args: any[]): string {
	let msg, params
	(typeof arguments[0] === 'object') ? (msg = arguments[0][0], params = arguments[0]) : (msg = arguments[0], params = arguments)
	msg = msg.replace(/{\d}/g, (s) => {
		const key = (1 * s.match(/\d/)[0]) + 1
		return typeof params[key] !== 'undefined' ? params[key] : s
	})
	return msg
}

export const inArray = (needle: any, haystack: any[]): boolean => !!haystack.find((hay) => hay === needle)

export function exportLogs(linkRef, msgStack): void {
	if (msgStack.length > 0) {
		const fileName = format('sasutillogs{0}', (new Date).getTime())
		const url = URL.createObjectURL(new Blob([JSON.stringify(msgStack)], { type: 'text/plain;charset=utf-8;' }))
		linkRef.setAttribute('href', url)
		linkRef.setAttribute('download', fileName)
		linkRef.click()
	}
}
