import { Observable, shareReplay, catchError, throwError } from 'rxjs';

import { CacheableService } from '../interfaces/cacheable-service.interface';

/**
 * Base abstract class cho các service có cache
 */
export abstract class BaseCacheService implements CacheableService {
  protected cacheMap = new Map<string, Observable<any>>();

  /**
   * Tạo cache cho một API endpoint
   *
   * @param cacheKey - Key để identify cache
   * @param apiCall - Function thực hiện API call
   * @returns Observable với cache
   */
  protected createCache<T>(cacheKey: string, apiCall: () => Observable<T>): Observable<T> {
    // Nếu đã có cache, trả về cache
    if (this.cacheMap.has(cacheKey)) {
      return this.cacheMap.get(cacheKey)!;
    }

    // Nếu chưa có cache, gọi API và lưu vào cache
    const cachedObservable = apiCall().pipe(
      shareReplay(1), // Cache kết quả và chia sẻ cho tất cả subscribers
      catchError(error => {
        // Xóa cache khi có lỗi để lần gọi tiếp theo sẽ retry
        this.cacheMap.delete(cacheKey);
        return throwError(() => error);
      })
    );

    this.cacheMap.set(cacheKey, cachedObservable);
    return cachedObservable;
  }

  /**
   * Xóa cache cho một key cụ thể
   *
   * @param cacheKey - Key của cache cần xóa
   */
  protected clearSpecificCache(cacheKey: string): void {
    this.cacheMap.delete(cacheKey);
  }

  /**
   * Xóa tất cả cache
   */
  clearCache(): void {
    this.cacheMap.clear();
  }
}
