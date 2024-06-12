#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, make_response
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import User, Seller, Customer, Category, Item, CartItem, OrderItem, Order, Review
import json
from datetime import datetime

app.secret_key=b'\xaf\x88\x87_\x1a\xf4\x97\x93f\xf5q\x0b\xad\xef,\xb3'


def apply_json_loads_to_item(item):
    item['prices'] = json.loads(item['prices'])
    item['discount_prices'] = json.loads(item['discount_prices'])
    item['amounts'] = json.loads(item['amounts'])
    item['units'] = json.loads(item['units'])
    item['packs'] = json.loads(item['packs'])
    item['about_item'] = json.loads(item['about_item'])
    item['details_1'] = json.loads(item['details_1'])
    item['details_2'] = json.loads(item['details_2'])
    item['images'] = json.loads(item['images'])
    return item

# Views go here!

@app.before_request
def check_if_signed_in():
    # print('request.method: ', request.method)
    if not session.get('user_id') \
        and request.endpoint != 'authenticate' \
        and request.endpoint != 'signup' \
        and request.endpoint != 'search' \
        and not (request.endpoint == 'items' and request.method == 'GET') \
        and not (request.endpoint == 'item_by_id' and request.method == 'GET') \
        and request.endpoint != 'reviews_by_itemid':
        return make_response({
            'message': 'User is not signed in',
        }, 401)


@app.route('/')
def index():
    return '<h1>Project Server</h1>'


class Authenticate(Resource):
    def get(self):
        user = User.query.filter_by(id=session.get('user_id')).first()
        if user:
            user_dict = user.to_dict()
            if user_dict.get('customer'):
                for ci in user_dict['customer']['cart_items']:
                    # I don't think I need to check this... My opinion applies to the other codes below.
                    # add nullable=False constraint.
                    if ci.get('item'):  
                        apply_json_loads_to_item(ci['item'])

                for order in user_dict['customer']['orders']:
                    for order_item in order['order_items']:
                        if order_item.get('item'):
                            apply_json_loads_to_item(order_item['item'])

                for review in user_dict['customer']['reviews']:
                    if review.get('item'):
                        apply_json_loads_to_item(review['item'])
            else:   # seller account
                for item in user_dict['seller']['items']:
                    apply_json_loads_to_item(item)
            return make_response(user_dict, 200)
        return make_response({
            'message': 'User is signed out'
        }, 401)
    
    def post(self):
        req = request.get_json()
        user = User.query.filter_by(username=req.get('username')).first()
        print('in Authenticate, user: ', user)
        if user and user.authenticate(req.get('password')):
            print('in Authenticate, authentication successful.')
            session['user_id'] = user.id
            user_dict = user.to_dict()
            if user_dict.get('customer'):
                for ci in user_dict['customer']['cart_items']:
                    if ci.get('item'):
                        apply_json_loads_to_item(ci['item'])

                for order in user_dict['customer']['orders']:
                    for order_item in order['order_items']:
                        if order_item.get('item'):
                            apply_json_loads_to_item(order_item['item'])

                for review in user_dict['customer']['reviews']:
                    if review.get('item'):
                        apply_json_loads_to_item(review['item'])
            else:   # seller account
                for item in user_dict['seller']['items']:
                    apply_json_loads_to_item(item)
            return make_response(user_dict, 200)
        return make_response({
            'message': 'Invalid username or password.'
        }, 401)
    
    def delete(self):
        session['user_id'] = None
        return make_response({}, 204)


class Signup(Resource):
    def post(self):
        req = request.get_json()
        try: 
            user = User(
                username = req.get('username'),
                password_hash = req.get('password'),
                phone = req.get('phone'),
                email = req.get('email'),
                street_1 = req.get('street_1'),
                street_2 = req.get('street_2'),
                city = req.get('city'),
                state = req.get('state'),
                zip_code = req.get('zipCode'),
            )
            # print('in Signup(post), username: ', user.username)
            db.session.add(user)

            # print('in singup(post) isSeller: ', req.get('isSeller'))
            if req.get('isSeller'):
                seller = Seller(
                    name = req.get('name'),
                    user = user,
                )
                # print('in Signup(post), seller: ', seller)
                db.session.add(seller)
            else:
                customer = Customer(
                    first_name = req.get('firstName'),
                    last_name = req.get('lastName'),
                    mobile = req.get('mobile'),
                    nickname = req.get('firstName'),
                    user = user,
                )
                # print('in Signup(post), customer: ', customer)
                db.session.add(customer)
            db.session.commit()
        except Exception as exc:
            return make_response({
                'message': f'{exc}',
            }, 400)
        
        session['user_id'] = user.id
        user_dict = user.to_dict()
        if user_dict.get('customer'):
            for ci in user_dict['customer']['cart_items']:
                if ci.get('item'):
                    apply_json_loads_to_item(ci['item'])

            for order in user_dict['customer']['orders']:
                for order_item in order['order_items']:
                    if order_item.get('item'):
                        apply_json_loads_to_item(order_item['item'])

            for review in user_dict['customer']['reviews']:
                if review.get('item'):
                    apply_json_loads_to_item(review['item'])
        else:   # seller account
            for item in user_dict['seller']['items']:
                apply_json_loads_to_item(item)
        return make_response(user_dict, 201)
                
class Customer_by_id(Resource):
    def patch(self, id):
        req = request.get_json()
        customer = Customer.query.filter_by(id=id).first()
        if customer: 
            try:
                for key in req:
                    setattr(customer, key, req[key])
                db.session.commit()
            except Exception as exc:
                return make_response({
                    'message': f'{exc}',
                }, 400)
            
            return make_response(customer.to_dict(), 200)   # Customer rules out all the relationships.
        
        return make_response({
            'message': f'Customer {id} not found.',
        }, 404)


class Search(Resource):
    def get(self, keys):
        try: 
            # print(f'keys: {keys}')
            result_obj, count = Item.search(keys, 1, 500)
            # print(f'result_obj: {result_obj}, count: {count}')
            results = [apply_json_loads_to_item(result.to_dict()) for result in result_obj.all()]
        except Exception as exc:
            return make_response({
                'message': f'{exc}',
            }, 500)
        return make_response(results, 200)


class Items(Resource): 
    def get(self):
        items = [apply_json_loads_to_item(item.to_dict()) for item in Item.query.all()]
        return make_response(items, 200)

    def post(self):
        req = request.get_json()
        try:
            item = Item(
                name = req.get('name'),
                brand = req.get('brand'),
                default_item_idx = req.get('default_item_idx'),
                # prices = json.dumps(req.get('prices')),
                # discount_prices = json.dumps(req.get('discount_prices')),
                # amounts = json.dumps(req.get('amounts')),
                # units = json.dumps(req.get('units')),
                # packs = json.dumps(req.get('packs')),
                # about_item = json.dumps(req.get('about_item')),
                # details_1 = json.dumps(req.get('details_1')),
                # details_2 = json.dumps(req.get('details_2')),
                # images = json.dumps(req.get('images')),
                prices = req.get('prices'),
                discount_prices = req.get('discount_prices'),
                amounts = req.get('amounts'),
                units = req.get('units'),
                packs = req.get('packs'),
                about_item = req.get('about_item'),
                details_1 = req.get('details_1'),
                details_2 = req.get('details_2'),
                images = req.get('images'),
                category_id = req.get('category_id'),
                seller_id = req.get('seller_id'),
            )
            db.session.add(item)
            db.session.commit()
        except Exception as exc:
            return make_response({
                'message': f'{exc}',
            }, 400)
        
        return make_response(apply_json_loads_to_item(item.to_dict()), 201)


class Item_by_id(Resource):
    def get(self, id):
        item = Item.query.filter_by(id=id).first()
        if item: 
            item_dict = item.to_dict()
            apply_json_loads_to_item(item_dict)
            return make_response(item_dict, 200)
        return make_response({
            'message': f'Item {id} not found.',
        }, 404)
    
    def patch(self, id):
        req = request.get_json()
        item = Item.query.filter_by(id=id).first()
        if item: 
            try: 
                for key in req:
                    setattr(item, key, req[key])
                db.session.commit()
            except Exception as exc:
                return make_response({
                    'message': f'{exc}',
                }, 400)
            item_dict = item.to_dict()
            apply_json_loads_to_item(item_dict)
            return make_response(item_dict, 200)
        
        return make_response({
            'message': f'Item {id} not found.',
        }, 404)


    def delete(self, id):
        item = Item.query.filter_by(id=id).first()
        if item: 
            try: 
                db.session.delete(item)
                db.session.commit()
            except Exception as exc:
                return make_response({
                    'message': f'{exc}',
                }, 400)
            return make_response({}, 204)
        
        return make_response({
            'message': f'Item {id} not found.',
        }, 404)

class CartItems(Resource):
    def post(self): 
        req = request.get_json()
        try: 
            ci = CartItem(
                checked = 1,
                quantity = req.get('quantity'),
                item_idx = req.get('item_idx'),
                item_id = req.get('item_id'),
                customer_id = req.get('customer_id')
            )
            db.session.add(ci)
            db.session.commit()
        except Exception as exc:
            return make_response({
                'message': f'{exc}',
            }, 400)
        
        ci_dict = ci.to_dict()
        if ci_dict.get('item'):
            apply_json_loads_to_item(ci_dict['item'])
        return make_response(ci_dict, 201)


class CartItem_by_id(Resource):
    def patch(self, id):
        req = request.get_json()
        ci = CartItem.query.filter_by(id=id).first()
        if ci:
            try:
                for key in req:
                    setattr(ci, key, req[key])
                db.session.commit()
            except Exception as exc:
                return make_response({
                    'message': f'{exc}',
                }, 400)
            
            ci_dict = ci.to_dict()
            if ci_dict.get('item'):
                apply_json_loads_to_item(ci_dict['item'])
            return make_response(ci_dict, 200)
        
        return make_response({
            'message': f'Cart Item {id} not found.',
        }, 404)
    
    def delete(self, id):
        ci = CartItem.query.filter_by(id=id).first()
        if ci:
            try:
                db.session.delete(ci)
                db.session.commit()
            except Exception as exc:
                return make_response({
                    'message': f'{exc}',
                }, 400)
            return make_response({}, 204)
        
        return make_response({
            'message': f'Cart Item {id} not found.',
        }, 404)


class Orders(Resource):
    def post(self):
        req = request.get_json()
        try:
            o = Order(
                closed_date = None,
                street_1 = req.get('street_1'),
                street_2 = req.get('street_2'),
                city = req.get('city'),
                state = req.get('state'),
                zip_code = req.get('zip_code'),
                customer_id = req.get('customer_id')
            )
            db.session.add(o)
            db.session.commit()
        except Exception as exc:
            return make_response({
                'message': f'{exc}',
            }, 400)
        
        order_dict = o.to_dict()
        # it is tested indirectly when authenticating user.
        for order_item in order_dict['order_items']:
            if order_item.get('item'):
                apply_json_loads_to_item(order_item['item'])
        return make_response(order_dict, 201)


class Order_by_id(Resource):
    def get(self, id):
        o = Order.query.filter_by(id=id).first()
        if o:
            return make_response(o.to_dict(), 200)
        
        return make_response({
            'message': f'Order {id} not found.'
        }, 404) 
    
    def patch(self, id):
        req = request.get_json()
        o = Order.query.filter_by(id=id).first()
        if o:
            try:
                for key in req:
                    if key != 'closed_date':
                        setattr(o, key, req[key])
                    else:
                        d = datetime.strptime(req[key], '%Y-%m-%d %H:%M:%S')
                        # setattr(o, key, db.func.now())
                        setattr(o, key, d)
                db.session.commit()
            except Exception as exc:
                return make_response({
                    'message': f'{exc}',
                }, 400)
            
            return make_response(o.to_dict(), 200)
        
        return make_response({
            'message': f'Order {id} not found.'
        })

    def delete(self, id):
        o = Order.query.filter_by(id=id).first()
        if o:
            try:
                db.session.delete(o)
                db.session.commit()
            except Exception as exc:
                return make_response({
                    'message': f'{exc}',
                }, 400)
            return make_response({}, 204)

        return make_response({
            'message': f'Order {id} not found.',
        }, 404)


class OrderItems(Resource):
    def post(self):
        req = request.get_json()
        try:
            oi = OrderItem(
                quantity = req.get('quantity'),
                price = req.get('price'),
                processed_date = None,
                item_idx = req.get('item_idx'),
                item_id = req.get('item_id'),
                order_id = req.get('order_id')
            )
            db.session.add(oi)
            db.session.commit()
        except Exception as exc:
            return make_response({
                'message': f'{exc}',
            }, 400)
        
        oi_dict = oi.to_dict()
        # it is tested indirectly when authenticating user.
        if oi_dict.get('item'):
            apply_json_loads_to_item(oi_dict['item'])
        return make_response(oi_dict, 201)


class OrderItem_by_id(Resource):
    def patch(self, id):
        req = request.get_json()
        oi = OrderItem.query.filter_by(id=id).first()
        if oi:
            try:
                for key in req:
                    if key != 'processed_date':
                        setattr(oi, key, req[key])
                    else:
                        d = datetime.strptime(req[key], '%Y-%m-%d %H:%M:%S')
                        # setattr(oi, key, db.func.now())
                        setattr(oi, key, d)
                db.session.commit()
            except Exception as exc:
                return make_response({
                    'message': f'{exc}',
                }, 400)

            return make_response(oi.to_dict(), 200)
        
        return make_response({
            'message': f'OrderItem {id} not found.',
        }, 404)

    
class Reviews(Resource):
    def post(self):
        req = request.get_json()
        try:
            r = Review(
                rating = req.get('rating'),
                headline = req.get('headline'),
                content = req.get('content'),
                images = req.get('images'), # ??? need to implement it later.
                review_done = 0,
                item_id = req.get('item_id'),
                customer_id = req.get('customer_id')
            )
            db.session.add(r)
            db.session.commit()
        except Exception as exc:
            return make_response({
                'message': f'{exc}',
            }, 400)
        
        r_dict = r.to_dict()
        if r_dict.get('item'):
            apply_json_loads_to_item(r_dict['item'])
        return make_response(r_dict, 201)


class Review_by_id(Resource):
    def patch(self, id):
        req = request.get_json()
        r = Review.query.filter_by(id=id).first()
        if r:
            try:
                for key in req:
                    setattr(r, key, req[key])
                db.session.commit()
            except Exception as exc:
                return make_response({
                    'message': f'{exc}',
                }, 400)
            
            r_dict = r.to_dict()
            if r_dict.get('item'):
                apply_json_loads_to_item(r_dict['item'])
            return make_response(r_dict, 200)
        
        return make_response({
            'message': f'Review {id} not found.',
        }, 404)
    
    def delete(self, id):
        r = Review.query.filter_by(id=id).first()
        if r:
            try:
                db.session.delete(r)
                db.session.commit()
            except Exception as exc:
                return make_response({
                    'message': f'{exc}',
                }, 400)
            
            return make_response({}, 204)
        
        return make_response({
            'message': f'Review {id} not found.',
        }, 404)


class Reviews_by_itemId(Resource):
    def get(self, iid):
        rs_dict = [ r.to_dict() for r in Review.query.filter_by(item_id=iid).all()]
        for r_dict in rs_dict:
            r_dict.pop('item', None)
        return make_response(rs_dict, 200)


api.add_resource(Authenticate, '/authenticate', endpoint='authenticate')
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(Customer_by_id, '/customers/<int:id>') # Authentication required
api.add_resource(Search, '/search/<string:keys>', endpoint='search')
api.add_resource(Items, '/items', endpoint='items') # Authentication required because we are using it to post an item... ???*** Think about checking authentication only for POST request.
api.add_resource(Item_by_id, '/items/<int:id>', endpoint='item_by_id') # Authentication required for patch and delete operation.
api.add_resource(CartItems, '/cartitems', endpoint='cartitems') # Authentication required
api.add_resource(CartItem_by_id, '/cartitems/<int:id>', endpoint='cartitem_by_id') # Authentication required
api.add_resource(Orders, '/orders') # Authentication required
api.add_resource(Order_by_id, '/orders/<int:id>') # Authentication required
api.add_resource(OrderItems, '/orderitems') # Authentication required
api.add_resource(OrderItem_by_id, '/orderitems/<int:id>') # Authentication required
api.add_resource(Reviews, '/reviews') # Authentication required
api.add_resource(Review_by_id, '/reviews/<int:id>') # Authentication required
api.add_resource(Reviews_by_itemId, '/reviews/items/<int:iid>', endpoint='reviews_by_itemid')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

