import { Address } from "./domain/entity/address";
import { Customer } from "./domain/entity/customer";

let customer = new Customer("123", "Thayerres Scarpini")
const address = new Address("Rua dois", 2 , "21721-060", "Rio de Janeiro")
customer.Address = address
customer.activate()

// const item1 = new OrderItem("1", "Item 1", 10)
// const item2 = new OrderItem("2", "Item 2", 15)
// const order = new Order("1", "123", [item1,item2])
