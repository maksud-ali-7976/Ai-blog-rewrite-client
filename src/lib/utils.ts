import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { jwtDecode } from "jwt-decode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const queryStringtoArray = (queryString: string | undefined): string[] =>
  (queryString || "").split(",").filter((f) => f);

export const AsyncCall = async <T>(
  fn: Promise<T>,
  loading?: string | boolean,
): Promise<T> => {
  if (loading === false) {
    try {
      const data: any = await fn;
      return data;
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
      throw error;
    }
  }
  return new Promise((resolve, reject) => {
    toast.promise(fn, {
      loading: (loading as string) || "loading....",
      success: (data: any) => {
        resolve(data);
        return data.message;
      },
      error: (error: any) => {
        reject(error);
        return error?.message;
      },
    });
  });
};


export const isTokenExpired = (token: string) => {
  try {
    const decoded: any = jwtDecode(token);

    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};