export function parseDateStringToDate(dateString: string): Date {
    // Dividir la cadena en partes: año, mes y día
    const parts: string[] = dateString.split('-');
    const year: number = parseInt(parts[0], 10);
    const month: number = parseInt(parts[1], 10) - 1; // Los meses en JavaScript son indexados desde 0
    const day: number = parseInt(parts[2], 10);
    // Crear un objeto Date con las partes
    const date: Date = new Date(year, month, day);
    return date;
}

export function parseDateToString(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses comienzan desde 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}