export function toErrorResponse(err, fallback = 'SERVER_ERROR') {
  if (err?.code && err?.message) return { error: { code: err.code, message: err.message } };
  return { error: { code: fallback, message: 'Something went wrong' } };
}
