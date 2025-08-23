import type { AxiosError } from "axios";

type ServerErrorShape = {
  message?: string;
  errors?: unknown;
};

export function extractErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ServerErrorShape> | undefined;
  if (!axiosError || !axiosError.response) return "An unknown error occurred";

  const data = axiosError.response.data as ServerErrorShape | undefined;

  if (!data) return axiosError.message || "An error occurred";

  if (typeof data === "object") {
    if (data.message && typeof data.message === "string") return data.message;

    if (Array.isArray(data.errors)) {
      return (data.errors as Array<unknown>).join("; ");
    }

    if (typeof data.errors === "object" && data.errors !== null) {
      const parts: string[] = [];
      for (const k of Object.keys(data.errors as Record<string, unknown>)) {
        const v = (data.errors as Record<string, unknown>)[k];
        if (Array.isArray(v))
          parts.push(`${k}: ${(v as Array<unknown>).join(", ")}`);
        else parts.push(`${k}: ${String(v)}`);
      }
      if (parts.length) return parts.join("; ");
    }
  }

  return axiosError.message || "An error occurred";
}

export function extractFieldErrors(error: unknown): Record<string, string[]> {
  const axiosError = error as AxiosError<ServerErrorShape> | undefined;
  if (!axiosError || !axiosError.response) return {};

  const data = axiosError.response.data as ServerErrorShape | undefined;
  if (!data) return {};

  if (Array.isArray(data.errors)) {
    return { _global: (data.errors as Array<unknown>).map(String) };
  }

  if (typeof data.errors === "object" && data.errors !== null) {
    const result: Record<string, string[]> = {};
    for (const k of Object.keys(data.errors as Record<string, unknown>)) {
      const v = (data.errors as Record<string, unknown>)[k];
      if (Array.isArray(v)) result[k] = (v as Array<unknown>).map(String);
      else result[k] = [String(v)];
    }
    return result;
  }

  return {};
}
