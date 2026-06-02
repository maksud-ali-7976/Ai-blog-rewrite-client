

export type AuthData = {
        
        payloads: {
            Login: {
                        authorization?: string
requestBody: {
        email: string
password: string
    }
                        
                        query?: {
                            
                        }
                        
                    };
Profile: {
                        authorization?: string
                        
                        query?: {
                            
                        }
                        
                    };
RefreshToken: {
                        authorization?: string
requestBody: {
        refreshToken: string
    }
                        
                        query?: {
                            
                        }
                        
                    };
        }
        
        
        responses: {
            Login: {
        status: boolean
message: string
data: {
        _id: string
name: string
role: {
        name: string
level: number
permission: unknown
super_admin: boolean
    }
email: string
token: string
refreshToken: string
super_admin: boolean
    }
    }
                ,Profile: {
        status: boolean
message: string
data: {
        _id: string
name: string
role: {
        name: string
level: number
permission: unknown
super_admin: boolean
    }
email: string
token: string
refreshToken: string
super_admin: boolean
    }
    }
                ,RefreshToken: {
        status: boolean
message: string
data: {
        _id: string
name: string
role: {
        name: string
level: number
permission: unknown
super_admin: boolean
    }
email: string
token: string
refreshToken: string
super_admin: boolean
    }
    }
                
        }
        
    }

export type BlogsData = {
        
        payloads: {
            BlogList: {
                        authorization?: string
                        
                        query: {
                            page: string
size: string
status?: string
                        }
                        
                    };
BlogCreate: {
                        authorization?: string
requestBody: {
        url: string
source: string
    }
                        
                        query?: {
                            
                        }
                        
                    };
BlogUpdate: {
                        authorization?: string
requestBody: {
        rewrite_title?: string
review_notes?: string
rewrite_content?: string
author?: string
    }
                        
                        query: {
                            id: string
                        }
                        
                    };
BlogDelete: {
                        authorization?: string
                        
                        query: {
                            id: string
                        }
                        
                    };
BlogPublish: {
                        authorization?: string
requestBody: {
        status: string
    }
                        
                        query: {
                            id: string
                        }
                        
                    };
BlogReviewed: {
                        authorization?: string
requestBody: {
        status: string
    }
                        
                        query: {
                            id: string
                        }
                        
                    };
BlogDetail: {
                        authorization?: string
                        
                        query: {
                            id: string
                        }
                        
                    };
        }
        
        
        responses: {
            BlogList: {
        status: boolean
message: string
data: Array<{
        _id: string
original_url: string
original_title: string
original_content: string
cover_image: string
rewrite_content: string
rewrite_title: string
review_notes: string
review_by: {
        _id: string
name: string
    }
author: string
published_at: string
publish_by: {
        _id: string
name: string
    }
status: string
gen_status: string
source: string
createdAt: string
updatedAt: string
    }>
meta: {
        pages: number
total: number
page: number
size: number
    }
    }
                ,BlogCreate: {
        status: boolean
message: string
data: {
        _id: string
original_url: string
original_title: string
original_content: string
cover_image: string
rewrite_content: string
rewrite_title: string
review_notes: string
review_by: {
        _id: string
name: string
    }
author: string
published_at: string
publish_by: {
        _id: string
name: string
    }
status: string
gen_status: string
source: string
createdAt: string
updatedAt: string
    }
    }
                ,BlogUpdate: {
        status: boolean
message: string
data: {
        _id: string
original_url: string
original_title: string
original_content: string
cover_image: string
rewrite_content: string
rewrite_title: string
review_notes: string
review_by: {
        _id: string
name: string
    }
author: string
published_at: string
publish_by: {
        _id: string
name: string
    }
status: string
gen_status: string
source: string
createdAt: string
updatedAt: string
    }
    }
                ,BlogDelete: {
        status: boolean
message: string
data: {
        _id: string
original_url: string
original_title: string
original_content: string
cover_image: string
rewrite_content: string
rewrite_title: string
review_notes: string
review_by: {
        _id: string
name: string
    }
author: string
published_at: string
publish_by: {
        _id: string
name: string
    }
status: string
gen_status: string
source: string
createdAt: string
updatedAt: string
    }
    }
                ,BlogPublish: {
        status: boolean
message: string
data: {
        _id: string
original_url: string
original_title: string
original_content: string
cover_image: string
rewrite_content: string
rewrite_title: string
review_notes: string
review_by: {
        _id: string
name: string
    }
author: string
published_at: string
publish_by: {
        _id: string
name: string
    }
status: string
gen_status: string
source: string
createdAt: string
updatedAt: string
    }
    }
                ,BlogReviewed: {
        status: boolean
message: string
data: {
        _id: string
original_url: string
original_title: string
original_content: string
cover_image: string
rewrite_content: string
rewrite_title: string
review_notes: string
review_by: {
        _id: string
name: string
    }
author: string
published_at: string
publish_by: {
        _id: string
name: string
    }
status: string
gen_status: string
source: string
createdAt: string
updatedAt: string
    }
    }
                ,BlogDetail: {
        staus: boolean
message: string
data: {
        _id: string
original_url: string
original_title: string
original_content: string
cover_image: string
rewrite_content: string
rewrite_title: string
review_notes: string
review_by: {
        _id: string
name: string
    }
author: string
published_at: string
publish_by: {
        _id: string
name: string
    }
status: string
gen_status: string
source: string
createdAt: string
updatedAt: string
    }
    }
                
        }
        
    }

export type RoleData = {
        
        payloads: {
            List: {
                        authorization?: string
                        
                        query: {
                            page: string
size: string
                        }
                        
                    };
Create: {
                        authorization?: string
requestBody: {
        name: string
permissions: unknown
super_admin: boolean
order: string | number
    }
                        
                        query?: {
                            
                        }
                        
                    };
Update: {
                        authorization?: string
requestBody: {
        name: string
permissions: unknown
super_admin: boolean
order: string | number
    }
                        
                        query: {
                            id: string
                        }
                        
                    };
Delete: {
                        authorization?: string
                        
                        query: {
                            id: string
                        }
                        
                    };
        }
        
        
        responses: {
            List: {
        status: boolean
message: string
data: Array<{
        _id: string
name: string
permissions: Record<string, unknown>
order: string | number
level?: number
super_admin: boolean
    }>
meta: {
        pages: number
total: number
page: number
size: number
    }
    }
                ,Create: {
        status: boolean
message: string
data: {
        _id: string
name: string
permissions: Record<string, unknown>
order: string | number
level?: number
super_admin: boolean
    }
    }
                ,Update: {
        status: boolean
message: string
data: {
        _id: string
name: string
permissions: Record<string, unknown>
order: string | number
level?: number
super_admin: boolean
    }
    }
                ,Delete: {
        status: boolean
message: string
data: {
        _id: string
name: string
permissions: Record<string, unknown>
order: string | number
level?: number
super_admin: boolean
    }
    }
                
        }
        
    }

export type AdminData = {
        
        payloads: {
            AdminCreate: {
                        authorization?: string
requestBody: {
        name: string
email: string
password: string
role: string
    }
                        
                        query?: {
                            
                        }
                        
                    };
AdminList: {
                        authorization?: string
                        
                        query: {
                            page: string
size: string
                        }
                        
                    };
        }
        
        
        responses: {
            AdminCreate: {
        status: boolean
message: string
data: {
        _id: string
name: string
email: string
super_admin: boolean
role: {
        _id: string
name: string
permissions: Record<string, unknown>
order: string | number
level?: number
super_admin: boolean
    }
    }
    }
                ,AdminList: {
        status: boolean
message: string
data: Array<{
        _id: string
name: string
email: string
super_admin: boolean
role: {
        _id: string
name: string
permissions: Record<string, unknown>
order: string | number
level?: number
super_admin: boolean
    }
    }>
meta: {
        pages: number
total: number
page: number
size: number
    }
    }
                
        }
        
    }

export type AuditData = {
        
        payloads: {
            AuditList: {
                        authorization?: string
                        
                        query: {
                            page: string
size: string
                        }
                        
                    };
        }
        
        
        responses: {
            AuditList: {
        status: boolean
message: string
data: Array<{
        _id: string
admin: {
        _id: string
name: string
    }
action: string
entity: string
entity_id: string
description: string
createdAt: string
updatedAt: string
    }>
meta: {
        pages: number
total: number
page: number
size: number
    }
    }
                
        }
        
    }

export type DashboardData = {
        
        payloads: {
            Insights: {
                        authorization?: string
                        
                        query?: {
                            
                        }
                        
                    };
        }
        
        
        responses: {
            Insights: {
        status: boolean
message: string
data: {
        total_blog: number
draft_blog: number
reviewed_blog: number
published_blog: number
recent_blogs: Array<{
        _id: string
original_url: string
original_title: string
original_content: string
cover_image: string
rewrite_content: string
rewrite_title: string
review_notes: string
review_by: {
        _id: string
name: string
    }
author: string
published_at: string
publish_by: {
        _id: string
name: string
    }
status: string
gen_status: string
source: string
createdAt: string
updatedAt: string
    }>
recent_activity: Array<{
        _id: string
admin: {
        _id: string
name: string
    }
action: string
entity: string
entity_id: string
description: string
createdAt: string
updatedAt: string
    }>
    }
    }
                
        }
        
    }