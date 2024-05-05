import { Order } from "./order"
import { OrderItem } from "./order_item"

describe("Order unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let order = new Order("", "123", [])
    }).toThrowError("Id is required")
  })

  it("should throw error when customerId is empty", () => {
    expect(() => {
      let order = new Order("1", "", [])
    }).toThrowError("CustomerId is required")
  })

  it("should throw error when items is empty", () => {
    expect(() => {
      let order = new Order("1", "123", [])
    }).toThrowError("Items are required")
  })

  it("should throw error if the item qte is less or equal zero", () => {
    expect(() => {
      const item = new OrderItem("1", "Item 1", 10, "p1", 0)
      const order = new Order("1", "123", [item])
    }).toThrowError("Quantity must be greater than 0")
  })

  it("should calculate total", () => {
    const item = new OrderItem("1", "Item 1", 10, "p1", 2)
    const order = new Order("1", "123", [item])
    const total = order.total()

    expect(total).toBe(20)
  })
})