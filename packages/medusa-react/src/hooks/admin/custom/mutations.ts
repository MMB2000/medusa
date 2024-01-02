import { Response } from "@medusajs/medusa-js"
import {
  QueryClient,
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { adminCustomerGroupKeys } from "../customer-groups"
import { adminCustomerKeys } from "../customers"
import { adminDiscountKeys } from "../discounts"
import { adminGiftCardKeys } from "../gift-cards"
import { adminOrderKeys } from "../orders"
import { adminPriceListKeys } from "../price-lists"
import { adminProductKeys } from "../products"

type RelatedDomain =
  | "product"
  | "customer"
  | "customer_group"
  | "order"
  | "discount"
  | "gift_card"
  | "price_list"

export type RelatedDomains = {
  [key in RelatedDomain]?: boolean
}

const invalidateRelatedDomain = (
  queryClient: QueryClient,
  domain: RelatedDomain
) => {
  switch (domain) {
    case "product":
      queryClient.invalidateQueries(adminProductKeys.all)
      break
    case "customer":
      queryClient.invalidateQueries(adminCustomerKeys.all)
      break
    case "customer_group":
      queryClient.invalidateQueries(adminCustomerGroupKeys.all)
      break
    case "order":
      queryClient.invalidateQueries(adminOrderKeys.all)
      break
    case "discount":
      queryClient.invalidateQueries(adminDiscountKeys.all)
      break
    case "gift_card":
      queryClient.invalidateQueries(adminGiftCardKeys.all)
      break
    case "price_list":
      queryClient.invalidateQueries(adminPriceListKeys.all)
      break
  }
}

export const buildCustomOptions = <
  TData,
  TError,
  TVariables,
  TContext,
  TKey extends QueryKey
>(
  queryClient: QueryClient,
  queryKey?: TKey,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>,
  relatedDomains?: RelatedDomains
): UseMutationOptions<TData, TError, TVariables, TContext> => {
  return {
    ...options,
    onSuccess: (...args) => {
      if (queryKey !== undefined) {
        queryKey.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key as QueryKey })
        })
      }

      if (relatedDomains) {
        Object.keys(relatedDomains).forEach((key) => {
          if (relatedDomains[key as RelatedDomain]) {
            invalidateRelatedDomain(queryClient, key as RelatedDomain)
          }
        })
      }

      if (options?.onSuccess) {
        return options.onSuccess(...args)
      }
    },
  }
}

/**
 * This hook sends a `POST` request to a custom API Route. The method accepts a tuple of type parameters: the first `TPayload` is the type of accepted body parameters,
 * which defaults to `Record<string, any>`; the second `TResponse` is the type of response, which defaults to `any`.
 * 
 * @example
 * import { useAdminCustomPost } from "medusa-react"
 * import Post from "./models/Post"
 * 
 * type PostRequest = {
 *   title: string
 * }
 * type PostResponse = {
 *   post: Post
 * }
 * 
 * const Custom = () => {
 *   const customPost = useAdminCustomPost
 *   <PostRequest, PostResponse>(
 *     "/blog/posts",
 *     ["posts"]
 *   )
 * 
 *   // ...
 * 
 *   const handleAction = (title: string) => {
 *     customPost.mutate({
 *       title
 *     }, {
 *       onSuccess: ({ post }) => {
 *         console.log(post)
 *       }
 *     })
 *   }
 * 
 *   // ...
 * }
 * 
 * export default Custom
 * 
 * @namespaceAsCategory Hooks.Admin.Custom
 * @category Mutations
 */
export const useAdminCustomPost = <
  TPayload extends Record<string, any>,
  TResponse
>(
  /**
   * The path to the custom endpoint.
   */
  path: string,
  /**
   * A list of query keys, used to invalidate data.
   */
  queryKey: QueryKey,
  /**
   * A list of related domains that should be invalidated and refetch when the mutation
   * function is invoked.
   */
  relatedDomains?: RelatedDomains,
  options?: UseMutationOptions<Response<TResponse>, Error, TPayload>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: TPayload) =>
      client.admin.custom.post<TPayload, TResponse>(path, payload),
    buildCustomOptions(queryClient, queryKey, options, relatedDomains)
  )
}

/**
 * This hook sends a `DELETE` request to a custom API Route. The method accepts a type parameters `TResponse` indicating the type of response, which defaults to `any`.
 * 
 * @example
 * import { useAdminCustomDelete } from "medusa-react"
 * 
 * type Props = {
 *   customId: string
 * }
 * 
 * const Custom = ({ customId }: Props) => {
 *   const customDelete = useAdminCustomDelete(
 *     `/blog/posts/${customId}`,
 *     ["posts"]
 *   )
 * 
 *   // ...
 * 
 *   const handleAction = (title: string) => {
 *     customDelete.mutate(void 0, {
 *       onSuccess: () => {
 *         // Delete action successful
 *       }
 *     })
 *   }
 * 
 *   // ...
 * }
 * 
 * export default Custom
 * 
 * @namespaceAsCategory Hooks.Admin.Custom
 * @category Mutations
 */
export const useAdminCustomDelete = <TResponse>(
  /**
   * The path to the custom endpoint.
   */
  path: string,
  /**
   * A list of query keys, used to invalidate data.
   */
  queryKey: QueryKey,
  /**
   * A list of related domains that should be invalidated and refetch when the mutation
   * function is invoked.
   */
  relatedDomains?: RelatedDomains,
  options?: UseMutationOptions<Response<TResponse>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.custom.delete<TResponse>(path),
    buildCustomOptions(queryClient, queryKey, options, relatedDomains)
  )
}
