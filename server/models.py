from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates

from config import db, bcrypt
import json

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = (
        '-_password_hash',
        '-seller.user',
        '-seller.items',
        '-customer.user',
    )

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)
    phone = db.Column(db.String)
    email = db.Column(db.String)
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

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    user = db.relationship('User', back_populates='seller')
    items = db.relationship('Item', back_populates='seller', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Seller {self.id}>'
    

class Customer(db.Model, SerializerMixin):
    __tablename__ = 'customers'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    mobile = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    user = db.relationship('User', back_populates='customer')

    def __repr__(self):
        return f'<Customer {self.id}>'
    

class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Integer, unique=True, nullable=False)

    items = db.relationship('Item', back_populates='category', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Category {self.id}>'


class Item(db.Model, SerializerMixin):
    __tablename__ = 'items'

    id = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String)
    about_item = db.Column(db.String)
    thumbnail = db.Column(db.String)
    in_types = db.Column(db.String)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    # default_subitem_id = db.Column(db.Integer, db.ForeignKey('subitems.id'))
    seller_id = db.Column(db.Integer, db.ForeignKey('sellers.id'))

    category = db.relationship('Category', back_populates='items')
    seller = db.relationship('Seller', back_populates='items')
    subitems = db.relationship('SubItem', back_populates='item', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Item {self.id}>'


class SubItem(db.Model, SerializerMixin):
    __tablename__ = 'subitems'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    price = db.Column(db.Float)
    # discount_rate = db.Column(db.Float)
    discount_price = db.Column(db.Float)
    unit_amount = db.Column(db.Float)
    unit = db.Column(db.String)
    types = db.Column(db.String)
    thumbnails = db.Column(db.String)
    images = db.Column(db.String)
    details_1 = db.Column(db.String)
    details_2 = db.Column(db.String)

    item_id = db.Column(db.Integer, db.ForeignKey('items.id'))

    item = db.relationship('Item', back_populates='subitems')

    def __repr__(self):
        return f'<SubItem {self.id}>'


