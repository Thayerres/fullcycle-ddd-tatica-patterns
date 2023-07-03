import { Address } from "./address"
import { Customer } from "./customer"

describe("Customer unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      const customer = new Customer("","John")
    }).toThrowError("Id is required")
  })

  it("should throw error when name is empty", () => {
    expect(() => {
      const customer = new Customer("123","")
    }).toThrowError("Name is required")
  })

  it("should change name", () => {
    const customer = new Customer("123","Thayerres")
    customer.changeName("John")
    expect(customer.name).toEqual("John")
  })

  it("should activate customer", () => {
    const customer = new Customer("123","Thayerres")
    const address = new Address("Rua dois", 2 , "21721-060", "Rio de Janeiro")
    customer.Address = address
    customer.activate()
    
    expect(customer.isActive()).toBe(true)
  })

  it("should deactivate customer", () => {
    const customer = new Customer("123","Thayerres")
    customer.deactivate()
    
    expect(customer.isActive()).toBe(false)
  })

  it("should throw error when address is undefined when tou activate a customer ", () => {
    const customer = new Customer("123","Thayerres")
    expect(() => {
      customer.activate()
    }).toThrowError("Address is mandatory to activate a customer")
  })

  it("should add reward points", () => {
    const customer = new Customer("1","Customer 1")
    expect(customer.rewardPoints).toBe(0)

    customer.addRewardPoints(10)
    expect(customer.rewardPoints).toBe(10)

    customer.addRewardPoints(10)
    expect(customer.rewardPoints).toBe(20)
  })
})