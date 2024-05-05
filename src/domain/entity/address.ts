export class Address{

  private _street: string
  private _number: number
  private _zip: string
  private _city: string

  constructor(street: string,number: number,zip: string,city: string){
    this._street = street
    this._number = number
    this._zip = zip
    this._city = city

    this.validate()
  }

  get street(): string {
    return this._street
  }
  get number(): number {
    return this._number
  }
  get zip(): string {
    return this._zip
  }
  get city(): string {
    return this._city
  }

  validate() {
    if(this._street.length === 0){
      throw new Error("Street is required")
    }
  }
}