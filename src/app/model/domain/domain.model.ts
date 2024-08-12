export class DomainModel {
    constructor(
        public domainTbz?: string,
        public companyId?: number,
        public domName?: string,
        public domValue?: string,
        public description?: string,
        public encrypted?: boolean,
        public lastUser?: string,
        public lastTime?: string,
        public domainId?: number,
        public sortField?: string,
        public sortSense?: string,
        public first?: number,
        public pageSize?: number,
        public totalRows?: number
    ) {
    }

    public static clone = (domain: DomainModel): DomainModel =>
        new DomainModel(
            domain.domainTbz,
            domain.companyId,
            domain.domName,
            domain.domValue,
            domain.description,
            domain.encrypted,
            domain.lastUser,
            domain.lastTime,
            domain.domainId,
            domain.sortField,
            domain.sortSense,
            domain.first,
            domain.pageSize,
            domain.totalRows
        );
}
