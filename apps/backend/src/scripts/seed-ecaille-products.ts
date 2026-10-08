/**
 *   npx medusa exec ./src/scripts/seed-ecaille-products.ts
 */
import {
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductOptionsWorkflow,
  createProductsWorkflow,
  updateProductsWorkflow,
  updateShippingOptionsWorkflow,
} from '@medusajs/medusa/core-flows'
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
  ProductStatus,
} from '@medusajs/framework/utils'
import type { ExecArgs } from '@medusajs/framework/types'

const FORMAT_OPTION = {
  title: 'Format',
  values: ['1 boîte', 'Lot de 3', 'Coffret'],
}

const CATEGORIES = ['Sardines', 'Maquereau', 'Thon', 'Rillettes', 'Coffrets']

const COLLECTIONS = [
  { title: 'Millésime 2024', handle: 'millesime-2024' },
  { title: 'Les classiques', handle: 'classiques' },
  { title: 'Coffrets cadeaux', handle: 'coffrets-cadeaux' },
]

const SHIPPING_OPTION_NAMES: Record<string, string> = {
  'Standard Shipping': 'Livraison standard',
  'Express Shipping': 'Livraison express',
}

const USD_RATE = 1.1
const LOT_DISCOUNT = 0.9
const STOCK_PER_VARIANT = 500

type TinnedProduct = {
  handle: string
  tin: 'outremer' | 'citron' | 'piment' | 'algue' | 'sardine'
  title: string
  description: string
  category: string
  collection: string
  weight: number
  price: number
  port: string
  lot: string
  ddm: string
  isGiftBox?: boolean
}

const PRODUCTS: TinnedProduct[] = [
  {
    handle: 'sardines-millesimees-2024',
    tin: 'outremer',
    title: "Sardines millésimées à l'huile d'olive",
    description:
      "Sardines pêchées à la bolinche au large de Belle-Île en mai 2024, étêtées à la main et mises en boîte crues dans une huile d'olive vierge extra. Elles s'affinent dans la boîte : à ouvrir dès maintenant ou dans cinq ans.",
    category: 'Sardines',
    collection: 'Millésime 2024',
    weight: 115,
    price: 9.8,
    port: 'Quiberon',
    lot: '24-117',
    ddm: '12/2029',
  },
  {
    handle: 'sardines-citron-poivre',
    tin: 'citron',
    title: 'Sardines au citron et poivre noir',
    description:
      "Sardines entières à l'huile d'olive, relevées d'un zeste de citron de Menton et de poivre noir concassé. La boîte d'apéritif par excellence.",
    category: 'Sardines',
    collection: 'Les classiques',
    weight: 115,
    price: 7.9,
    port: 'Quiberon',
    lot: '24-142',
    ddm: '06/2029',
  },
  {
    handle: 'sardinettes-piment-espelette',
    tin: 'piment',
    title: "Sardinettes au piment d'Espelette",
    description:
      "Petites sardines de début de saison, plus fines et plus tendres, au piment d'Espelette AOP. Une chaleur douce qui monte en fin de bouche.",
    category: 'Sardines',
    collection: 'Millésime 2024',
    weight: 100,
    price: 10.5,
    port: 'Saint-Gilles-Croix-de-Vie',
    lot: '24-098',
    ddm: '09/2029',
  },
  {
    handle: 'maquereau-citron-confit-timut',
    tin: 'algue',
    title: 'Filets de maquereau, citron confit et timut',
    description:
      "Filets de maquereau de ligne marinés au vin blanc, citron confit et baies de timut. Acidulé, légèrement pamplemousse, à poser sur une tartine de pain de seigle.",
    category: 'Maquereau',
    collection: 'Les classiques',
    weight: 118,
    price: 8.5,
    port: 'Lorient',
    lot: '24-203',
    ddm: '03/2028',
  },
  {
    handle: 'maquereau-moutarde-ancienne',
    tin: 'citron',
    title: "Filets de maquereau à la moutarde à l'ancienne",
    description:
      "Filets de maquereau nappés d'une sauce à la moutarde en grains et au cidre brut. Un classique de conserverie bretonne, à servir tiède sur des pommes de terre.",
    category: 'Maquereau',
    collection: 'Les classiques',
    weight: 118,
    price: 6.9,
    port: 'Lorient',
    lot: '24-188',
    ddm: '02/2028',
  },
  {
    handle: 'ventreche-thon-germon',
    tin: 'sardine',
    title: 'Ventrèche de thon germon',
    description:
      "La partie la plus fondante du thon germon, pêché à la canne dans le golfe de Gascogne. Conservée simplement à l'huile d'olive, à déguster sans rien d'autre.",
    category: 'Thon',
    collection: 'Millésime 2024',
    weight: 160,
    price: 14.9,
    port: 'Saint-Jean-de-Luz',
    lot: '24-088',
    ddm: '11/2029',
  },
  {
    handle: 'thon-germon-naturel',
    tin: 'outremer',
    title: 'Thon germon au naturel',
    description:
      "Longe de thon germon cuite dans son jus, sans huile ajoutée. Pour les salades, les sandwichs et tous ceux qui préfèrent le goût du poisson seul.",
    category: 'Thon',
    collection: 'Les classiques',
    weight: 160,
    price: 8.9,
    port: 'Saint-Jean-de-Luz',
    lot: '24-121',
    ddm: '08/2029',
  },
  {
    handle: 'rillettes-sardine-espelette',
    tin: 'piment',
    title: "Rillettes de sardine au piment d'Espelette",
    description:
      "Sardines émiettées avec du beurre demi-sel, du fromage frais et une pointe de piment d'Espelette. À tartiner à l'apéritif.",
    category: 'Rillettes',
    collection: 'Les classiques',
    weight: 90,
    price: 6.9,
    port: 'Quiberon',
    lot: '24-131',
    ddm: '01/2027',
  },
  {
    handle: 'rillettes-maquereau-algues',
    tin: 'algue',
    title: 'Rillettes de maquereau aux algues',
    description:
      "Maquereau, laitue de mer et dulse de Bretagne, liés au fromage frais. Iodé, frais, très vert.",
    category: 'Rillettes',
    collection: 'Les classiques',
    weight: 90,
    price: 6.5,
    port: 'Lorient',
    lot: '24-176',
    ddm: '12/2026',
  },
  {
    handle: 'coffret-degustation-6',
    tin: 'outremer',
    title: 'Coffret dégustation, 6 boîtes',
    description:
      "Les six boîtes pour découvrir la conserverie : sardines millésimées, sardines citron, maquereau timut, ventrèche de germon et deux rillettes. Livré dans un coffret en carton recyclé.",
    category: 'Coffrets',
    collection: 'Coffrets cadeaux',
    weight: 714,
    price: 54,
    port: 'Quiberon',
    lot: 'CF-24',
    ddm: '12/2026',
    isGiftBox: true,
  },
  {
    handle: 'coffret-millesime-2024',
    tin: 'citron',
    title: 'Coffret Millésime 2024, 3 boîtes',
    description:
      "Les trois références millésimées de l'année dans un coffret numéroté : sardines à l'huile d'olive, sardinettes au piment et ventrèche de germon.",
    category: 'Coffrets',
    collection: 'Coffrets cadeaux',
    weight: 375,
    price: 36,
    port: 'Quiberon',
    lot: 'CM-24',
    ddm: '09/2029',
    isGiftBox: true,
  },
]

const toMetadata = (product: TinnedProduct) => ({
  port: product.port,
  lot: product.lot,
  ddm: product.ddm,
  tin: product.tin,
})

const roundPrice = (amount: number) => Math.round(amount * 10) / 10

const toPrices = (eur: number, currencyCodes: string[]) =>
  currencyCodes.map((currency_code) => ({
    currency_code,
    amount: currency_code === 'eur' ? eur : roundPrice(eur * USD_RATE),
  }))

export default async function seedEcailleProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const [{ data: salesChannels }, { data: shippingProfiles }, { data: stockLocations }, { data: stores }] =
    await Promise.all([
      query.graph({ entity: 'sales_channel', fields: ['id', 'name'] }),
      query.graph({ entity: 'shipping_profile', fields: ['id'] }),
      query.graph({ entity: 'stock_location', fields: ['id'] }),
      query.graph({ entity: 'store', fields: ['id', 'supported_currencies.currency_code'] }),
    ])

  const salesChannel = salesChannels[0]
  const shippingProfile = shippingProfiles[0]
  const stockLocation = stockLocations[0]

  if (!salesChannel || !shippingProfile || !stockLocation) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      'No sales channel, shipping profile or stock location found. Run the initial data seed first.'
    )
  }

  const currencyCodes = (stores[0]?.supported_currencies ?? [])
    .map((currency) => currency?.currency_code)
    .filter((code): code is string => Boolean(code))

  const { data: existingCategories } = await query.graph({
    entity: 'product_category',
    fields: ['id', 'name'],
  })
  const missingCategories = CATEGORIES.filter(
    (name) => !existingCategories.some((category) => category.name === name)
  )

  if (missingCategories.length) {
    await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missingCategories.map((name) => ({ name, is_active: true })),
      },
    })
    logger.info(`Created ${missingCategories.length} categories`)
  }

  const { data: existingCollections } = await query.graph({
    entity: 'product_collection',
    fields: ['id', 'handle'],
  })
  const missingCollections = COLLECTIONS.filter(
    (collection) => !existingCollections.some((existing) => existing.handle === collection.handle)
  )

  if (missingCollections.length) {
    await createCollectionsWorkflow(container).run({
      input: { collections: missingCollections },
    })
    logger.info(`Created ${missingCollections.length} collection(s)`)
  }

  const { data: existingOptions } = await query.graph({
    entity: 'product_option',
    fields: ['id', 'title'],
    filters: { is_exclusive: false },
  })

  if (!existingOptions.some((option) => option.title === FORMAT_OPTION.title)) {
    await createProductOptionsWorkflow(container).run({
      input: { product_options: [FORMAT_OPTION] },
    })
    logger.info('Created the shared "Format" option')
  }

  const [{ data: categories }, { data: collections }, { data: options }, { data: existingProducts }] =
    await Promise.all([
      query.graph({ entity: 'product_category', fields: ['id', 'name'] }),
      query.graph({ entity: 'product_collection', fields: ['id', 'title'] }),
      query.graph({
        entity: 'product_option',
        fields: ['id', 'title'],
        filters: { is_exclusive: false },
      }),
      query.graph({ entity: 'product', fields: ['id', 'handle'] }),
    ])

  const formatOption = options.find((option) => option.title === FORMAT_OPTION.title)!
  const takenHandles = new Set(existingProducts.map((product) => product.handle))
  const toCreate = PRODUCTS.filter((product) => !takenHandles.has(product.handle))

  const { data: shippingOptions } = await query.graph({
    entity: 'shipping_option',
    fields: ['id', 'name'],
  })
  const shippingOptionsToRename = shippingOptions.flatMap((option) => {
    const name = SHIPPING_OPTION_NAMES[option.name as string]
    return name ? [{ id: option.id as string, name }] : []
  })

  if (shippingOptionsToRename.length) {
    await updateShippingOptionsWorkflow(container).run({
      input: shippingOptionsToRename,
    })
    logger.info(`Renamed ${shippingOptionsToRename.length} shipping option(s) in French`)
  }

  const toUpdate = existingProducts.flatMap((existing) => {
    const product = PRODUCTS.find((candidate) => candidate.handle === existing.handle)
    return product ? [{ id: existing.id as string, metadata: toMetadata(product) }] : []
  })

  if (toUpdate.length) {
    await updateProductsWorkflow(container).run({
      input: { products: toUpdate },
    })
    logger.info(`Refreshed metadata on ${toUpdate.length} existing Écaille product(s)`)
  }

  if (!toCreate.length) {
    logger.info('Every Écaille product already exists. Nothing more to do.')
    return
  }

  const products = toCreate.map((product) => {
    const sku = product.handle.toUpperCase()
    const variants = product.isGiftBox
      ? [
          {
            title: 'Coffret',
            sku,
            weight: product.weight,
            options: { Format: 'Coffret' },
            prices: toPrices(product.price, currencyCodes),
          },
        ]
      : [
          {
            title: '1 boîte',
            sku: `${sku}-X1`,
            weight: product.weight,
            options: { Format: '1 boîte' },
            prices: toPrices(product.price, currencyCodes),
          },
          {
            title: 'Lot de 3',
            sku: `${sku}-X3`,
            weight: product.weight * 3,
            options: { Format: 'Lot de 3' },
            prices: toPrices(roundPrice(product.price * 3 * LOT_DISCOUNT), currencyCodes),
          },
        ]

    return {
      title: product.title,
      handle: product.handle,
      description: product.description,
      status: ProductStatus.PUBLISHED,
      weight: product.weight,
      origin_country: 'fr',
      metadata: toMetadata(product),
      shipping_profile_id: shippingProfile.id,
      collection_id: collections.find((collection) => collection.title === product.collection)?.id,
      category_ids: categories
        .filter((category) => category.name === product.category)
        .map((category) => category.id as string),
      sales_channels: [{ id: salesChannel.id }],
      options: [{ id: formatOption.id }],
      variants,
    }
  })

  await createProductsWorkflow(container).run({
    input: { products: products as never },
  })
  logger.info(`Created ${products.length} Écaille product(s)`)

  const skus = products.flatMap((product) => product.variants.map((variant) => variant.sku))
  const { data: inventoryItems } = await query.graph({
    entity: 'inventory_item',
    fields: ['id'],
    filters: { sku: skus },
  })

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryItems.map((item) => ({
        location_id: stockLocation.id,
        stocked_quantity: STOCK_PER_VARIANT,
        inventory_item_id: item.id,
      })),
    },
  })
  logger.info(`Stocked ${inventoryItems.length} variant(s)`)

  const { data: createdProducts } = await query.graph({
    entity: 'product',
    fields: ['id'],
    filters: { handle: toCreate.map((product) => product.handle) },
  })

  await container.resolve(Modules.SEARCH).ingest({
    name: 'product.created',
    data: createdProducts.map((product) => ({ id: product.id })),
  } as never)

  logger.info('Done. The Écaille catalogue is live on the storefront.')
}
