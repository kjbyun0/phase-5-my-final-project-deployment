#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Seller, Customer, Category, Item, SubItem
import json

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")

        # Seed code goes here!
        Seller.query.delete()
        Customer.query.delete()
        User.query.delete()
        SubItem.query.delete()
        Item.query.delete()
        Category.query.delete()
        db.session.commit()

        ############################################################################
        # Users
        ############################################################################
        u1 = User(
            username='cust01',
            password_hash='cust01',
            phone='111)111-1111',
            email='cust01@gmail.com',
            street_1='11111 Todd Blvd',
            street_2='',
            city='Huston',
            state='TX',
            zip_code='11111'
        )
        cust01 = Customer(
            first_name='cust-first',
            last_name='cust-last',
            mobile='111)111-2222',
            user = u1
        )

        u2 = User(
            username='sell01',
            password_hash='sell01',
            phone='222)222-2222',
            email='sell01@gmail.com',
            street_1='22222 Todd Blvd',
            street_2='',
            city='Huston',
            state='TX',
            zip_code='22222'
        )
        sell01 = Seller(
            name='seller-name',
            user = u2
        )
        db.session.add_all([u1, u2])
        db.session.add_all([cust01, sell01])

        ############################################################################
        # Categories
        ############################################################################
        cats = []
        cat_list = [
            'Beauty & Personal Care',
            'Cleaning Supplies',
            'Clothing',
            'Electronics',
            'Gloceries',
            'Over-the-counter Medicine',
            'Vitamins & Dietary Supplements',
        ]
        for cat in cat_list:
            cats.append(Category(
                name=cat
            ))
        db.session.add_all(cats)

        ############################################################################
        # Items & Subitems
        ############################################################################
        items = []
        items.append(Item(
            brand = "THE GYM PEOPLE",
            about_item = json.dumps([
                "Material: Joggers Pants made of 80% Polyamide, 20%Spandex. This fabric has a four-way stretch， can move with you for extra comfort, and stays in great shape. Skin-friendly fabric offers a smooth, low-friction performance.", 
                "Design: Light-weight Tapered Lounge Pants provide more comfortable for outdoor activity. Features two fixed side pockets, the pockets are deep enough to store your phone, keys, and wallet, and easy to access.", 
                "Elastic Waistband: These Joggers Leggings with an elastic waistband, can fit all kinds of bodies. The smooth, wide waistband lays flat on your skin to provide tummy control and make your body look slimmer.", 
                "Function: The tapered leg design is both comfortable and flattering. Perfect for casual wear, travel, and sports such as jogging, yoga, outdoor activities, workout, walking, gym fitness, and even better for lounging around the house.", 
                "Please check the Size Chart (Last Image) Before Ordering, Please Note: Color May Vary Slightly From Image. and don't worry about size problems, you can through the Online Returns Center exchange it if the Jogger pants size don't fit"
            ]),
            thumbnail = "https://m.media-amazon.com/images/I/615YipeumnL._AC_UL480_FMwebp_QL65_.jpg",
            in_types = json.dumps({
                'size': ['X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large'],
            }),
            category = cats[2],
            seller = sell01,
        ))
        db.session.add_all(items)

        subitems = []
        subitems.append(SubItem(
            name = "THE GYM PEOPLE Women's Joggers Pants Lightweight Athletic Leggings Tapered Lounge Pants for Workout, Yoga, Running",
            price = 34.99,
            discount_price = 28.99,
            unit_amount = 1,
            unit = 'count',
            types = json.dumps({
                'color': 'black'
            }),
            thumbnails = json.dumps([
                "https://m.media-amazon.com/images/I/31SKkajZa8L._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/31aOs-fvcuL._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/31MV+vXwo8L._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/31TyfmA2HXL._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/31uXfHuC1hL._AC_SR38,50_.jpg",
                "https://m.media-amazon.com/images/I/319UXEq+W6L._AC_SR38,50_.jpg",
                "https://m.media-amazon.com/images/I/31XGTHQUkIL._AC_SR38,50_.jpg",
            ]),
            images = json.dumps([
                "https://m.media-amazon.com/images/I/61Q0Yt4QMoL._AC_SY879_.jpg",
                "https://m.media-amazon.com/images/I/51EKhWXsnEL._AC_SY879_.jpg",
                "https://m.media-amazon.com/images/I/61P4+GDoIjL._AC_SY879_.jpg",
                "https://m.media-amazon.com/images/I/51rLBghpD4L._AC_SY879_.jpg",
                "https://m.media-amazon.com/images/I/614GM9MCFDL._AC_SY879_.jpg",
                "https://m.media-amazon.com/images/I/61bJZvMhsWL._AC_SY879_.jpg",
                "https://m.media-amazon.com/images/I/517gvdu9RNL._AC_SX679_.jpg",
            ]),
            details_1 = json.dumps({
                'Fabric type': '80% Polyamide, 20% Spandex',
                'Care instructions': 'Hand Wash Only',
                'Origin': 'Imported',
                'Closure type': 'Elastic',
                'Country of Origin': 'China',
            }),
            details_2 = json.dumps({
                'Package Dimensions': '14.96 x 9.84 x 0.79 inches; 9.88 ounces',
                'Department': 'womens',
                'Date First Available': 'October 28, 2019',
                'Manufacturer': 'THE GYM PEOPLE',
                'ASIN': 'B07ZP7L2X9',
            }),
            item = items[0],
        ))

        subitems.append(SubItem(
            name = "THE GYM PEOPLE Women's Joggers Pants Lightweight Athletic Leggings Tapered Lounge Pants for Workout, Yoga, Running",
            price = 34.99,
            discount_price = 29.99,
            unit_amount = 1,
            unit = 'count',
            types = json.dumps({
                'color': 'blue'
            }),
            thumbnails = json.dumps([
                "https://m.media-amazon.com/images/I/31GR54RIfEL._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/314uBYlOPrL._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/31iA7qOrN9L._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/31zxfP-F90L._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/31op7UrcRxL._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/31EEBG9PhOL._AC_SR38,50_.jpg", 
            ]),
            images = json.dumps([
                "https://m.media-amazon.com/images/I/510FRHf4JbL._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/51aWX-SHHwL._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/614oa0njMgL._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/51kdkYJirQL._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/61IeT+EsF-L._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/61cGj8Rak0L._AC_SY879_.jpg", 
            ]),
            details_1 = json.dumps({
                'Fabric type': '80% Polyamide, 20% Spandex',
                'Care instructions': 'Hand Wash Only',
                'Origin': 'Imported',
                'Closure type': 'Slip On',
                'Country of Origin': 'China',
            }),
            details_2 = json.dumps({
                'Package Dimensions': '14.96 x 9.84 x 0.79 inches; 9.88 ounces',
                'Department': 'womens',
                'Date First Available': 'October 28, 2019',
                'Manufacturer': 'THE GYM PEOPLE',
                'ASIN': 'B07ZP7L2X9',
            }),
            item = items[0],
        ))

        subitems.append(SubItem(
            name = "THE GYM PEOPLE Women's Joggers Pants Lightweight Athletic Leggings Tapered Lounge Pants for Workout, Yoga, Running",
            price = 34.99,
            discount_price = 29.99,
            unit_amount = 1,
            unit = 'count',
            types = json.dumps({
                'color': 'Denim Blue'
            }),
            thumbnails = json.dumps([
                "https://m.media-amazon.com/images/I/21jgDOQ9yIL._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/218q8im7P1L._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/21t8OSKyYqL._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/21V-TIC7lrL._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/21Q+rwi2DzL._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/31WgUOeXhWL._AC_SR38,50_.jpg",  
            ]),
            images = json.dumps([
                "https://m.media-amazon.com/images/I/51FhM0fDMxL._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/51tC6dUUhFL._AC_SX679_.jpg", 
                "https://m.media-amazon.com/images/I/514l5aLmGKL._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/517bLBOlC9L._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/51oaPnFlbjL._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/61VhzBu-QqL._AC_SY879_.jpg",  
            ]),
            details_1 = json.dumps({
                'Fabric type': '80% Polyamide, 20% Spandex',
                'Care instructions': 'Hand Wash Only',
                'Origin': 'Imported',
                'Closure type': 'Slip On',
                'Country of Origin': 'China',
            }),
            details_2 = json.dumps({
                'Package Dimensions': '14.96 x 9.84 x 0.79 inches; 9.88 ounces',
                'Department': 'womens',
                'Date First Available': 'October 28, 2019',
                'Manufacturer': 'THE GYM PEOPLE',
                'ASIN': 'B07ZP7L2X9',
            }),
            item = items[0],
        ))

        subitems.append(SubItem(
            name = "THE GYM PEOPLE Women's Joggers Pants Lightweight Athletic Leggings Tapered Lounge Pants for Workout, Yoga, Running",
            price = 34.99,
            discount_price = 29.99,
            unit_amount = 1,
            unit = 'count',
            types = json.dumps({
                'color': 'Brick Red'
            }),
            thumbnails = json.dumps([
                "https://m.media-amazon.com/images/I/316fHawjclL._AC_SR38,50_.jpg",  
                "https://m.media-amazon.com/images/I/21ey4OoPn2L._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/31mnbEUILvL._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/21qm-EDsTuL._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/511mo2prF2L._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/31T99-Qh5pL._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/31gMY00gZHL._AC_SR38,50_.jpg", 
            ]),
            images = json.dumps([
                "https://m.media-amazon.com/images/I/51AaTry3YSL._AC_SY879_.jpg",  
                "https://m.media-amazon.com/images/I/5145+CGmprL._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/51pqBkiMczL._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/511mo2prF2L._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/61goMRdYqAL._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/61S-haOU9BL._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/51gw1sa1LvL._AC_SX679_.jpg", 
            ]),
            details_1 = json.dumps({
                'Fabric type': '80% Polyamide, 20% Spandex',
                'Care instructions': 'Hand Wash Only',
                'Origin': 'Imported',
                'Closure type': 'Elastic',
                'Country of Origin': 'China',
            }),
            details_2 = json.dumps({
                'Package Dimensions': '14.96 x 9.84 x 0.79 inches; 9.88 ounces',
                'Department': 'womens',
                'Date First Available': 'October 28, 2019',
                'Manufacturer': 'THE GYM PEOPLE',
                'ASIN': 'B07ZP7L2X9',
            }),
            item = items[0],
        ))

        subitems.append(SubItem(
            name = "THE GYM PEOPLE Women's Joggers Pants Lightweight Athletic Leggings Tapered Lounge Pants for Workout, Yoga, Running",
            price = 30.99,
            discount_price = 30.99,
            unit_amount = 1,
            unit = 'count',
            types = json.dumps({
                'color': 'Faux Leather Coated'
            }),
            thumbnails = json.dumps([
                "https://m.media-amazon.com/images/I/31CV2QSU41L._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/317cREb+dsL._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/31Kmfkk0VPL._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/31WHWzjrlXL._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/319Yl9v5ClL._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/3131DpqIT8L._AC_SR38,50_.jpg", 
            ]),
            images = json.dumps([
                "https://m.media-amazon.com/images/I/71SyJpXX8EL._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/71P595iKBjL._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/71DgjH7UwHL._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/712XNg6E2LL._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/71my24ffKGL._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/71zv0owAkyL._AC_SY879_.jpg", 
            ]),
            details_1 = json.dumps({
                'Fabric type': '80% Polyamide, 20% Spandex',
                'Origin': 'Imported',
                'Rise style': 'High Rise',
                'Leg style': 'Tapered',
                'Country of Origin': 'China',
            }),
            details_2 = json.dumps({
                'Package Dimensions': '14.96 x 9.84 x 0.79 inches; 9.88 ounces',
                'Department': 'womens',
                'Date First Available': 'October 28, 2019',
                'Manufacturer': 'THE GYM PEOPLE',
                'ASIN': 'B07ZP7L2X9',
            }),
            item = items[0],
        ))

        subitems.append(SubItem(
            name = "THE GYM PEOPLE Women's Joggers Pants Lightweight Athletic Leggings Tapered Lounge Pants for Workout, Yoga, Running",
            price = 35.99,
            discount_price = 31.99,
            unit_amount = 1,
            unit = 'count',
            types = json.dumps({
                'color': 'Tie Dye White'
            }),
            thumbnails = json.dumps([
                "https://m.media-amazon.com/images/I/31S-R8Cq78L._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/31kpWvJ4PcL._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/31BbRr6jTmL._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/31iSuncJP-L._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/31ZDl9gL+TL._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/318qRLXS9QL._AC_SR38,50_.jpg", 
            ]),
            images = json.dumps([
                "https://m.media-amazon.com/images/I/71sGS70bKvL._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/71TEd-EkhNL._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/61Y6Rt3VAbL._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/711l8O9H9KL._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/71wkqSANUdL._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/71ZvStl+HUL._AC_SY879_.jpg", 
            ]),
            details_1 = json.dumps({
                'Fabric type': '80% Polyamide, 20% Spandex',
                'Care instructions': 'Hand Wash Only',
                'Origin': 'Imported',
                'Closure type': 'Elastic',
                'Country of Origin': 'China',
            }),
            details_2 = json.dumps({
                'Package Dimensions': '14.96 x 9.84 x 0.79 inches; 9.88 ounces',
                'Department': 'womens',
                'Date First Available': 'October 28, 2019',
                'Manufacturer': 'THE GYM PEOPLE',
                'ASIN': 'B07ZP7L2X9',
            }),
            item = items[0],
        ))

        subitems.append(SubItem(
            name = "THE GYM PEOPLE Women's Joggers Pants Lightweight Athletic Leggings Tapered Lounge Pants for Workout, Yoga, Running",
            price = 34.99,
            discount_price = 29.99,
            unit_amount = 1,
            unit = 'count',
            types = json.dumps({
                'color': 'Vintage Purple'
            }),
            thumbnails = json.dumps([
                "https://m.media-amazon.com/images/I/31LGvS+cceL._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/31DMxuHnI7L._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/31kNewiatKL._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/31flYIL-mDL._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/319STaBOmKL._AC_SR38,50_.jpg", 
                "https://m.media-amazon.com/images/I/31wNNzYoYpL._AC_SR38,50_.jpg", 
            ]),
            images = json.dumps([
                "https://m.media-amazon.com/images/I/6127fRn-WaL._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/61N1Bi2DxXL._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/61JudCWIjwL._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/61d9xfAYsVL._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/61IV3ZWyQdL._AC_SY879_.jpg", 
                "https://m.media-amazon.com/images/I/61LlamFP8UL._AC_SY879_.jpg", 
            ]),
            details_1 = json.dumps({
                'Fabric type': '80% Polyamide, 20% Spandex',
                'Origin': 'Imported',
                'Closure type': 'Elastic',
                'Inseam': '27.2 Inches',
                'Country of Origin': 'China',
            }),
            details_2 = json.dumps({
                'Package Dimensions': '14.96 x 9.84 x 0.79 inches; 9.88 ounces',
                'Department': 'womens',
                'Date First Available': 'October 28, 2019',
                'Manufacturer': 'THE GYM PEOPLE',
                'ASIN': 'B07ZP7L2X9',
            }),
            item = items[0],
        ))

        db.session.add_all(subitems)

        db.session.commit()
