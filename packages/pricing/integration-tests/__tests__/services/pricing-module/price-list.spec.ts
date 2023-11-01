import { SqlEntityManager } from "@mikro-orm/postgresql"

import { IPricingModuleService } from "@medusajs/types"
import { initialize } from "../../../../src"

import { createPriceLists } from "../../../__fixtures__/price-list"
import { DB_URL, MikroOrmWrapper } from "../../../utils"

jest.setTimeout(30000)

describe("PriceList Service", () => {
  let service: IPricingModuleService
  let testManager: SqlEntityManager

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    await MikroOrmWrapper.forkManager()

    service = await initialize({
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_PRICING_DB_SCHEMA,
      },
    })

    testManager = await MikroOrmWrapper.forkManager()
    await createPriceLists(testManager)
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("list", () => {
    it("list priceLists", async () => {
      const priceListResult = await service.listPriceLists()

      expect(priceListResult).toEqual([
        expect.objectContaining({
          id: "price-list-1",
        }),
        expect.objectContaining({
          id: "price-list-2",
        }),
      ])
    })

    it("list pricelists by id", async () => {
      const priceListResult = await service.listPriceLists({
        id: ["price-list-1"],
      })

      expect(priceListResult).toEqual([
        expect.objectContaining({
          id: "price-list-1",
        }),
      ])
    })
  })

  describe("listAndCount", () => {
    it("should return pricelists and count", async () => {
      const [priceListResult, count] = await service.listAndCountPriceLists()

      expect(count).toEqual(2)
      expect(priceListResult).toEqual([
        expect.objectContaining({
          id: "price-list-1",
        }),
        expect.objectContaining({
          id: "price-list-2",
        }),
      ])
    })

    it("should return pricelists and count when filtered", async () => {
      const [priceListResult, count] = await service.listAndCountPriceLists({
        id: ["price-list-1"],
      })

      expect(count).toEqual(1)
      expect(priceListResult).toEqual([
        expect.objectContaining({
          id: "price-list-1",
        }),
      ])
    })

    it("should return pricelists and count when using skip and take", async () => {
      const [priceListResult, count] = await service.listAndCountPriceLists(
        {},
        { skip: 1, take: 1 }
      )

      expect(count).toEqual(2)
      expect(priceListResult).toEqual([
        expect.objectContaining({
          id: "price-list-2",
        }),
      ])
    })

    it("should return requested fields", async () => {
      const [priceListResult, count] = await service.listAndCountPriceLists(
        {},
        {
          take: 1,
          select: ["id"],
        }
      )

      const serialized = JSON.parse(JSON.stringify(priceListResult))

      expect(count).toEqual(2)
      expect(serialized).toEqual([
        {
          id: "price-list-1",
        },
      ])
    })
  })

  describe("retrieve", () => {
    const id = "price-list-1"

    it("should return priceList for the given id", async () => {
      const priceListResult = await service.retrievePriceList(id)

      expect(priceListResult).toEqual(
        expect.objectContaining({
          id,
        })
      )
    })

    it("should throw an error when priceList with id does not exist", async () => {
      let error

      try {
        await service.retrievePriceList("does-not-exist")
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        "PriceList with id: does-not-exist was not found"
      )
    })

    it("should throw an error when a id is not provided", async () => {
      let error

      try {
        await service.retrievePriceList(undefined as unknown as string)
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('"priceListId" must be defined')
    })
  })

  describe("delete", () => {
    const id = "price-list-1"

    it("should delete the pricelists given an id successfully", async () => {
      await service.deletePriceLists([id])

      const priceListResult = await service.listPriceLists({
        id: [id],
      })

      expect(priceListResult).toHaveLength(0)
    })
  })

  describe("update", () => {
    const id = "price-list-2"

    it("should update the starts_at date of the priceList successfully", async () => {
      const updateDate = new Date()
      await service.updatePriceLists([
        {
          id,
          starts_at: updateDate,
          rules: [],
        },
      ])

      const priceList = await service.retrievePriceList(id)

      expect(priceList.starts_at).toEqual(updateDate)
    })

    it("should throw an error when a id does not exist", async () => {
      let error

      try {
        await service.updatePriceLists([
          {
            id: "does-not-exist",
            number_rules: 2,
            rules: [],
          },
        ])
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        'PriceList with id "does-not-exist" not found'
      )
    })
  })

  describe.only("create", () => {
    it("should create a priceList successfully", async () => {
      const [created] = await service.createPriceLists([
        {
          starts_at: "10/01/2023" as unknown as Date,
          ends_at: "10/30/2023" as unknown as Date,
          rules: {
            customer_group_id: [
              "vip-customer-group-id",
              "another-vip-customer-group-id",
            ],
            region_id: ["DE", "DK"],
          },
          prices: [
            {
              amount: 400,
              currency_code: "EUR",
              price_set_id: "price-set-PLN",
            },
          ],
        },
      ])
      console.log("created - ", created)
      const [priceList] = await service.listPriceLists(
        {
          id: [created.id],
        },
        {
          relations: [
            "price_set_money_amounts.money_amount",
            "price_set_money_amounts.price_set",
            "rules",
          ],
        }
      )

      console.log("priceList - ", priceList)
      // expect(priceList.number_rules).toEqual(4)
    })
  })
})