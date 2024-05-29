from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
# from sqlalchemy.sql import func
# from datetime import datetime
from config import db, bcrypt
import json

from search import SearchableMixin

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = (
        '-_password_hash',
        '-seller.user',
        '-seller.items.category',
        '-seller.items.seller',
        '-seller.items.cart_items',
        '-seller.items.order_items.order.customer',
        '-seller.items.order_items.order.order_items',
        '-seller.items.order_items.item',
        '-seller.items.reviews',
        '-customer.user',
        '-customer.cart_items.item.category',
        '-customer.cart_items.item.seller',
        '-customer.cart_items.item.cart_items',
        '-customer.cart_items.item.order_items',
        '-customer.cart_items.item.reviews',
        '-customer.cart_items.customer',
        '-customer.orders.customer',
        '-customer.orders.order_items.order',
        '-customer.orders.order_items.item.category',
        '-customer.orders.order_items.item.seller',
        '-customer.orders.order_items.item.cart_items',
        '-customer.orders.order_items.item.order_items',
        '-customer.orders.order_items.item.reviews',
        '-customer.reviews.item.category',
        '-customer.reviews.item.seller',
        '-customer.reviews.item.cart_items',
        '-customer.reviews.item.order_items',
        '-customer.reviews.item.reviews',
        '-customer.reviews.customer',
    )

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)
    email = db.Column(db.String)
    phone = db.Column(db.String)
    street_1 = db.Column(db.String)
    street_2 = db.Column(db.String)
    city = db.Column(db.String)
    state = db.Column(db.String)
    zip_code = db.Column(db.String)

    seller = db.relationship('Seller', back_populates='user', uselist=False)
    customer = db.relationship('Customer', back_populates='user', uselist=False)

    @hybrid_property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        print('in models authenticate func, password: ', password)
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    def __repr__(self):
        return f'<User {self.id}>'


class Seller(db.Model, SerializerMixin):
    __tablename__ = 'sellers'

    serialize_rules = (
        '-user',
        '-items',
    )

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    user = db.relationship('User', back_populates='seller')
    items = db.relationship('Item', back_populates='seller', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Seller {self.id}>'


class Customer(db.Model, SerializerMixin):
    __tablename__ = 'customers'

    serialize_rules = (
        '-user',
        '-cart_items',
        '-orders',
        '-reviews',
    )

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    mobile = db.Column(db.String)
    nickname = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    user = db.relationship('User', back_populates='customer')
    cart_items = db.relationship('CartItem', back_populates='customer', cascade='all, delete-orphan')
    orders = db.relationship('Order', back_populates='customer', cascade='all, delete-orphan')
    reviews = db.relationship('Review', back_populates='customer', cascade='all, delete-orphan')

    items_thru_cart = association_proxy('cart_items', 'item',
                        creator=lambda item_obj: CartItem(item=iem_obj))

    def __repr__(self):
        return f'<Customer {self.id}>'


class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Integer, unique=True, nullable=False)

    items = db.relationship('Item', back_populates='category', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Category {self.id}>'


class Item(db.Model, SerializerMixin, SearchableMixin):
    __tablename__ = 'items'
    __searchable__ = ['name', 'details_2', ]

    serialize_rules = (
        '-category',
        '-seller',
        '-cart_items',
        '-order_items',
        '-reviews',
    )

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    brand = db.Column(db.String)
    default_item_idx = db.Column(db.Integer, nullable=False)
    prices = db.Column(db.String)   # list: price by package type
    discount_prices = db.Column(db.String)  # list: discount price by package type
    amounts = db.Column(db.String)    # list: amount by package type
    units = db.Column(db.String)    # list: unit by package type
    packs = db.Column(db.String)    # list: package type
    about_item = db.Column(db.String)   # object: item characteristics
    details_1 = db.Column(db.String)    # object: item details
    details_2 = db.Column(db.String)    # object: item details
    card_thumbnail = db.Column(db.String)
    thumbnails = db.Column(db.String)   # list:
    images = db.Column(db.String)   # list:
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    seller_id = db.Column(db.Integer, db.ForeignKey('sellers.id'))

    category = db.relationship('Category', back_populates='items')
    seller = db.relationship('Seller', back_populates='items')
    cart_items = db.relationship('CartItem', back_populates='item', cascade='all, delete-orphan')
    order_items = db.relationship('OrderItem', back_populates='item', cascade='all, delete-orphan')
    reviews = db.relationship('Review', back_populates='item', cascade='all, delete-orphan')

    customers_thru_cart = association_proxy('cart_items', 'customer',
                            creator=lambda customer_obj : CartItem(customer=customer_obj))

    def __repr__(self):
        return f'<Item {self.id}>'


class CartItem(db.Model, SerializerMixin):
    __tablename__ = 'cart_items'

    serialize_rules = (
        '-item.category',
        '-item.seller',
        '-item.cart_items',
        '-customer',
    )

    id = db.Column(db.Integer, primary_key=True)
    checked = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    item_idx = db.Column(db.Integer, nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'))
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'))

    item = db.relationship('Item', back_populates='cart_items')
    customer = db.relationship('Customer', back_populates='cart_items')

    def __repr__(self):
        return f'<CartItem {self.id}>'


class OrderItem(db.Model, SerializerMixin):
    __tablename__ = 'order_items'

    serialize_rules = (
        '-order',
        '-item',
    )

    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    item_idx = db.Column(db.Integer, nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'))
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))

    # relationship
    order = db.relationship('Order', back_populates='order_items')
    item = db.relationship('Item', back_populates='order_items')

    # association proxy may be needed later
    # from Order model class to Item model class and vice versa

    def __repr__(self):
        return f'<OrderItem {self.id}>'


class Order(db.Model, SerializerMixin):
    __tablename__ = 'orders'

    serialize_rules = (
        '-customer',
        'order_items',
    )

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    # date = db.Column(db.Integer, nullable=False, server_default=func.now())
    # date = db.Column(db.Integer, nullable=False, server_default=datetime.now().strftime('%s'))
    street_1 = db.Column(db.String)
    street_2 = db.Column(db.String)
    city = db.Column(db.String)
    state = db.Column(db.String)
    zip_code = db.Column(db.String)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'))

    # relationship
    customer = db.relationship('Customer', back_populates='orders')
    order_items = db.relationship('OrderItem', back_populates='order', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Order {self.id}>'
    

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    serialize_rules = (
        '-item.category',
        '-item.seller',
        '-item.cart_items',
        '-item.order_items',
        '-item.reviews',
        '-customer.user', 
        '-customer.cart_items', 
        '-customer.cart_items', 
        '-customer.reviews', 
    )

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    rating = db.Column(db.Integer, nullable=False) # ??? it must be 0 <=  <= 5. Add it to constraints and validates.
    headline = db.Column(db.String)
    content = db.Column(db.String)
    images = db.Column(db.String) # ??? need to implement it later.
    review_done = db.Column(db.Integer)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'))
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'))

    item = db.relationship('Item', back_populates='reviews')
    customer = db.relationship('Customer', back_populates='reviews')

    def __repr__(self):
        return f'<Review {self.id}>'
