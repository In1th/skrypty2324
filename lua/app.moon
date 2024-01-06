lapis = require "lapis"
import Model from require "lapis.db.model"
import respond_to from require "lapis.application"

class Products extends Model
  @primary_key: "id"

class extends lapis.Application
  [get_products: "/products"]: =>
    json: {products: Products\select}

  [get_products_by_cat: "/products/:cat"]: =>
    json {products: Products\select "where category == ?", @params.cat}
  
  [new_product: "/product/new"]: =>
    return status: 404 unless @params.name or @params.price or @params.quantity
    product = Products\create {
      name: @params.name,
      price: @params.price,
      quantity: @params.quantity
    }
    json: {id: product.id}

  [modify_specific_product: '/product/:id']: respond_to {
    GET: =>
      json: {product: Products\find @params.id}
    DELETE: =>
      product = Products\find @params.id
      product\delete!
      json: {msg: "Succesfully deleted #{@params.id}"}
    POST: =>
      product = Products\find @params.id
      product\update name: @params.name unless @params.name
      product\update price: @params.price unless @params.price
      product\update quantity: @params.quantity unless @params.quantity
  }
