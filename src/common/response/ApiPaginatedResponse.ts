export class ApiPaginatedResponse {
    data: any;  
    pagination?: Pagination; 

    constructor(data: any, pagination?: Pagination) {
        this.data = data;
        this.pagination = pagination;
    }
}

export class Pagination {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;

    constructor(totalCount: number, currentPage: number, totalPages: number, hasNextPage: boolean) {
        this.totalCount = totalCount;
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.hasNextPage = hasNextPage;
    }
}
