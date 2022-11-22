export class PagedResult<T> {
    map(arg0: (user: any) => any): any {
        throw new Error("Method not implemented.");
    }
    totalCount: number | undefined;
    items: T[] | undefined;
}