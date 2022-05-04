export as namespace JSX;

export interface IntrinsicElements {
    [tagName: string]: any;
}

declare global {
    function order(id: string): any;
}