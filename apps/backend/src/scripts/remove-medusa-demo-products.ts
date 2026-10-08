/**
 *   npx medusa exec ./src/scripts/remove-medusa-demo-products.ts
 */
import {
  deleteProductCategoriesWorkflow,
  deleteProductOptionsWorkflow,
  deleteProductsWorkflow,
} from '@medusajs/medusa/core-flows'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'
import type { ExecArgs } from '@medusajs/framework/types'

const DEMO_PRODUCT_HANDLES = ['t-shirt', 'sweatshirt', 'sweatpants', 'shorts']
const DEMO_CATEGORY_NAMES = ['Shirts', 'Sweatshirts', 'Pants', 'Merch']
const DEMO_OPTION_TITLES = ['Size', 'Color']

export default async function removeMedusaDemoProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: products } = await query.graph({
    entity: 'product',
    fields: ['id'],
    filters: { handle: DEMO_PRODUCT_HANDLES },
  })

  if (products.length) {
    await deleteProductsWorkflow(container).run({
      input: { ids: products.map((product) => product.id as string) },
    })
  }
  logger.info(`Deleted ${products.length} demo product(s)`)

  const { data: categories } = await query.graph({
    entity: 'product_category',
    fields: ['id'],
    filters: { name: DEMO_CATEGORY_NAMES },
  })

  if (categories.length) {
    await deleteProductCategoriesWorkflow(container).run({
      input: categories.map((category) => category.id as string),
    })
  }
  logger.info(`Deleted ${categories.length} demo categories`)

  const { data: options } = await query.graph({
    entity: 'product_option',
    fields: ['id'],
    filters: { title: DEMO_OPTION_TITLES, is_exclusive: false },
  })

  if (options.length) {
    await deleteProductOptionsWorkflow(container).run({
      input: { ids: options.map((option) => option.id as string) },
    })
  }
  logger.info(`Deleted ${options.length} shared demo option(s)`)
}
