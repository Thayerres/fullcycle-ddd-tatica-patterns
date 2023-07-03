import { Sequelize } from "sequelize-typescript"
import { Address } from "../../domain/entity/address"
import { Customer } from "../../domain/entity/customer"
import { Order } from "../../domain/entity/order"
import { OrderItem } from "../../domain/entity/order_item"
import { Product } from "../../domain/entity/product"
import { CustomerModel } from "../db/sequelize/model/customer.model"
import { OrderModel } from "../db/sequelize/model/order.model"
import { OrderItemModel } from "../db/sequelize/model/order_item.model"
import { ProductModel } from "../db/sequelize/model/product.model"
import { CustomerRepository } from "./customer.repository"
import { OrderRepository } from "./order.repository"
import { ProductRepository } from "./product.repository"

describe("Order repository tests", () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    })
    sequelize.addModels([CustomerModel,OrderModel,OrderItemModel,ProductModel])
    await sequelize.sync()
  })


  afterEach(async () => {
    await sequelize.close()
  })

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer("123","Customer 1")
    const address = new Address("Street 1", 123, "Zipcode 1", "City 1")
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product("123", "Product 1", 10)
    await productRepository.create(product)

    const orderItem = new OrderItem("1", product.name, product.price,product.id,2)
    const order = new Order("123", customer.id,[orderItem])

    const orderRespository = new OrderRepository()
    await orderRespository.create(order)

    const orderModel = await OrderModel.findOne({ 
      where: { id: order.id },
      include: ["items"],
    })

    expect(orderModel?.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: order.id,
          product_id: product.id
        }
      ]
    })
  })

  it("should update order", async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer("123","Customer 1")
    const address = new Address("Street 1", 123, "Zipcode 1", "City 1")
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product("123", "Product 1", 10)
    await productRepository.create(product)

    const orderItem = new OrderItem("1", product.name, product.price,product.id,2)
    const order = new Order("123", customer.id,[orderItem])

    const orderRespository = new OrderRepository()
    await orderRespository.create(order)

    const newOrderItem = new OrderItem("2", product.name, product.price, product.id,2)
    order.changeItems(newOrderItem)

    await orderRespository.update(order)

    const orderModel = await OrderModel.findOne({ 
      where: { id: order.id },
      include: ["items"],
    })
        
    expect(orderModel?.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: order.total(),
      items: order.items.map((item) => {
        return {
          id: item.id,
          product_id: item.productId,
          name: item.name,
          order_id: order.id,
          quantity: item.quantity,
          price: item.price
      }
      })
    })
  })

  it("should find one order", async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer("123","Customer 1")
    const address = new Address("Street 1", 123, "Zipcode 1", "City 1")
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product("123", "Product 1", 10)
    await productRepository.create(product)

    const orderItem = new OrderItem("1", product.name, product.price,product.id,2)
    const order = new Order("123", customer.id,[orderItem])

    const orderRespository = new OrderRepository()
    await orderRespository.create(order)

    const orderModel = await OrderModel.findOne({ 
      where: { id: order.id },
      include: ["items"],
    })

    const findOrderModel = await orderRespository.find(order.id)

    expect(orderModel?.toJSON()).toStrictEqual({
      id: findOrderModel.id,
      customer_id: findOrderModel.customerId,
      total: findOrderModel.total(),
      items: findOrderModel.items.map((item) => {
        return {
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              order_id: findOrderModel.id,
              product_id: item.productId
            }
      })
    })
  })

  it("should throw an error when order is not found", async () => {
    const orderRespository = new OrderRepository();

    expect(async () => {
      await orderRespository.find("456ABC")
    }).rejects.toThrow("Order not found!")
  })

  it("should find all order", async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer("123","Customer 1")
    const customer2 = new Customer("321","Customer 2")
    const address = new Address("Street 1", 123, "Zipcode 1", "City 1")
    customer.changeAddress(address)
    customer2.changeAddress(address)
    await customerRepository.create(customer)
    await customerRepository.create(customer2)

    const productRepository = new ProductRepository()
    const product = new Product("123", "Product 1", 10)
    await productRepository.create(product)
    
    const orderRespository = new OrderRepository()
    
    const orderItem = new OrderItem("1", product.name, product.price,product.id,2)
    const order1 = new Order("1", customer.id,[orderItem])
    await orderRespository.create(order1)
    
    const orderItem2 = new OrderItem("2", product.name, product.price,product.id,2)
    const order2 = new Order("2", customer2.id,[orderItem2])
    await orderRespository.create(order2)

    const orders = [order1,order2]

    const findAllOrders = await orderRespository.findAll()

    expect(orders).toEqual(findAllOrders)
  })
})