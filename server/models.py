from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from config import db, bcrypt
import json

from search import SearchableMixin

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = (
        '-_password_hash',
        '-seller.user',
        '-seller.items',
        '-customer.user',
        '-customer.cart_items.item.category',
        '-customer.cart_items.item.seller',
        '-customer.cart_items.item.cart_items',
        '-customer.cart_items.customer',
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
    )

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    mobile = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    user = db.relationship('User', back_populates='customer')
    cart_items = db.relationship('CartItem', back_populates='customer', cascade='all, delete-orphan')

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





