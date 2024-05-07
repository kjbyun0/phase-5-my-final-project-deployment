#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import User, Seller, Customer, Category, Item, SubItem

app.secret_key=b'\xaf\x88\x87_\x1a\xf4\x97\x93f\xf5q\x0b\xad\xef,\xb3'

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

# class Authenticate(Resource):
#     def post(self):
#         req = request.get_json()
#         user = User.query.filter_by(username=req.get('username')).first()
#         if user and user.authenticate(req.get('password')):
#             session['user_id'] = user.id
#             return make_response(user.to_dict(), 200)


# api.add_resource(Authenticate, '/authenticate')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

