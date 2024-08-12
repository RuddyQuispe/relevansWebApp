export function encryptParam(data: string): string {
    let x: string = btoa(Array.from(new Uint8Array(new TextEncoder().encode(data)), b => String.fromCharCode(b)).join(''))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    x = x.replace(/\//g, '#_#');
    return x;
}

export function decryptParam(data: string): string {
    const m = data.length % 4;
    const arraybuffer: ArrayBufferLike = Uint8Array.from(atob(
        data.replace(/-/g, '+')
            .replace(/_/g, '/')
            .padEnd(data.length + (m === 0 ? 0 : 4 - m), '=')
    ), c => c.charCodeAt(0)).buffer;
    return String.fromCharCode.apply(null, new Uint8Array(arraybuffer));
}
