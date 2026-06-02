import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { AsyncCall } from '@/lib/utils'
import { RoleData } from '@/open-api-client/admin/models'
import { RoleService } from '@/open-api-client/index'



export type Role = RoleData['responses']['List']['data'][0]



let timeOut: any

const useRoleStore = create(
    combine(
        {
            loading: false,
            id: null as any,
            list: [] as Role[],
            total: 0,
            page: 0,
            pages: 0,
            size: 10,
            search: null as string | null,
        },
        (set, get) => ({
            actions: {
                list: async () => {
                    const {
                        page, size, search,
                    } = get()

                    try {
                        const request = await AsyncCall(RoleService.list({
                            query: {
                                page: page.toString(),
                                size: size.toString(),
                            }
                        }), false);

                        set({
                            list: request.data,
                            total: request?.meta?.total,
                            pages: request?.meta?.pages,
                        })
                    } catch (error) {
                        console.log('ApiError: ', error)
                    }


                },

                paginate: ({
                    page,
                    size,
                    search,
                }: {
                    page?: number
                    size?: number
                    search?: string
                }) => {
                    set({ search: search || '' })

                    clearTimeout(timeOut)

                    const init = () => {
                        set(prev => ({
                            ...prev,
                            page: page ?? prev.page,
                            size: size || prev.size,
                            search: search ?? prev.search,
                        }))
                        useRoleStore.getState().actions.list()
                    }

                    if (search) {
                        timeOut = setTimeout(() => {
                            init()
                        }, 1000)
                        set({ search: search })
                        return
                    }
                    init()
                },

            }
        })
    )
)

export default useRoleStore