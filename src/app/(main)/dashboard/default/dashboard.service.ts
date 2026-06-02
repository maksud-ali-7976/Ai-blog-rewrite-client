import { create } from "zustand";
import { combine } from "zustand/middleware";
import { DashboardData } from "@/open-api-client/admin/models";
import { DashboardService } from "@/open-api-client/index";
import { AsyncCall } from "@/lib/utils";
import { toast } from "sonner";


const useDashboardStore = create(
    combine(
        {
            loading: false,
            total_blog: 0,
            reviewed_blog: 0,
            published_blog: 0,
            draft_blog: 0,
            recent_blogs: [] as DashboardData["responses"]["Insights"]["data"]["recent_blogs"],
            recent_activity: [] as DashboardData["responses"]["Insights"]["data"]["recent_activity"]
        },
        (set, get) => ({
            actions: {
                insights: async () => {
                    set({ loading: true })
                    try {
                        const request = await AsyncCall(DashboardService.insights(), false)

                        set({
                            recent_activity: request.data?.recent_activity,
                            published_blog: request?.data?.published_blog,
                            recent_blogs: request?.data?.recent_blogs,
                            reviewed_blog: request?.data?.reviewed_blog,
                            total_blog: request?.data?.total_blog,
                            draft_blog: request.data.draft_blog
                        })
                    } finally {
                        set({ loading: false })
                    }
                }
            }
        })
    )
)

export default useDashboardStore