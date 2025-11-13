export class PaginationUtil {
  static calculateOffset(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  static calculateTotalPages(total: number, limit: number): number {
    return Math.ceil(total / limit);
  }

  static createPaginatedResponse<T>(
    data: T[],
    total: number,
    page: number,
    limit: number
  ) {
    return {
      data,
      total,
      page,
      limit,
      total_pages: this.calculateTotalPages(total, limit),
    };
  }
}
