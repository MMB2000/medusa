import { EntityManager } from "typeorm"
import { ProductService } from "../../../../services"

/**
 * @oas [delete] /admin/products/{id}
 * operationId: "DeleteProductsProduct"
 * summary: "Delete a Product"
 * description: "Delete a Product and its associated product variants and options."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Product.
 * x-codegen:
 *   method: delete
 * x-codeSamples:
 *   - lang: TypeScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.products.delete(productId)
 *       .then(({ id, object, deleted }) => {
 *         console.log(id);
 *       })
 *   - lang: TypeScript
 *     label: Medusa React
 *     source: |
 *       import { useAdminDeleteProduct } from "medusa-react"
 *
 *       type Props = {
 *         productId: string
 *       }
 *
 *       const Product = ({ productId }: Props) => {
 *         const deleteProduct = useAdminDeleteProduct(
 *           productId
 *         )
 *         // ...
 *
 *         const handleDelete = () => {
 *           deleteProduct.mutate(void 0, {
 *             onSuccess: ({ id, object, deleted}) => {
 *               console.log(id)
 *             }
 *           })
 *         }
 *
 *         // ...
 *       }
 *
 *       export default Product
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X DELETE '{backend_url}/admin/products/{id}' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Products
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminProductsDeleteRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const { id } = req.params

  const productService: ProductService = req.scope.resolve("productService")
  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await productService.withTransaction(transactionManager).delete(id)
  })

  res.json({
    id,
    object: "product",
    deleted: true,
  })
}
