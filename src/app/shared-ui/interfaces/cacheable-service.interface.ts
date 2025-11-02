/**
 * Base interface cho cache service pattern
 * Định nghĩa các phương thức cơ bản mà một service có cache cần implement
 */
export interface CacheableService {
  /**
   * Xóa tất cả cache của service
   */
  clearCache(): void;
}
