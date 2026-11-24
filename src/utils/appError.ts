// Utility: App Error (Custom Operational Error Class)
//
// Apa fungsi file ini?
// - Class kustom turunan dari Error bawaan JavaScript yang membawa status code HTTP.
//
// Kenapa butuh ini?
// - Error bawaan JS (throw new Error) hanya punya pesan teks, tidak tahu status HTTP-nya.
// - Dengan AppError, Service bisa melempar error sekaligus status codenya:
//   Contoh: throw AppError.notFound("Produk tidak ditemukan") -> otomatis status 404.
// - errorHandler akan membaca status code tersebut dan mengirimkannya ke client secara tepat.

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // 400 Bad Request
  static badRequest(message: string): AppError {
    return new AppError(message, 400);
  }

  // 401 Unauthorized
  static unauthorized(
    message: string = "Autentikasi gagal atau token tidak valid",
  ): AppError {
    return new AppError(message, 401);
  }

  // 403 Forbidden
  static forbidden(message: string = "Akses ditolak"): AppError {
    return new AppError(message, 403);
  }

  // 404 Not Found
  static notFound(message: string = "Data tidak ditemukan"): AppError {
    return new AppError(message, 404);
  }

  // 409 Conflict
  static conflict(
    message: string = "Data yang dikirim bertabrakan dengan data yang ada",
  ): AppError {
    return new AppError(message, 409);
  }

  // 500 Internal Server Error
  static internal(
    message: string = "Terjadi kesalahan internal server",
  ): AppError {
    return new AppError(message, 500, false);
  }
}
