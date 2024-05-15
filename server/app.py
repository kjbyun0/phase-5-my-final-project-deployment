#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, make_response
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import User, Seller, Customer, Category, Item
import json

app.secret_key=b'\xaf\x88\x87_\x1a\xf4\x97\x93f\xf5q\x0b\xad\xef,\xb3'

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

def apply_json_loads_to_item(item):
    item['prices'] = json.loads(item['prices'])
    item['discount_prices'] = json.loads(item['discount_prices'])
    item['amounts'] = json.loads(item['amounts'])
    item['units'] = json.loads(item['units'])
    item['packs'] = json.loads(item['packs'])
    item['about_item'] = json.loads(item['about_item'])
    item['details_1'] = json.loads(item['details_1'])
    item['details_2'] = json.loads(item['details_2'])
    item['thumbnails'] = json.loads(item['thumbnails'])
    item['images'] = json.loads(item['images'])
    return item

class Authenticate(Resource):
    def get(self):
        user = User.query.filter_by(id=session.get('user_id')).first()
        if user:
            return make_response(user.to_dict(), 200)
        return make_response({
            'message': 'User is signed out'
        }, 401)
    
    def post(self):
        req = request.get_json()
        user = User.query.filter_by(username=req.get('username')).first()
        print('in Authenticate, user: ', user)
        if user and user.authenticate(req.get('password')):
            session['user_id'] = user.id
            return make_response(user.to_dict(), 200)
        return make_response({
            'message': 'Invaled username or password.'
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
                    user = user,
                )
                # print('in Signup(post), customer: ', customer)
                db.session.add(customer)
            db.session.commit()
        except Exception as exc:
            return make_response({
                'Message': f'{exc}',
            }, 400)
        
        session['user_id'] = user.id
        return make_response(user.to_dict(), 201)
                

class Search(Resource):
    def get(self, keys):
        try: 
            print(f'keys: {keys}')
            result_obj, count = Item.search(keys, 1, 500)
            print(f'result_obj: {result_obj}, count: {count}')
            results = [apply_json_loads_to_item(result.to_dict()) for result in result_obj.all()]
        except Exception as exc:
            return make_response({
                'message': f'{exc}',
            }, 500)
        return make_response(results, 200)


class Item_by_id(Resource):
    def get(self, id):
        item = Item.query.filter_by(id=id).first()
        if item: 
            item_dict = item.to_dict()
            item_dict = apply_json_loads_to_item(item_dict)
            return make_response(item_dict, 200)
        return make_response({
            'message': f'Item {id} not found.',
        }, 404)



api.add_resource(Authenticate, '/authenticate')
api.add_resource(Signup, '/signup')
api.add_resource(Search, '/search/<string:keys>')
api.add_resource(Item_by_id, '/items/<int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

