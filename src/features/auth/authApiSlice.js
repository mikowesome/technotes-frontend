import { apiSlice } from '../../app/api/apiSlice'
import { logOut, setCredentials } from './authSlice'

export const authApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (credentials) => ({
				url: '/auth',
				method: 'POST',
				body: { ...credentials },
			}),
		}),
		sendLogOut: builder.mutation({
			query: () => ({
				url: '/auth/logout',
				method: 'POST',
			}),
			onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
				try {
					await queryFulfilled
					dispatch(logOut())
                    setTimeout(() => {
                        dispatch(apiSlice.util.resetApiState())
                    }, 1000)
				} catch (error) {
					console.log(error)
				}
			},
		}),
		refresh: builder.mutation({
			query: () => ({
				url: '/auth/refresh',
				method: 'GET',
			}),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled
                    const { accessToken } = data
                    dispatch(setCredentials({ accessToken }))
                } catch (error) {
                    console.log(error)
                }
            }
		}),
	}),
})

export const { useLoginMutation, useSendLogOutMutation, useRefreshMutation } =
	authApiSlice
