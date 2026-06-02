import { ApiError } from "next/dist/server/api-utils";
import { OpenAPI } from "./admin/core/OpenAPI";
import { queryStringtoArray } from "@/lib/utils";
import useAuthStore from "@/app/(main)/auth/auth.service";

OpenAPI.BASE = process.env.NEXT_PUBLIC_API_BASE_URL as string;

// if (OpenAPI.BASE.includes("localhost")) {
//   OpenAPI.BASE = OpenAPI.BASE.replace('/admin', '')
// } else {
//   OpenAPI.BASE = OpenAPI.BASE.replace('m/admin', 'm')
// } //

OpenAPI.TOKEN = async () => {
	if (typeof window !== undefined && Object.keys(window).length) {
		return useAuthStore.getState().user?.token as any;
	}
	return "";
};

OpenAPI.interceptors.request.use((...req) => {
	// console.log("🚀 ~ OpenAPI.interceptors.request.use ~ req:", req)
	if (typeof window != undefined && Object.keys(window).length) {
		let tenants = localStorage.getItem("tenants") as any;
		console.log("🚀 ~ tenants:", tenants);

		if (tenants) {
			let parsed = queryStringtoArray(tenants);
			console.log("🚀 ~ parsed:", parsed);

			if (Array.isArray(parsed)) {
				if (req?.[0]?.headers) {
					req[0].headers["tenants"] = tenants as any;
				}
			}
		}
	}
	return req[0];
});

OpenAPI.interceptors.response.use((res) => {
	if (!res.data?.status) {
		res.statusText = res.data?.message;
		throw new ApiError(res.status, res.data?.message);
	}

	if (res.status == 422) {
		res.statusText = res.data?.message;
		throw new ApiError(res.status, res.data?.message);
	}

	if (res.status == 401) {
		// signOut();
		console.log("leaving exiting the page");
		// window.localStorage.clear();
		setTimeout(() => {
			// window.location.reload();
		}, 500);
	}

	return res;
});

export { ApiError } from "./admin/core/ApiError";
export type { ApiResult } from "./admin/core/ApiResult";
export { CancelablePromise, CancelError } from "./admin/core/CancelablePromise";
export { OpenAPI, type OpenAPIConfig } from "./admin/core/OpenAPI";
export * as ApiClient from "./admin";
export * from "./admin/services";
