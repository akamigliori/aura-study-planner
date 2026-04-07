/**
 * API response envelope types.
 * All backend responses follow the shape: { data: T } or { error: { message, code } }
 */

export interface ApiResponse<T> {
  data: T
}

export interface ApiError {
  message: string
  code: string
  statusCode: number
}

export interface ApiErrorResponse {
  error: ApiError
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}
