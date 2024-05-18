export const wsUrl = (pathname: string = '') => {
	const browser = typeof window !== 'undefined';
	if (browser) return `ws${location.origin.slice(4)}${pathname}`;
	return '';
};

export const delay = (milliseconds: number): Promise<void> => {
	return new Promise<void>(function run(resolve) {
		setTimeout(resolve, milliseconds);
	});
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => void>(
	func: T,
	delay: number
) => {
	let timeoutId: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func(...args), delay);
	};
};

export * from './parser.util';
