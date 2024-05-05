import { v4 as uuid } from 'uuid';
import { Customer } from "../entity/customer";
import { Order } from "../entity/order";
import { OrderItem } from "../entity/order_item";

export class OrderService {
  static total(orders:Order[]): number{
    const totalOrder = orders.reduce((acc,order) => acc + order.total(), 0)
    return totalOrder
  }

  static placeOrder(customer:Customer, items: OrderItem[]): Order {
    if(items.length === 0){
      throw new Error("Order must have at least one item");
    }

    const order = new Order(uuid(),customer.id, items)
    const points = order.total() / 2
    customer.addRewardPoints(points)

    return order
  }
}