#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Seller, Customer, Category, Item, CartItem, OrderItem, Order, Review
import json

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")

        # Seed code goes here!
        Review.query.delete()
        OrderItem.query.delete()
        Order.query.delete()
        CartItem.query.delete()
        Seller.query.delete()
        Customer.query.delete()
        User.query.delete()
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
            nickname='cust-first',
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
            name = "Dove Skin Care Beauty Bar For Softer Skin Cucumber and Green Tea More Moisturizing Than Bar Soap 3.75 oz, 14 Bars",
            brand = 'Dove',
            default_item_idx = 2,
            prices = json.dumps([9.71, 10.97, 21.47, 33.96, 20.98, ]),
            discount_prices = json.dumps([9.22, 10.97, 18.63, 30.34, 20.98, ]),
            amounts = json.dumps([3.75, 3.75, 3.75, 3.75, 4.0, ]),
            units = json.dumps(['ounce', 'ounce', 'ounce', 'ounce', 'ounce', ]),
            packs = json.dumps([6, 8, 14, 24, 12, ]),
            about_item = json.dumps([
                 "REFRESHES SKIN: Dove Cool Moisture Beauty Bar combines the refreshing scents of cucumber and green tea with Dove mild cleansers for skin care to revitalize both your senses and your skin",
                 "#1 DERMATOLOGIST RECOMMENDED: Dove Beauty Bar is the #1 dermatologist-recommended Beauty Bar in the U.S",
                 "MILD & MOISTURIZING: With ¼ moisturizing cream, Dove Beauty Bar helps your skin maintain its natural moisture barrier and keeps skin hydrated as part of your skin care routine",
                 "VERSATILE CLEANSER: The unique formulation for effective skin care can be enjoyed by the entire family as this all-in-one cleanser nourishes your face, body, and hands for beautiful skin",
                 "EFFECTIVE CLEANSING: Wash away dirt and germs, without drying your skin like ordinary bath soap can. This beauty bar is gentle enough to use every day on your body and your face",
                 "THOUGHTFULLY MADE SKIN CARE: This Beauty Bar is Certified Cruelty-Free by PETA and sulfate free cleansers, so you can feel good about switching from ordinary bar soap to Dove",
            ]),
            details_1 = json.dumps([
                 'Brand;Dove',
                 'Item Weight;0.57 Grams',
                 'Item dimensions L x W x H;4.13 x 2.5 x 725 inches',
                 'Scent;Cucumber, Green Tea',
                 'Age Range (Description);Adult',
            ]),
            details_2 = json.dumps([
                 'Is Discontinued By Manufacturer;No',
                 'Product Dimensions;4.13 x 2.5 x 725 inches; 0.02 ounces',
                 'Item model number;011111611177',
                 'UPC;011111611177',
                 'Manufacturer;Unilever',
                 'ASIN;B0016FWFDI',
                 'Country of Origin;USA',
            ]),
            card_thumbnail = 'https://m.media-amazon.com/images/I/71P6h4i-EHL._AC_UL480_FMwebp_QL65_.jpg',
            thumbnails = json.dumps([
                 'https://m.media-amazon.com/images/I/41WqRQbrVDL._SS40_.jpg',
                 'https://m.media-amazon.com/images/I/419XMv6kx4L._SS40_.jpg',
                 'https://m.media-amazon.com/images/I/419EQLU0a2L._SS40_.jpg',
                 'https://m.media-amazon.com/images/I/418FHbDtnAL._SS40_.jpg',
                 'https://m.media-amazon.com/images/I/31jcHkrNL+L._SS40_.jpg',
                 'https://m.media-amazon.com/images/I/41f9bv1xdML._SS40_.jpg',
            ]),
            images = json.dumps([
                 'https://m.media-amazon.com/images/I/71P6h4i-EHL._SX679_.jpg',
                 'https://m.media-amazon.com/images/I/71Z4oxHuxpL._SX679_.jpg',
                 'https://m.media-amazon.com/images/I/81dEJSdQasL._SX679_.jpg',
                 'https://m.media-amazon.com/images/I/71am83eSw9L._SX679_.jpg',
                 'https://m.media-amazon.com/images/I/61PtStpsLxL._SX679_.jpg',
                 'https://m.media-amazon.com/images/I/71K7V0lKJ0L._SX679_.jpg',
            ]),
            category = cats[0],
            seller = sell01,
        ))
    
        items.append(Item(
            name = 'BodyRefresh Shower Steamers Aromatherapy - 8 Pack Shower Bombs with Essential Oils. Self Care Birthday Gifts for Women, Gifts for Her, Mothers Day Gifts for Wife Mom from Daughter',
            brand = 'BodyRefresh',
            default_item_idx = 0,
            prices = json.dumps([9.99, ]),
            discount_prices = json.dumps([9.99, ]),
            amounts = json.dumps([8, ]),
            units = json.dumps(['count', ]),
            packs = json.dumps([1, ]),
            about_item = json.dumps([
                "Luxurious Self Care - BodyRefresh use small batches of steam distillation to concentrate natural essential oils. Scent lasts up to 2 times longer than others. Experience aromatherapy from an organic farm, these shower bombs are designed to provide a rejuvenating and relaxing shower. Perfect for birthday gifts for women, mothers day gifts for mom from daughter son, gifts for her.", 
                "Eight Natural Scents - Shower steamers natural scents including eucalyptus, lavender, mint, rose, grapefruit, watermelon, citrus, bergamot. Let the soothing aroma envelop your senses, creating a tranquil atmosphere in your shower, luxurious self-care. The perfect gifts for women men her him, mother's day gift ideas.", 
                "Long-Lasting, Potently Fragrant - Each BodyRefresh shower steamer is infused with more natural essential oils than any other shower steamer. Enjoy more than 2 times the aromatic for a relaxing shower that invigorates the mind and body.", 
                "Home Spa - Take a moment to escape from the daily hustle and bustle with shower steamers. These shower steamers create a serene and spa-like ambiance. Enjoy a peaceful and rejuvenating shower experience with Bodyrefresh, the perfect teacher appreciation gifts for women, mothers day gifts for wife.", 
                "The Greatest Mothers Day Gifts - 8 shower steamers individually exquisite packaged, perfect for birthday gifts for women, gifts for mom her. Also can be unique mom gifts for mothers day.", 
            ]),
            details_1 = json.dumps([
                'Brand;BodyRefresh',
                'Scent;Citrus,Eucalyptus,Lavender,Watermelon,Grape,Rose',
                'Age Range (Description);Adult',
                'Recommended Uses For Product;Relaxation',
                'Product Benefits;Aromatherapy,Relaxation,Stress Relief,Home Spa',
            ]),
            details_2 = json.dumps([
                'Package Dimensions;6.77 x 2.83 x 2.68 inches; 10.86 ounces',
                'Date First Available;September 19, 2023',
                'Manufacturer;BodyRefresh',
                'ASIN;B0CF58LSJN',
            ]),
            card_thumbnail = 'https://m.media-amazon.com/images/I/81J+Ff0wPYL._AC_UL480_FMwebp_QL65_.jpg',
            thumbnails = json.dumps([
                'https://m.media-amazon.com/images/I/51XymofYLdL._AC_US40_.jpg',
                'https://m.media-amazon.com/images/I/51che3im24L._AC_US40_.jpg',
                'https://m.media-amazon.com/images/I/51che3im24L._AC_US40_.jpg',
                'https://m.media-amazon.com/images/I/51lOYvbx6FL._AC_US40_.jpg',
                'https://m.media-amazon.com/images/I/415O43ympzL._AC_US40_.jpg',
                'https://m.media-amazon.com/images/I/51VPBBbaBIL._AC_US40_.jpg', 
            ]),
            images = json.dumps([
                'https://m.media-amazon.com/images/I/81J+Ff0wPYL._AC_SX679_.jpg',
                'https://m.media-amazon.com/images/I/81q3m+sFAPL._AC_SX679_.jpg',
                'https://m.media-amazon.com/images/I/71YWvp-FakL._AC_SX679_.jpg',
                'https://m.media-amazon.com/images/I/71WRjYJTBlL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/71LJewiZu0L._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/71YrWM4gBiL._AC_SX679_.jpg', 
            ]),
            category = cats[0],
            seller = sell01,
        ))

        items.append(Item(
            name = "eos Shea Better Body Lotion- Jasmine Peach, 24-Hour Moisture Skin Care, Lightweight & Non-Greasy, Made with Natural Shea, Vegan, 16 fl oz",
            brand = 'eos',
            default_item_idx = 0,
            prices = json.dumps([10.99, 21.98, ]),
            discount_prices = json.dumps([8.98, 17.97, ]),
            amounts = json.dumps([16, 16, ]),
            units = json.dumps(['Fl Oz', 'Fl Oz', ]),
            packs = json.dumps([1, 2, ]),
            about_item = json.dumps([
                "SHEA BETTER BODY LOTION: Our bright and juicy Pomegranate Raspberry scent contains fragrance notes of sweet pomegranate, tart raspberries and lotus blossom. eos 24-hour hydration body lotion is made with natural ingredients to leave your skin smooth from head-to-toe.",
                "SHEA BETTER BODY LOTION: Our sparkling and luscious Jasmine Peach scent contains fragrance notes of apricot nectar, sparkling jasmine, and vanilla sugar. eos 24-hour hydration body lotion is made with natural ingredients to leave your skin smooth from head-to-toe.",
                "24-HOUR MOISTURE FOR YOUR BODY: Soothe and protect your skin with our lightweight and non-greasy lotion. No sticky residue or heaviness, just all-day hydration and smooth skin.",
                "SMOOTH ON: Apply this fast-absorbing and deliciously scented body lotion to just-cleaned skin, paying special attention to dry, rough areas. Relax – we’ll do the rest.", 
                "SUSTAINABLE SKIN CARE: Protect and moisturize your skin with 7 nourishing oils + butters, including natural shea butter and shea oil. Our collection of incredible fragrances will delight in application and last all day on skin",
                "ALL-NATURAL SHEA BUTTER: eos products have wild grown, sustainably-sourced 100% natural shea butter to make skin feel moisturized, protected and soft. We are paraben, phthalate and gluten free. Dermatologist tested. Vegan. Hypoallergenic. PETA certified. No products tested on animals.",
            ]),
            details_1 = json.dumps([
                'Brand;eos',
                'Item Volume;16 Fluid Ounces',
                'Age Range (Description);Adult',
                'Special Feature;Lightweight, Hypoallergenic',
                'Skin Type;Dry',
            ]),
            details_2 = json.dumps([
                'Manufacturer;eos',
                'ASIN;B0CCZKRRCX',
            ]),
            card_thumbnail = 'https://m.media-amazon.com/images/I/61pZYk39B+L._AC_UL480_FMwebp_QL65_.jpg',
            thumbnails = json.dumps([
                'https://m.media-amazon.com/images/I/31qfcnEuzhL._SS40_.jpg',
                'https://m.media-amazon.com/images/I/51ej7ChbVGL._SS40_.jpg',
                'https://m.media-amazon.com/images/I/51Muz80LPSL._SS40_.jpg',
                'https://m.media-amazon.com/images/I/51hY87DcYDL._SS40_.jpg',
                'https://m.media-amazon.com/images/I/41ejQqio5BL._SS40_.jpg',
                'https://m.media-amazon.com/images/I/41FKh6qMOvL._SS40_.jpg',
            ]),
            images = json.dumps([
                'https://m.media-amazon.com/images/I/61pZYk39B+L._SX679_.jpg',
                'https://m.media-amazon.com/images/I/61csXf8B7ZL._SX679_.jpg',
                'https://m.media-amazon.com/images/I/61HlvDn5o9L._SX679_.jpg',
                'https://m.media-amazon.com/images/I/61hKfLakaqL._SX679_.jpg',
                'https://m.media-amazon.com/images/I/51xCmWZSLNL._SX679_.jpg',
                'https://m.media-amazon.com/images/I/51r-23IdTAL._SX679_.jpg',
            ]),
            category = cats[0],
            seller = sell01,
        ))

        items.append(Item(
            name = 'CeraVe Cleansing Balm for Sensitive Skin | Hydrating Makeup Remover with Ceramides and Plant-based Jojoba Oil for Face | Non-Comedogenic Fragrance Free Non-Greasy |1.3 Ounces',
            brand = 'CeraVe',
            default_item_idx = 0,
            prices = json.dumps([10.99, ]),
            discount_prices = json.dumps([9.97, ]),
            amounts = json.dumps([1.3, ]),
            units = json.dumps(['Ounce', ]),
            packs = json.dumps([1, ]),
            about_item = json.dumps([
                '[ CLEANSING BALM FOR FACE ] CeraVe Hydrating cleansing balm – with 3 essential ceramides- effectively removes the most long-lasting makeup, including waterproof mascara, moisturizes the skin. Skin does not feel greasy after cleansing', 
                '[ MAKEUP BALM REMOVER WITH JOJOBA OIL ] Gentle and effective formula leaves skin feeling smooth, soothed, clean, and radiant. Plant based jojoba oil helps skin feels nourished and soft after cleansing', 
                '[ MAKEUP CLEANSING BALM FOR SENSITIVE SKIN ] Formulated with jojoba oil and ceramides, the hydrating formula is fragrance-free, paraben-free, soap-free, allergy-tested, suitable for sensitive skin, and non-comedogenic so it will not clog your pores', 
                '[ 3 ESSENTIAL CERAMIDES ] Ceramides are found naturally in the skin and make up 50% of the lipids in the skin barrier. All CeraVe products, formulated with three essential ceramides (1, 3, 6-II)to help maintain the skin’s natural barrier', 
                '[ DEVELOPED WITH DERMATOLOGISTS ] CeraVe Skincare is developed with dermatologists and has products suitable for dry skin, sensitive skin, oily skin, acne-prone, and more', 
            ]),
            details_1 = json.dumps([
                'Brand;CeraVe',
                'Item Weight;1.6 Ounces',
                'Item dimensions L x W x H;2.23 x 2.23 x 1.87 inches',
                'Scent;Fragrance Free',
                'Age Range (Description);Youth',
            ]),
            details_2 = json.dumps([
                'Product Dimensions;2.23 x 2.23 x 1.87 inches; 1.6 ounces',
                'Item model number;S4752900',
                'UPC;301871373140',
                'Manufacturer;CeraVe',
                'ASIN;B0B1PP1XCM',
                'Country of Origin;USA',
            ]),
            card_thumbnail = 'https://m.media-amazon.com/images/I/71iJfJSDcQL._AC_UL480_FMwebp_QL65_.jpg',
            thumbnails = json.dumps([
                'https://m.media-amazon.com/images/I/31kOCqV2+BL._SS40_.jpg', 
                'https://m.media-amazon.com/images/I/51QuRrC2AvL._SS40_.jpg', 
                'https://m.media-amazon.com/images/I/614lS4iyCEL._SS40_.jpg', 
                'https://m.media-amazon.com/images/I/51quzlRbXQL._SS40_.jpg', 
                'https://m.media-amazon.com/images/I/41Fy-k1aGKL._SS40_.jpg', 
                'https://m.media-amazon.com/images/I/51WnYPjt2ML._SS40_.jpg', 
            ]),
            images = json.dumps([
                'https://m.media-amazon.com/images/I/71iJfJSDcQL._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/A1eX8t35npL._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/916FClh7QEL._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/91RSbzoi+5L._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/71nVhZCbloL._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/81YVWL-0KwL._SX679_.jpg', 
            ]),
            category = cats[0],
            seller = sell01,
        ))

        items.append(Item(
            name = 'Dove Nourishing Body Care, Face, Hand, and Body Beauty Cream for Normal to Dry Skin Lotion for Women with 24-Hour Moisturization, 4-Pack, 2.53 Oz Each Jar',
            brand = 'Dove',
            default_item_idx = 0,
            prices = json.dumps([8.79, ]),
            discount_prices = json.dumps([8.79, ]),
            amounts = json.dumps([2.53, ]),
            units = json.dumps(['Fl Oz', ]),
            packs = json.dumps([4, ]),
            about_item = json.dumps([
                "Rich Formula: 24 Hour Moisturization leaving skin feeling soft and hydrated.", 
                "Complete Daily Skincare: Use it day and night, can be used for face and body.", 
                "Suitable for all skin types: It’s perfect for all skin types, fast absorbing and non-greesy.", 
                "Luxurious Texture: Dove Beauty Cream has a light texture, so it nourishes skin without leaving behind any residue, just touchable smooth skin that feels as beautiful as it looks..", 
            ]),
            details_1 = json.dumps([
                'Brand;Dove',
                'Item Volume;2.53 Fluid Ounces',
                'Item dimensions L x W x H;3.05 x 3.05 x 1 inches',
                'Age Range (Description);Adult',
                'Special Feature;Lightweight',
            ]),
            details_2 = json.dumps([
                'Product Dimensions;3.05 x 3.05 x 1 inches; 13.44 ounces',
                'UPC;850050048305 859581006532',
                'Manufacturer;UNILEVER INTL',
                'ASIN;B0C1TGGKH8',
                'Country of Origin;India',
            ]),
            card_thumbnail = 'https://m.media-amazon.com/images/I/71YIpAQ9WYL._AC_UL480_FMwebp_QL65_.jpg',
            thumbnails = json.dumps([
                'https://m.media-amazon.com/images/I/41zkCYddYeL._SS40_.jpg', 
                'https://m.media-amazon.com/images/I/41COJTWkwzL._SS40_.jpg', 
                'https://m.media-amazon.com/images/I/41NhDKtiE2L._SS40_.jpg', 
                'https://m.media-amazon.com/images/I/41DoTAT5Q5L._SS40_.jpg', 
                'https://m.media-amazon.com/images/I/41X16A1oSyS._SS40_.jpg', 
                'https://m.media-amazon.com/images/I/41+U8OUquVS._SS40_.jpg', 
            ]),
            images = json.dumps([
                'https://m.media-amazon.com/images/I/71YIpAQ9WYL._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/81rnyocvfNL._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/81QhUTt--ZL._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/81iywT7S4sL._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/81SsiBfFjSS._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/61krT0BrqoS._SY879_.jpg', 
            ]),
            category = cats[0],
            seller = sell01,
        ))

        # items.append(Item(
        #     name = ,
        #     brand = ,
        #     default_item_idx = ,
        #     prices = json.dumps([]),
        #     discount_prices = json.dumps([]),
        #     amounts = json.dumps([]),
        #     units = json.dumps([]),
        #     packs = json.dumps([]),
        #     about_item = json.dumps([]),
        #     details_1 = json.dumps({}),
        #     details_2 = json.dumps({}),
        #     card_thumbnail = ,
        #     thumbnails = json.dumps([]),
        #     images = json.dumps([]),
        #     category = ,
        #     seller = sell01,
        # ))
    
        db.session.add_all(items)

        db.session.commit()
