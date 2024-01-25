#! /usr/bin/env ruby

require 'nokogiri'
require 'open-uri'

# require 'sqlite3'
# db = SQLite3::Database.new('books.db')

puts "Fetching books..."

baseUrl = 'https://www.empik.com/'

searchStr = '' # REPLACE THIS

url = "#{baseUrl}ksiazki,31,s?hideUnavailable=false"

if searchStr != ''
    url = "#{url}&q=#{searchStr.gsub(' ', '%20')}&qtype=basicForm"
end

doc = Nokogiri::HTML(URI.open(url))

books = []

class Book
    attr_accessor\
        :title, :price, :categories,
        :id, :link, :rank, :noOfPages,
        :publisher, :released,
        :description

    def initialize()
        @id = ""
        @title = ""
        @price = ""
        @categories = []
        @link = ""
        @rank = 0.0
        @noOfPages = 0
        @publisher = ""
        @released = ""
        @description = ""
    end

    def to_s
        "book: #{@description}"
    end
end

doc.css('div.search-list-item').each do |item|
    book = Book.new()
    item.attributes.each do |name, value|
        case name
        when "data-product-id"
            book.id = value
        when "data-product-name"
            book.title = value
        when "data-product-price"
            book.price = value
        when "data-product-category"
            book.categories = value.to_s.split('/')
        end
    end

    link = item.css('a')[0]

    book.link = "#{baseUrl}#{link.attributes['href']}"
    subpage = Nokogiri::HTML(URI.open(book.link))

    subpage.css('span.css-1p6necc-score').each do |elem|
        book.rank = elem.content.to_f
        break
    end

    desc = ""
    subpage.css('div[data-ta="description-folded-up"] p').each do |elem|
        desc += "#{elem.content} "
    end

    book.description = desc

    metadata = subpage.css('table.css-1u4viw7-table tbody tr')
    book.publisher = metadata[4].css('a')[0].content
    book.noOfPages = metadata[7].css('div.detailed-data-text-value')[0].content.to_i
    book.released = metadata[9].css('div.detailed-data-text-value')[0].content

    books.push(book)
    # break
end

puts "Fetching books... Done."

# puts books[0]

puts "Saving books..."

for books.each do |book|
    db.execute("
        insert into Books
        (id, title, price, score, categories, link, pages, publisher, released, description)
        values (?,?,?,?,?,?,?,?,?,?)
        on conflict(id) do update set
            title=excluded.title,
            price=excluded.price,
            score=excluded.score,
            categories=excluded.categories,
            link=excluded.link,
            pages=excluded.pages,
            publisher=excluded.publisher,
            released=excluded.released,
            description=excluded.description,
    ",
    [book.id, book.title, book.price, book.score, book.categories, book.link, book.pages, book.publisher, book.released, book.description])
end

puts "Saving books... Done."
