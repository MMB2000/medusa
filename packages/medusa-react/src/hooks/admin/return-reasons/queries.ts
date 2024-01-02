import {
  AdminReturnReasonsListRes,
  AdminReturnReasonsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_RETURNS_REASONS_QUERY_KEY = `admin_return_reasons` as const

export const adminReturnReasonKeys = queryKeysFactory(
  ADMIN_RETURNS_REASONS_QUERY_KEY
)

type ReturnReasonQueryKeys = typeof adminReturnReasonKeys

/**
 * This hook retrieves a list of return reasons.
 * 
 * @example
 * import { useAdminReturnReasons } from "medusa-react"
 * 
 * const ReturnReasons = () => {
 *   const { return_reasons, isLoading } = useAdminReturnReasons()
 * 
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {return_reasons && !return_reasons.length && (
 *         <span>No Return Reasons</span>
 *       )}
 *       {return_reasons && return_reasons.length > 0 && (
 *         <ul>
 *           {return_reasons.map((reason) => (
 *             <li key={reason.id}>
 *               {reason.label}: {reason.value}
 *             </li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 * 
 * export default ReturnReasons
 * 
 * @namespaceAsCategory Hooks.Admin.Return Reasons
 * @category Queries
 */
export const useAdminReturnReasons = (
  options?: UseQueryOptionsWrapper<
    Response<AdminReturnReasonsListRes>,
    Error,
    ReturnType<ReturnReasonQueryKeys["lists"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminReturnReasonKeys.lists(),
    () => client.admin.returnReasons.list(),
    options
  )
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a return reason's details.
 * 
 * @example
 * import { useAdminReturnReason } from "medusa-react"
 * 
 * type Props = {
 *   returnReasonId: string
 * }
 * 
 * const ReturnReason = ({ returnReasonId }: Props) => {
 *   const { return_reason, isLoading } = useAdminReturnReason(
 *     returnReasonId
 *   )
 * 
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {return_reason && <span>{return_reason.label}</span>}
 *     </div>
 *   )
 * }
 * 
 * export default ReturnReason
 * 
 * @namespaceAsCategory Hooks.Admin.Return Reasons
 * @category Queries
 */
export const useAdminReturnReason = (
  /**
   * The return reason's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminReturnReasonsRes>,
    Error,
    ReturnType<ReturnReasonQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminReturnReasonKeys.detail(id),
    () => client.admin.returnReasons.retrieve(id),
    options
  )
  return { ...data, ...rest } as const
}
