import { StorePostReturnsReq, StoreReturnsRes } from "@medusajs/medusa"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"

/**
 * This hook creates a return for an order. If a return shipping method is specified, the return is automatically fulfilled.
 * 
 * @example
 * import { useCreateReturn } from "medusa-react"
 * 
 * type CreateReturnData = {
 *   items: {
 *     item_id: string,
 *     quantity: number
 *   }[]
 *   return_shipping: {
 *     option_id: string
 *   }
 * }
 * 
 * type Props = {
 *   orderId: string
 * }
 * 
 * const CreateReturn = ({ orderId }: Props) => {
 *   const createReturn = useCreateReturn()
 *   // ...
 * 
 *   const handleCreate = (data: CreateReturnData) => {
 *     createReturn.mutate({
 *       ...data,
 *       order_id: orderId
 *     }, {
 *       onSuccess: ({ return: returnData }) => {
 *         console.log(returnData.id)
 *       }
 *     })
 *   }
 * 
 *   // ...
 * }
 * 
 * export default CreateReturn
 * 
 * @namespaceAsCategory Hooks.Store.Returns
 * @category Mutations
 */
export const useCreateReturn = (
  options?: UseMutationOptions<StoreReturnsRes, Error, StorePostReturnsReq>
) => {
  const { client } = useMedusa()
  return useMutation(
    (data: StorePostReturnsReq) => client.returns.create(data),
    options
  )
}
