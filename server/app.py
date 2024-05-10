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
                

class Item_by_id(Resource):
    def get(self, id):
        item = Item.query.filter_by(id=id).first()
        if item: 
            item_dict = item.to_dict()
            item_dict['prices'] = json.loads(item_dict['prices'])
            item_dict['discount_prices'] = json.loads(item_dict['discount_prices'])
            item_dict['amounts'] = json.loads(item_dict['amounts'])
            item_dict['units'] = json.loads(item_dict['units'])
            item_dict['packs'] = json.loads(item_dict['packs'])
            item_dict['about_item'] = json.loads(item_dict['about_item'])
            item_dict['details_1'] = json.loads(item_dict['details_1'])
            item_dict['details_2'] = json.loads(item_dict['details_2'])
            item_dict['thumbnails'] = json.loads(item_dict['thumbnails'])
            item_dict['images'] = json.loads(item_dict['images'])
            return make_response(item_dict, 200)
        return make_response({
            'message': f'Item {id} not found.',
        }, 404)



api.add_resource(Authenticate, '/authenticate')
api.add_resource(Signup, '/signup')
api.add_resource(Item_by_id, '/items/<int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

