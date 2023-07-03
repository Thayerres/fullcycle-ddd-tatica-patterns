import { Order } from "../../domain/entity/order";
import { OrderItem } from "../../domain/entity/order_item";
import { OrderRepositoryInterface } from "../../domain/repository/order-repository.interface";
import { OrderModel } from "../db/sequelize/model/order.model";
import { OrderItemModel } from "../db/sequelize/model/order_item.model";

export class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create({
      id:entity.id,
      customer_id: entity.customerId,
      total: entity.total(),
      items: entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,

      }))
    }, {
      include: [{ model: OrderItemModel }]
    })
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update({
      id:entity.id,
      customer_id: entity.customerId,
      total: entity.total(),
    }, {
      where: {id: entity.id}
    })

    OrderItemModel.destroy({
      where: {order_id: entity.id}
    })

    entity.items.forEach(async (item) => {
      await OrderItemModel.create({
        id:item.id,
        order_id: entity.id,
        product_id: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })
    })
  }

  async find(id: string): Promise<Order> {
    let orderModel
    try {
      orderModel = await OrderModel.findOne({ 
       where: { id: id },
       include: ["items"],
       rejectOnEmpty: true
     })
    } catch (error) {
      throw new Error("Order not found!");
    }
    
    const orderItems = orderModel.items.map((item) => {
      return new OrderItem(item.id,item.name,item.price,item.product_id,item.quantity)
    })
    const order = new Order(orderModel.id,orderModel.customer_id,orderItems)
    
    return order
  }

  async findAll(): Promise<Order[]> {
    const orderModel = await OrderModel.findAll({include:["items"]})

    const orders = orderModel.map((order) => {
      const orderItems = order.items.map((item) => {
        return new OrderItem(item.id,item.name,item.price,item.product_id,item.quantity)
      })

      return new Order(order.id,order.customer_id,orderItems)
    })
    
    return orders
  }
}