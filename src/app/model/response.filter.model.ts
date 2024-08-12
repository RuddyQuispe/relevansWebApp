export class ResponseFilterModel<T> {
    public contenido: Array<T>;
    public numeroPagina: number;
    public tamanoPagina: number;
    public totalPaginas: number;
    public totalElementos: number;

    constructor(contenido?: Array<T>, numeroPagina?: number, tamanoPagina?: number, totalPaginas?: number, totalElementos?: number) {
        this.contenido = contenido || [];
        this.numeroPagina = numeroPagina || 0;
        this.tamanoPagina = tamanoPagina || 0;
        this.totalPaginas = totalPaginas || 0;
        this.totalElementos = totalElementos || 0;
    }
}
