lapis = require "lapis"
import Model from require "lapis.db.model"
import respond_to, capture_errors from require "lapis.application"

class Products extends Model

class extends lapis.Application
  [read_products: "/products"]: =>
    Products\select!

  [new_product: "/product/new"]: =>
    "HI!"

  [product: "/product/:id"]: respond_to {
    POST: capture_errors =>
      "HI!"
    
    DELETE: =>
      "HI!"

  }