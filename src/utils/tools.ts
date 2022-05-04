export function debounce(fn: () => void, delay: number) {
    let timer: NodeJS.Timeout | null = null;
    return () => {
        if (timer) {
            clearTimeout(timer);
            timer = setTimeout(fn, delay);
        } else {
            timer = setTimeout(fn, delay);
        }
    };
}
