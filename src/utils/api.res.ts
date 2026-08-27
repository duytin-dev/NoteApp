export class ApiResponse<T> {
  constructor(
    public message: string,
    public status: string,
    public data: T,
  ) {}
}
