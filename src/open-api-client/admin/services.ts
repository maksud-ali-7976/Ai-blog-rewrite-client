import type { CancelablePromise } from './core/CancelablePromise';
import { OpenAPI } from './core/OpenAPI';
import { request as __request } from './core/request';
import type { AuthData, BlogsData, RoleData, AdminData, AuditData, DashboardData } from './models';

export class AuthService {

	/**
	 * @returns any Admin Login Response
	 * @throws ApiError
	 */
	public static login(data: AuthData['payloads']['Login']): CancelablePromise<AuthData['responses']['Login']> {
		const {
                    query,
                    requestBody,
authorization
                } = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/admin/auth/login',
			headers: {
				
			},
			body: requestBody,
			mediaType: 'application/json',
		});
	}

	/**
	 * @returns any Admin Profile Response
	 * @throws ApiError
	 */
	public static profile(data: AuthData['payloads']['Profile'] = {}): CancelablePromise<AuthData['responses']['Profile']> {
		const {
                    query,
                    authorization
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/admin/auth/me',
			headers: {
				
			},
		});
	}

	/**
	 * @returns any Auth Refesh Token Response
	 * @throws ApiError
	 */
	public static refreshToken(data: AuthData['payloads']['RefreshToken']): CancelablePromise<AuthData['responses']['RefreshToken']> {
		const {
                    query,
                    requestBody,
authorization
                } = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/admin/auth/refresh',
			headers: {
				
			},
			body: requestBody,
			mediaType: 'application/json',
		});
	}

}

export class BlogsService {

	/**
	 * {"modules":["blogs"]}
	 * @returns any Blog List Response
	 * @throws ApiError
	 */
	public static blogList(data: BlogsData['payloads']['BlogList']): CancelablePromise<BlogsData['responses']['BlogList']> {
		const {
                    query,
                    authorization
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/admin/blogs/',
			headers: {
				
			},
			query: {
				...query
			},
		});
	}

	/**
	 * {"modules":["blogs"]}
	 * @returns any Blog Create Response
	 * @throws ApiError
	 */
	public static blogCreate(data: BlogsData['payloads']['BlogCreate']): CancelablePromise<BlogsData['responses']['BlogCreate']> {
		const {
                    query,
                    requestBody,
authorization
                } = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/admin/blogs/',
			headers: {
				
			},
			body: requestBody,
			mediaType: 'application/json',
		});
	}

	/**
	 * {"modules":["blogs"]}
	 * @returns any Blog Update Response
	 * @throws ApiError
	 */
	public static blogUpdate(data: BlogsData['payloads']['BlogUpdate']): CancelablePromise<BlogsData['responses']['BlogUpdate']> {
		const {
                    query,
                    requestBody,
authorization
                } = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/admin/blogs/',
			headers: {
				
			},
			query: {
				...query
			},
			body: requestBody,
			mediaType: 'application/json',
		});
	}

	/**
	 * {"modules":["blogs"]}
	 * @returns any Blog Delete Response
	 * @throws ApiError
	 */
	public static blogDelete(data: BlogsData['payloads']['BlogDelete']): CancelablePromise<BlogsData['responses']['BlogDelete']> {
		const {
                    query,
                    authorization
                } = data;
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/admin/blogs/',
			headers: {
				
			},
			query: {
				...query
			},
		});
	}

	/**
	 * {"modules":["blogs"]}
	 * @returns any Blog Publish Response
	 * @throws ApiError
	 */
	public static blogPublish(data: BlogsData['payloads']['BlogPublish']): CancelablePromise<BlogsData['responses']['BlogPublish']> {
		const {
                    query,
                    requestBody,
authorization
                } = data;
		return __request(OpenAPI, {
			method: 'PATCH',
			url: '/admin/blogs/publish',
			headers: {
				
			},
			query: {
				...query
			},
			body: requestBody,
			mediaType: 'application/json',
		});
	}

	/**
	 * {"modules":["blogs"]}
	 * @returns any Blog Reviewed Response
	 * @throws ApiError
	 */
	public static blogReviewed(data: BlogsData['payloads']['BlogReviewed']): CancelablePromise<BlogsData['responses']['BlogReviewed']> {
		const {
                    query,
                    requestBody,
authorization
                } = data;
		return __request(OpenAPI, {
			method: 'PATCH',
			url: '/admin/blogs/review',
			headers: {
				
			},
			query: {
				...query
			},
			body: requestBody,
			mediaType: 'application/json',
		});
	}

	/**
	 * {"modules":["blogs"]}
	 * @returns any Blog Detail Response
	 * @throws ApiError
	 */
	public static blogDetail(data: BlogsData['payloads']['BlogDetail']): CancelablePromise<BlogsData['responses']['BlogDetail']> {
		const {
                    query,
                    authorization
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/admin/blogs/detail',
			headers: {
				
			},
			query: {
				...query
			},
		});
	}

}

export class RoleService {

	/**
	 * {"modules":["roles"]}
	 * @returns any Roles list response
	 * @throws ApiError
	 */
	public static list(data: RoleData['payloads']['List']): CancelablePromise<RoleData['responses']['List']> {
		const {
                    query,
                    authorization
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/admin/roles/',
			headers: {
				
			},
			query: {
				...query
			},
		});
	}

	/**
	 * {"modules":["roles"]}
	 * @returns any Roles create response
	 * @throws ApiError
	 */
	public static create(data: RoleData['payloads']['Create']): CancelablePromise<RoleData['responses']['Create']> {
		const {
                    query,
                    requestBody,
authorization
                } = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/admin/roles/',
			headers: {
				
			},
			body: requestBody,
			mediaType: 'application/json',
		});
	}

	/**
	 * {"modules":["roles"]}
	 * @returns any Roles update response
	 * @throws ApiError
	 */
	public static update(data: RoleData['payloads']['Update']): CancelablePromise<RoleData['responses']['Update']> {
		const {
                    query,
                    requestBody,
authorization
                } = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/admin/roles/',
			headers: {
				
			},
			query: {
				...query
			},
			body: requestBody,
			mediaType: 'application/json',
		});
	}

	/**
	 * {"modules":["roles"]}
	 * @returns any Roles delete response
	 * @throws ApiError
	 */
	public static delete(data: RoleData['payloads']['Delete']): CancelablePromise<RoleData['responses']['Delete']> {
		const {
                    query,
                    authorization
                } = data;
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/admin/roles/',
			headers: {
				
			},
			query: {
				...query
			},
		});
	}

}

export class AdminService {

	/**
	 * {"modules":["roles"]}
	 * @returns any Admin Create Response
	 * @throws ApiError
	 */
	public static adminCreate(data: AdminData['payloads']['AdminCreate']): CancelablePromise<AdminData['responses']['AdminCreate']> {
		const {
                    query,
                    requestBody,
authorization
                } = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/admin/admins/',
			headers: {
				
			},
			body: requestBody,
			mediaType: 'application/json',
		});
	}

	/**
	 * {"modules":["roles"]}
	 * @returns any Admins List Response
	 * @throws ApiError
	 */
	public static adminList(data: AdminData['payloads']['AdminList']): CancelablePromise<AdminData['responses']['AdminList']> {
		const {
                    query,
                    authorization
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/admin/admins/',
			headers: {
				
			},
			query: {
				...query
			},
		});
	}

}

export class AuditService {

	/**
	 * {"modules":["audit"]}
	 * @returns any Audit List Response
	 * @throws ApiError
	 */
	public static auditList(data: AuditData['payloads']['AuditList']): CancelablePromise<AuditData['responses']['AuditList']> {
		const {
                    query,
                    authorization
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/admin/audit/',
			headers: {
				
			},
			query: {
				...query
			},
		});
	}

}

export class DashboardService {

	/**
	 * @returns any Dashboard Insights Response
	 * @throws ApiError
	 */
	public static insights(data: DashboardData['payloads']['Insights'] = {}): CancelablePromise<DashboardData['responses']['Insights']> {
		const {
                    query,
                    authorization
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/admin/dasboard/insights',
			headers: {
				
			},
		});
	}

}