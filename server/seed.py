#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Seller, Customer, Category, Item, CartItem, OrderItem, Order, Review
import json
import copy

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
        users = []
        for i in range(25):
            users.append(User(
                username=f'cust{i}' if i < 20 else f'sell{i-20}',
                password_hash=f'cust{i}' if i < 20 else f'sell{i-20}',
                phone=f'{i%10}00){i%10}00-{i%10}000',
                email=f'cust{i}@gmail.com' if i < 20 else f'sell{i-20}@gmail.com',
                street_1=f'{i%10}0000 Palmer Blvd',
                street_2='',
                city='Huston',
                state='TX',
                zip_code=f'{i%10}1111'
            ))

        customers = []
        for i in range(20):
                customers.append(Customer(
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                mobile=fake.numerify('###-###-####'),
                nickname=users[i].username,
                user = users[i]
            ))

        sellers = []
        for i in range(5):
            sellers.append(Seller(
                name=fake.company(),
                user = users[i+20]
            ))
        
        db.session.add_all(users)
        db.session.add_all(customers)
        db.session.add_all(sellers)
        db.session.commit()

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
        # Items : 'Beauty & Personal Care',
        ############################################################################
        items = []
        items.append(Item(
            name = "Dove Skin Care Beauty Bar For Softer Skin Cucumber and Green Tea More Moisturizing Than Bar Soap 3.75 oz, 14 Bars",
            brand = 'Dove',
            default_item_idx = 2,
            prices = [9.71, 10.97, 21.47, 33.96, 20.98, ],
            discount_prices = [9.22, 10.97, 18.63, 30.34, 20.98, ],
            amounts = [3.75, 3.75, 3.75, 3.75, 4.0, ],
            units = ['ounce', 'ounce', 'ounce', 'ounce', 'ounce', ],
            packs = [6, 8, 14, 24, 12, ],
            about_item = [
                 "REFRESHES SKIN: Dove Cool Moisture Beauty Bar combines the refreshing scents of cucumber and green tea with Dove mild cleansers for skin care to revitalize both your senses and your skin",
                 "#1 DERMATOLOGIST RECOMMENDED: Dove Beauty Bar is the #1 dermatologist-recommended Beauty Bar in the U.S",
                 "MILD & MOISTURIZING: With ¼ moisturizing cream, Dove Beauty Bar helps your skin maintain its natural moisture barrier and keeps skin hydrated as part of your skin care routine",
                 "VERSATILE CLEANSER: The unique formulation for effective skin care can be enjoyed by the entire family as this all-in-one cleanser nourishes your face, body, and hands for beautiful skin",
                 "EFFECTIVE CLEANSING: Wash away dirt and germs, without drying your skin like ordinary bath soap can. This beauty bar is gentle enough to use every day on your body and your face",
                 "THOUGHTFULLY MADE SKIN CARE: This Beauty Bar is Certified Cruelty-Free by PETA and sulfate free cleansers, so you can feel good about switching from ordinary bar soap to Dove",
            ],
            details_1 = [
                 'Brand;-;Dove',
                 'Item Weight;-;0.57 Grams',
                 'Item dimensions L x W x H;-;4.13 x 2.5 x 725 inches',
                 'Scent;-;Cucumber, Green Tea',
                 'Age Range (Description);-;Adult',
            ],
            details_2 = [
                 'Is Discontinued By Manufacturer;-;No',
                 'Product Dimensions;-;4.13 x 2.5 x 725 inches; 0.02 ounces',
                 'Item model number;-;011111611177',
                 'UPC;-;011111611177',
                 'Manufacturer;-;Unilever',
                 'ASIN;-;B0016FWFDI',
                 'Country of Origin;-;USA',
            ],
            images = [
                 'https://m.media-amazon.com/images/I/71P6h4i-EHL._SX679_.jpg',
                 'https://m.media-amazon.com/images/I/71Z4oxHuxpL._SX679_.jpg',
                 'https://m.media-amazon.com/images/I/81dEJSdQasL._SX679_.jpg',
                 'https://m.media-amazon.com/images/I/71am83eSw9L._SX679_.jpg',
                 'https://m.media-amazon.com/images/I/61PtStpsLxL._SX679_.jpg',
                 'https://m.media-amazon.com/images/I/71K7V0lKJ0L._SX679_.jpg',
            ],
            accum_sales_cnt = 0,
            avg_review_rating = 0,
            accum_review_cnt = 0,
            category = cats[0],
            seller = sellers[0],
        ))
    
        items.append(Item(
            name = 'BodyRefresh Shower Steamers Aromatherapy - 8 Pack Shower Bombs with Essential Oils. Self Care Birthday Gifts for Women, Gifts for Her, Mothers Day Gifts for Wife Mom from Daughter',
            brand = 'BodyRefresh',
            default_item_idx = 0,
            prices = [9.99, ],
            discount_prices = [9.99, ],
            amounts = [8, ],
            units = ['count', ],
            packs = [1, ],
            about_item = [
                "Luxurious Self Care - BodyRefresh use small batches of steam distillation to concentrate natural essential oils. Scent lasts up to 2 times longer than others. Experience aromatherapy from an organic farm, these shower bombs are designed to provide a rejuvenating and relaxing shower. Perfect for birthday gifts for women, mothers day gifts for mom from daughter son, gifts for her.", 
                "Eight Natural Scents - Shower steamers natural scents including eucalyptus, lavender, mint, rose, grapefruit, watermelon, citrus, bergamot. Let the soothing aroma envelop your senses, creating a tranquil atmosphere in your shower, luxurious self-care. The perfect gifts for women men her him, mother's day gift ideas.", 
                "Long-Lasting, Potently Fragrant - Each BodyRefresh shower steamer is infused with more natural essential oils than any other shower steamer. Enjoy more than 2 times the aromatic for a relaxing shower that invigorates the mind and body.", 
                "Home Spa - Take a moment to escape from the daily hustle and bustle with shower steamers. These shower steamers create a serene and spa-like ambiance. Enjoy a peaceful and rejuvenating shower experience with Bodyrefresh, the perfect teacher appreciation gifts for women, mothers day gifts for wife.", 
                "The Greatest Mothers Day Gifts - 8 shower steamers individually exquisite packaged, perfect for birthday gifts for women, gifts for mom her. Also can be unique mom gifts for mothers day.", 
            ],
            details_1 = [
                'Brand;-;BodyRefresh',
                'Scent;-;Citrus,Eucalyptus,Lavender,Watermelon,Grape,Rose',
                'Age Range (Description);-;Adult',
                'Recommended Uses For Product;-;Relaxation',
                'Product Benefits;-;Aromatherapy,Relaxation,Stress Relief,Home Spa',
            ],
            details_2 = [
                'Package Dimensions;-;6.77 x 2.83 x 2.68 inches; 10.86 ounces',
                'Date First Available;-;September 19, 2023',
                'Manufacturer;-;BodyRefresh',
                'ASIN;-;B0CF58LSJN',
            ],
            images = [
                'https://m.media-amazon.com/images/I/81J+Ff0wPYL._AC_SX679_.jpg',
                'https://m.media-amazon.com/images/I/81q3m+sFAPL._AC_SX679_.jpg',
                'https://m.media-amazon.com/images/I/71YWvp-FakL._AC_SX679_.jpg',
                'https://m.media-amazon.com/images/I/71WRjYJTBlL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/71LJewiZu0L._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/71YrWM4gBiL._AC_SX679_.jpg', 
            ],
            accum_sales_cnt = 0,
            avg_review_rating = 0,
            accum_review_cnt = 0,
            category = cats[0],
            seller = sellers[0],
        ))

        items.append(Item(
            name = "eos Shea Better Body Lotion- Jasmine Peach, 24-Hour Moisture Skin Care, Lightweight & Non-Greasy, Made with Natural Shea, Vegan, 16 fl oz",
            brand = 'eos',
            default_item_idx = 0,
            prices = [10.99, 21.98, ],
            discount_prices = [8.98, 17.97, ],
            amounts = [16, 16, ],
            units = ['Fl Oz', 'Fl Oz', ],
            packs = [1, 2, ],
            about_item = [
                "SHEA BETTER BODY LOTION: Our bright and juicy Pomegranate Raspberry scent contains fragrance notes of sweet pomegranate, tart raspberries and lotus blossom. eos 24-hour hydration body lotion is made with natural ingredients to leave your skin smooth from head-to-toe.",
                "SHEA BETTER BODY LOTION: Our sparkling and luscious Jasmine Peach scent contains fragrance notes of apricot nectar, sparkling jasmine, and vanilla sugar. eos 24-hour hydration body lotion is made with natural ingredients to leave your skin smooth from head-to-toe.",
                "24-HOUR MOISTURE FOR YOUR BODY: Soothe and protect your skin with our lightweight and non-greasy lotion. No sticky residue or heaviness, just all-day hydration and smooth skin.",
                "SMOOTH ON: Apply this fast-absorbing and deliciously scented body lotion to just-cleaned skin, paying special attention to dry, rough areas. Relax – we’ll do the rest.", 
                "SUSTAINABLE SKIN CARE: Protect and moisturize your skin with 7 nourishing oils + butters, including natural shea butter and shea oil. Our collection of incredible fragrances will delight in application and last all day on skin",
                "ALL-NATURAL SHEA BUTTER: eos products have wild grown, sustainably-sourced 100% natural shea butter to make skin feel moisturized, protected and soft. We are paraben, phthalate and gluten free. Dermatologist tested. Vegan. Hypoallergenic. PETA certified. No products tested on animals.",
            ],
            details_1 = [
                'Brand;-;eos',
                'Item Volume;-;16 Fluid Ounces',
                'Age Range (Description);-;Adult',
                'Special Feature;-;Lightweight, Hypoallergenic',
                'Skin Type;-;Dry',
            ],
            details_2 = [
                'Manufacturer;-;eos',
                'ASIN;-;B0CCZKRRCX',
            ],
            images = [
                'https://m.media-amazon.com/images/I/61pZYk39B+L._SX679_.jpg',
                'https://m.media-amazon.com/images/I/61csXf8B7ZL._SX679_.jpg',
                'https://m.media-amazon.com/images/I/61HlvDn5o9L._SX679_.jpg',
                'https://m.media-amazon.com/images/I/61hKfLakaqL._SX679_.jpg',
                'https://m.media-amazon.com/images/I/51xCmWZSLNL._SX679_.jpg',
                'https://m.media-amazon.com/images/I/51r-23IdTAL._SX679_.jpg',
            ],
            accum_sales_cnt = 0,
            avg_review_rating = 0,
            accum_review_cnt = 0,
            category = cats[0],
            seller = sellers[0],
        ))

        items.append(Item(
            name = 'CeraVe Cleansing Balm for Sensitive Skin | Hydrating Makeup Remover with Ceramides and Plant-based Jojoba Oil for Face | Non-Comedogenic Fragrance Free Non-Greasy |1.3 Ounces',
            brand = 'CeraVe',
            default_item_idx = 0,
            prices = [10.99, ],
            discount_prices = [9.97, ],
            amounts = [1.3, ],
            units = ['Ounce', ],
            packs = [1, ],
            about_item = [
                '[ CLEANSING BALM FOR FACE ] CeraVe Hydrating cleansing balm – with 3 essential ceramides- effectively removes the most long-lasting makeup, including waterproof mascara, moisturizes the skin. Skin does not feel greasy after cleansing', 
                '[ MAKEUP BALM REMOVER WITH JOJOBA OIL ] Gentle and effective formula leaves skin feeling smooth, soothed, clean, and radiant. Plant based jojoba oil helps skin feels nourished and soft after cleansing', 
                '[ MAKEUP CLEANSING BALM FOR SENSITIVE SKIN ] Formulated with jojoba oil and ceramides, the hydrating formula is fragrance-free, paraben-free, soap-free, allergy-tested, suitable for sensitive skin, and non-comedogenic so it will not clog your pores', 
                '[ 3 ESSENTIAL CERAMIDES ] Ceramides are found naturally in the skin and make up 50% of the lipids in the skin barrier. All CeraVe products, formulated with three essential ceramides (1, 3, 6-II)to help maintain the skin’s natural barrier', 
                '[ DEVELOPED WITH DERMATOLOGISTS ] CeraVe Skincare is developed with dermatologists and has products suitable for dry skin, sensitive skin, oily skin, acne-prone, and more', 
            ],
            details_1 = [
                'Brand;-;CeraVe',
                'Item Weight;-;1.6 Ounces',
                'Item dimensions L x W x H;-;2.23 x 2.23 x 1.87 inches',
                'Scent;-;Fragrance Free',
                'Age Range (Description);-;Youth',
            ],
            details_2 = [
                'Product Dimensions;-;2.23 x 2.23 x 1.87 inches; 1.6 ounces',
                'Item model number;-;S4752900',
                'UPC;-;301871373140',
                'Manufacturer;-;CeraVe',
                'ASIN;-;B0B1PP1XCM',
                'Country of Origin;-;USA',
            ],
            images = [
                'https://m.media-amazon.com/images/I/71iJfJSDcQL._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/A1eX8t35npL._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/916FClh7QEL._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/91RSbzoi+5L._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/71nVhZCbloL._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/81YVWL-0KwL._SX679_.jpg', 
            ],
            accum_sales_cnt = 0,
            avg_review_rating = 0,
            accum_review_cnt = 0,
            category = cats[0],
            seller = sellers[0],
        ))

        items.append(Item(
            name = 'Dove Nourishing Body Care, Face, Hand, and Body Beauty Cream for Normal to Dry Skin Lotion for Women with 24-Hour Moisturization, 4-Pack, 2.53 Oz Each Jar',
            brand = 'Dove',
            default_item_idx = 0,
            prices = [8.79, ],
            discount_prices = [8.79, ],
            amounts = [2.53, ],
            units = ['Fl Oz', ],
            packs = [4, ],
            about_item = [
                "Rich Formula: 24 Hour Moisturization leaving skin feeling soft and hydrated.", 
                "Complete Daily Skincare: Use it day and night, can be used for face and body.", 
                "Suitable for all skin types: It’s perfect for all skin types, fast absorbing and non-greesy.", 
                "Luxurious Texture: Dove Beauty Cream has a light texture, so it nourishes skin without leaving behind any residue, just touchable smooth skin that feels as beautiful as it looks..", 
            ],
            details_1 = [
                'Brand;-;Dove',
                'Item Volume;-;2.53 Fluid Ounces',
                'Item dimensions L x W x H;-;3.05 x 3.05 x 1 inches',
                'Age Range (Description);-;Adult',
                'Special Feature;-;Lightweight',
            ],
            details_2 = [
                'Product Dimensions;-;3.05 x 3.05 x 1 inches; 13.44 ounces',
                'UPC;-;850050048305 859581006532',
                'Manufacturer;-;UNILEVER INTL',
                'ASIN;-;B0C1TGGKH8',
                'Country of Origin;-;India',
            ],
            images = [
                'https://m.media-amazon.com/images/I/71YIpAQ9WYL._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/81rnyocvfNL._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/81QhUTt--ZL._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/81iywT7S4sL._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/81SsiBfFjSS._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/61krT0BrqoS._SY879_.jpg', 
            ],
            accum_sales_cnt = 0,
            avg_review_rating = 0,
            accum_review_cnt = 0,
            category = cats[0],
            seller = sellers[0],
        ))

        items.append(Item(
            name = 'Under Eye Patches - 60 Pcs - 24K Gold Eye Mask- Puffy Eyes & Dark Circles Treatments,Reduce Under Eye Bags and Smooth Wrinkles,Eye Skin Care Pads With Collagen,Hyaluronic Acid & Castor Oil',
            brand = 'NAZANO',
            default_item_idx = 0,
            prices = [10.99, ],
            discount_prices = [8.99, ],
            amounts = [30, ],
            units = ['Count', ],
            packs = [1, ],
            about_item = [
                "💖💖【Puffy Eyes And Dark Circles Treatment】: Our castor oil under eye patches are highly effective eye skin care treatment which will quickly work against skin aging, smooth wrinkles & fine lines, eliminate dark circles, remove puffiness and speed up cell and collagen Rejuvenation. These under eye patches for dark circles and puffiness make a great beauty gifts for women. Our under eye patches for puffy eyes are truly worth having", 
                "💖💖【Hydrating & Moisturizing】: Hyaluronic acid and castor oil in these under eye pads helps to hydrate and moisturize your skin，providing long-lasting effect,you will notice your skin refreshed and hydrated from the very first application.Reveal a younger-looking you. Our under eye patches for wrinkles and fine lines is a great anti-aging product",
                "💖💖【Safe & Effective Formula】: Infused with a blend of collagen,castor oil, 24k gold, glycerin and multiple forms of hyaluronic acid which can quickly penetrate into the basal layer, deeply repair the eye skin and promote blood circulation,100% safe without any side effects. Our eye masks for dark circles and puffiness are formulated to be gentle yet effective on all skin types",
                "💖💖【Easy To Use】: We understand that skincare should be effective and convenient. Our under eye patches with castor oil are designed for easy application and quick absorption. Clean your face and eyes with warm water, then apply our eye mask skincare product - the eye pads, under your eyes and press gently to secure them. Keep it for 20 minutes, remove the eye pads and gently pat the remaining essence. Use twice a day or at least once a week for optimal results",
                "💖💖【Perfect For Both Men & Women】: Our gold under eye mask with castor oil helps visibly awaken and brighten eyes in just 20 minutes, perfect for using after a sleepless night to get rid of dark circles under the eyes, or just to remove puffiness before a big event. Our under eye patches for dark circles are very popular",
            ],
            details_1 = [
                'Brand;-;NAZANO',
                'Item Form;-;Sheet',
                'Product Benefits;-;Hydrating, Dark Circles, Fine Lines Treatment, Puffiness, Moisturizing, Brightening',
                'Scent;-;Unscented',
                'Material Type Free;-;DMDM Hydantoin Free',
            ],
            details_2 = [
                'Package Dimensions;-;3.23 x 3.19 x 1.65 inches; 5.93 ounces',
                'UPC;-;728872589972',
                'Manufacturer;-;NAZANO-1',
                'ASIN;-;B09NXS395V',
                'Country of Origin;-;China',
            ],
            images = [
                'https://m.media-amazon.com/images/I/71ViE-GAVOL._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/71Xl+8mj50L._SX679_.jpg',
                'https://m.media-amazon.com/images/I/817SnkTt3zL._SX679_.jpg',
                'https://m.media-amazon.com/images/I/71yoEipK7RL._SX679_.jpg',
                'https://m.media-amazon.com/images/I/71qTYYvrpML._SX679_.jpg',
                'https://m.media-amazon.com/images/I/71TpO-lGNWL._SX679_.jpg',
            ],
            accum_sales_cnt = 0,
            avg_review_rating = 0,
            accum_review_cnt = 0,
            category = cats[0],
            seller = sellers[0],
        ))

        items.append(Item(
            name = 'Cordless Water Flosser Teeth Cleaner, Nicefeel 300ML 2 Tip Cases Portable and USB Rechargeable Oral Irrigator for Travel, IPX7 Waterproof, 3-Mode Water Flossing with 4 Jet Tips for Home Blue',
            brand = 'Nicefeel',
            default_item_idx = 0,
            prices = [34.99, ],
            discount_prices = [34.99, ],
            amounts = [1, ],
            units = ['Count', ],
            packs = [1, ],
            about_item = [
                "Detachable and Cleanable Water Tank with 300ml Capacity: The Nicefeel flosser has a 300ml water tank for uninterrupted use and easy cleaning with its open and detachable design. Its patented leak-proof drainage design ensures safety, comfort, and an extended lifespan.", 
                "Efficiently Improves Gum Health and Teeth Cleaning: Nicefeel cordless water flosser with 1800 times/minute high pressure water pulse, 4 jet water flosser, and 360°rotating long nozzle effectively cleans 99.99% of food residues in every corner that traditional brushing can't reach. Specifically designed for those with periodontitis and braces.", 
                "Memory Function with 3 Cleaning Modes: Nicefeel cordless oral flosser features Normal, Soft, and Pulse modes to meet various oral cleaning needs. Its low-noise design allows for a peaceful flossing experience. With the innovative Memory Function, you can preset your preferred mode before use and keep using it even after the device has been turned off.", 
                "Memory Function with 3 Cleaning Modes: Nicefeel cordless oral flosser features Normal, Soft, and Pulse modes to meet various oral cleaning needs. Its low-noise design allows for a peaceful flossing experience. With the innovative Memory Function, you can preset your preferred mode before use and keep using it even after the device has been turned off.", 
                "Memory Function with 3 Cleaning Modes: Nicefeel cordless oral flosser features Normal, Soft, and Pulse modes to meet various oral cleaning needs. Its low-noise design allows for a peaceful flossing experience. With the innovative Memory Function, you can preset your preferred mode before use and keep using it even after the device has been turned off.", 
            ],
            details_1 = [
                'Brand;-;Nicefeel',
                'Power Source;-;Battery Powered',
                'Special Feature;-;Portable, Multiple Pressure Settings, Multiple Operation Modes, Rechargeable, Multiple Tips',
                'Product Benefits;-;Cleansing',
                'Unit Count;-;1 Count',
            ],
            details_2 = [
                'Is Discontinued By Manufacturer;-;No',
                'Product Dimensions;-;1.57 x 1.18 x 8.66 inches; 9.6 ounces',
                'Item model number;-;FC159',
                'Department;-;Unisex',
                'Batteries;-;1 Lithium Polymer batteries required. (included)',
                'Date First Available;-;January 10, 2019',
                'Manufacturer;-;FlyCat',
                'ASIN;-;B07MJKW1HC',
                'Country of Origin;-;China',
            ],
            images = [
                'https://m.media-amazon.com/images/I/61tIviR9GvL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/71ZVz6+QMSL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/61cq4tcLLoL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/61vkLhbyOML._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/71vnA8Vg55L._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/616eU83jddL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/7134qvocBUL._AC_SX679_.jpg',
            ],
            accum_sales_cnt = 0,
            avg_review_rating = 0,
            accum_review_cnt = 0,
            category = cats[0],
            seller = sellers[0],
        ))

        items.append(Item(
            name = "eos Shea Better Shaving Cream- Pomegranate Raspberry, Women's Shave Cream, Skin Care, Doubles as an In-Shower Lotion, 24-Hour Hydration, 7 fl oz",
            brand = 'eos',
            default_item_idx = 0,
            prices = [4.99, 9.13,],
            discount_prices = [3.97, 9.13,],
            amounts = [7, 7,],
            units = ['Fl Oz', 'Fl Oz',],
            packs = [1, 2, ],
            about_item = [
                "24 Hour Hydration: Shaving cream includes vitamin C and vitamin E to support healthy skin and aloe to condition and nourish", 
                "Smooth Application: Shave any time of day for incredibly smooth skin that also helps prevent nicks and cuts; Use wet or dry", 
                "Sustainably Sourced: Shave cream is packed with natural shea butter and oil to keep your skin feeling hydrated and beautiful", 
                "Pomegranate Raspberry Fragrance: Notes of sweet pomegranate, tart raspberries and watery lotus blossom", 
                "Clean Skin Care: Formulated without parabens or phthalates; Gluten Free", 
            ],
            details_1 = [
                'Brand;-;eos',
                'Item Form;-;Cream',
                'Scent;-;Pomegranate Raspberry',
                'Material Type Free;-;Phthalate Free, Paraben Free',
                'Skin Type;-;All',
            ],
            details_2 = [
                'Is Discontinued By Manufacturer;-;No',
                'Product Dimensions;-;1.89 x 1.89 x 7.87 inches; 6.9 ounces',
                'Item model number;-;600',
                'UPC;-;801722610740 689978254778 892992002007',
                'Manufacturer;-;eos',
                'ASIN;-;B001KYQF3Q',
                'Country of Origin;-;USA',
            ],
            images = [
                'https://m.media-amazon.com/images/I/610feTlA2fL._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/519XZNLsShL._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/61NSMlV346L._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/71llz+wF38L._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/51xCmWZSLNL._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/61aqCDtb3mL._SX679_.jpg', 
            ],
            accum_sales_cnt = 0,
            avg_review_rating = 0,
            accum_review_cnt = 0,
            category = cats[0],
            seller = sellers[0],
        ))

        items.append(Item(
            name = 'Bio-Oil Skincare Body Oil, Vitamin E, Serum for Scars & Stretchmarks, Face & Body Moisturizer, 2 oz, All Skin Types',
            brand = 'Bio-Oil',
            default_item_idx = 0,
            prices = [13.59, 32.64],
            discount_prices = [11.12, 28.29],
            amounts = [2, 6.7],
            units = ['Fl Oz', 'Fl Oz'],
            packs = [1, 1],
            about_item = [
                "HELPS IMPROVES APPEARANCE OF SCARS AND STRETCH MARKS - Dermatologist recommended and clinically proven for scars, stretch marks, uneven skin tone and so much more", 
                "PACKED WITH NATUAL OILS - Vitamin E helps maintain healthy looking skin while natural Chamomile and Lavender Oil calm and soothe", 
                "LOCKS IN ESSENTIAL HYDRATION WITHOUT CLOGGING PORES - Bio-Oil Skincare Oil is a uniquely formulated, non-greasy body oil that hydrates skin and helps retain essential moisture", 
                "PLANET & ANIMAL FRIENDLY — Vegan friendly, paraben free, cruelty free, non-comedogenic, and 100% recyclable", 
                "FORMULATED FOR ALL SKIN TYPES - Helps soften skin for all types, tones, textures and safe for use on face and body and won't clog pores", 
            ],
            details_1 = [
                'Brand;-;Bio-Oil',
                'Item Volume;-;60 Milliliters',
                'Item dimensions L x W x H;-;5.75 x 4.56 x 9.81 inches',
                'Age Range (Description);-;Adult',
                'Special Feature;-;Scented',
            ],
            details_2 = [
                'Is Discontinued By Manufacturer;-;No',
                'Product Dimensions;-;5.75 x 4.56 x 9.81 inches; 2 ounces',
                'Manufacturer recommended age;-;6 months - 3 years',
                'Item model number;-;29120',
                'Department;-;GNC|ALL|ALL|COSMETICS',
                'Date First Available;-;September 4, 2007',
                'Manufacturer;-;Kao USA Inc.',
                'ASIN;-;B000VPPUEA',
                'Country of Origin;-;South Africa',
            ],
            images = [
                'https://m.media-amazon.com/images/I/81gqpI-3NgL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/81jCcOa9HJL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/71L2xhbuJNL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/71DYzXlygJL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/81U-OaRCCYL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/710Y6G6egPL._AC_SX679_.jpg', 
            ],
            accum_sales_cnt = 0,
            avg_review_rating = 0,
            accum_review_cnt = 0,
            category = cats[0], 
            seller = sellers[0],
        ))

        items.append(Item(
            name = 'Crest 3D Whitestrips, Professional Effects, Teeth Whitening Strip Kit, 44 Strips (22 Count Pack)',
            brand = 'Crest',
            default_item_idx = 0,
            prices = [45.05, ],
            discount_prices = [45.05, ],
            amounts = [22, ],
            units = ['Count', ],
            packs = [1, ],
            about_item = [
                "20 Levels Whiter in just 22 days", 
                "#1 Dentist recommended at-home teeth whitening brand", 
                "Uses the same whitening ingredient as dentists", 
                "Enamel Safe & Effective", 
            ],
            details_1 = [
                'Brand;-;Crest',
                'Active Ingredients;-;Hydrogen Peroxide',
                'Product Benefits;-;Whitening',
                'Item Form;-;Strip',
                'Number of Items;-;1',
            ],
            details_2 = [
                'Is Discontinued By Manufacturer;-;No',
                'Product Dimensions;-;5.43 x 1.81 x 5.9 inches; 1.76 ounces',
                'Item model number;-;3116194',
                'UPC;-;037000857785 042822199067',
                'Manufacturer;-;Procter & Gamble',
                'ASIN;-;B00AHAWWO0',
                'Country of Origin;-;USA',
            ],
            images = [
                'https://m.media-amazon.com/images/I/61IylKAap-L._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/71mN5K-uphL._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/71XXSuS6tVL._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/71jzAS5xTML._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/71A+Z7nS0WL._SX679_.jpg', 
                'https://m.media-amazon.com/images/I/61mxcHuwF-L._SX679_.jpg', 
            ],
            accum_sales_cnt = 0,
            avg_review_rating = 0,
            accum_review_cnt = 0,
            category = cats[0], 
            seller = sellers[0],
        ))

        ############################################################################
        # Items : 'Cleaning Supplies',
        ############################################################################

        items.append(Item(
            name = 'Clorox Disinfecting Wipes Value Pack, Bleach Free Cleaning Wipes, 75 Count Each, Pack of 2, Packaging May Vary',
            brand = 'Clorox',
            default_item_idx = 0,
            prices = [11.49, 14.99, 16.62,],
            discount_prices = [9.68, 14.24, 16.62,],
            amounts = [75, 75, 75, ],
            units = ['Count', 'Count', 'Count',],
            packs = [2, 3, 4, ],
            about_item = [
                "CLEANS 3X BETTER: These all purpose disposable wipes with TripleWeave texture kill germs, cleans tough messes and removes 99.9% of allergens on surfaces like kitchen counters bathroom surfaces and more*; Package may vary", 
                "DISINFECTING WIPES: Clorox Disinfecting Wipes are proven to kill COVID 19 Virus* in 15 seconds; cleans and kills 99.9% of viruses and bacteria", 
                "MULTI SURFACE CLEANER: Wipes are safe for use on hard non-porous surfaces such as finished wood, sealed granite, stainless steel and non food contact surfaces in the home, office, classroom, car interiors and more", 
                "DISPOSABLE WIPES: These 75 count 3 pack wipe canisters easily dispenses disposable antibacterial wipes with a lemon scent; dispose of wipes according to manufacturer instructions; DO NOT FLUSH", 
                "NO BLEACH: Disinfect and deodorize with Clorox Disinfecting Wipes for a bleach free cleaning alternative. Great for cleaning fabrics and removing stains such as grass, sweat, food, ink and make-up.", 
            ],
            details_1 = [
                'Brand;-;Clorox',
                'Sheet Count;-;225',
                'Package Information;-;Canister',
                'Item Form;-;Wipes',
                'Surface Recommendation;-;Floor',
            ],
            details_2 = [
                'Package Dimensions;-;9.23 x 9.06 x 4.48 inches; 3.06 Pounds',
                'Item model number;-;TU_3548165',
                'Date First Available;-;October 4, 2023',
                'Manufacturer;-;CLOO7',
                'ASIN;-;B0CKGBWW8D',
                'Country of Origin;-;USA',
            ],
            images = [
                'https://m.media-amazon.com/images/I/81XA8WYaJkL._AC_SX679_PIbundle-2,TopRight,0,0_SH20_.jpg', 
                'https://m.media-amazon.com/images/I/81MkTNb1E+L._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/811VC73bsNL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/81ZyghCO3aL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/9147i+V7q3L._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/81v8jApAVvL._AC_SX679_.jpg', 
            ],
            accum_sales_cnt = 0,
            avg_review_rating = 0,
            accum_review_cnt = 0,
            category = cats[1], 
            seller = sellers[1],
        ))

        items.append(Item(
            name = 'Electric Spin Scrubber Cordless, Electric Scrubber for Cleaning Bathroom with Long Handle, Electric Shower Scrubber, Power Cleaning Brush with 9 Brush Heads for Bathtub Tile Floor Car',
            brand = 'yorraka',
            default_item_idx = 0,
            prices = [49.99, ],
            discount_prices = [35.99, ],
            amounts = [1, ],
            units = ['Count', ],
            packs = [1, ],
            about_item = [
                "【Built-in All-metal Gears and Powerful Motor】Different from the inferior plastic gear structure and low-power motors on the market. Thanks to the high quality all-metal internal gears and high speed powerful motor, Yorraka electric shower scrubber with long handle won't stop working even if you press hard to clean, it can remove stubborn stains and dirt effortlessly. The electric spin scrubber for cleaning bathroom offers 2 speeds for different cleaning needs.", 
                "【Anti-wear 9 Replaceable Brush Heads】The shower cleaner brush is equipped with 9 replaceable brush heads, which can meet your use in almost all scenarios: large flat brush, flat brush, dome brush and corner brush are made of PP bristles, which are very anti-wear and can withstand vigorous pressing for removing stubborn stains. Coral mop, chenille mop, scouring pad and sponge pad are made of different high-quality soft materials to ensure gentle and safe cleaning and waxing on delicate surfaces without leaving any marks.", 
                "【Extendable Long Handle】The bathroom scrubber electric with long handle has a long handle that provides a comfortable grip and allows you to reach difficult areas without straining your back. The spin brush for cleaning is also lightweight and easy to maneuver, making it suitable for all ages and body types.", 
                "【Fast Charging and Long Working Time】Using 7.4V DC high voltage battery and USB type-c fast charging technology, it only takes 2 hours to be fully charged. （Note: Charger Not Included）The bathroom cleaner brush can work continuously for 90 minutes. Cordless design makes it convenient to use it wherever you need it!", 
                "【Various Use Scenarios】Yorraka shower scrubber with long handle for cleaning ideal for cleaning indoor scenes such as bathrooms, kitchens, bathtubs, tiles, glass, floors, etc., and also suitable for outdoor scenes such as cars, swimming pools, and garden floors. Must-have cleaning supplies & cleaning tools to relieve your hands, waist, and knees from fatigue!", 
            ],
            details_1 = [
                'Brand;-;yorraka',
                'Color;-;Whiteblack',
                'Handle Material;-;Stainless Steel',
                'Specific Uses For Product;-;Bathroom, Bathtub, Floor, Carpet, Tile, Marble, Sink, Wheel, Cooktop, Kitchens, Ceiling, Glass, Window, Toilet, Vehicle, Pool, Car',
                'Product Dimensions;-;17.3"L x 6.7"W x 2.8"H',
            ],
            details_2 = [
                'Product Dimensions;-;17.3"L x 6.7"W x 2.8"H',
                'Item model number;-;C2',
                'Date First Available;-;March 7, 2024',
                'Manufacturer;-;yorraka',
                'ASIN;-;B0CSSBBQSL',
                'Country of Origin;-;China',
            ],
            images = [
                'https://m.media-amazon.com/images/I/71e6krwteAL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/71VkeFB+huL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/71shzf0xLWL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/71XD9UfTgXL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/71bcrtXCZfL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/818mBHyiciL._AC_SX679_.jpg', 
            ],
            accum_sales_cnt = 0,
            avg_review_rating = 0,
            accum_review_cnt = 0,
            category = cats[1], 
            seller = sellers[1],
        ))

        items.append(Item(
            name = 'Clorox Toilet Bowl Cleaner, Clinging Bleach Gel, Ocean Mist - 24 Ounces, Pack of 2',
            brand = 'Clorox',
            default_item_idx = 0,
            prices = [5.18, ],
            discount_prices = [5.18, ],
            amounts = [24, ],
            units = ['Ounces', ],
            packs = [2, ],
            about_item = [
                "BLEACH TOILET BOWL CLEANER: Kills 99.9% of germs, and whitens and brightens your toilet bowl with the power of Clorox Bleach and leaves a fresh Ocean Mist scent; Package may vary", 
                "CLOROX TOILET CLEANER: The only Toilet Bowl Cleaner with Clorox Bleach, in a uniquely angled nozzle that let’s you easily target hard to reach areas for the best toilet bowl coverage", 
                "NON-ABRASIVE DISINFECTING BLEACH CLEANER: Thick and powerful disinfecting bleach gel cleaner coats the bowl to dissolve stains and rinses away the grime for a sparkling clean", 
                "BATHROOM CLEANER: Clinging gel formula with Clorox Bleach, let’s you power through the toughest stains and gets your toilet sparkly clean and bright", 
                "DEODORIZING CLEAN: Squirt bleach cleaner under and around the rim, scrub and let sit as it disinfects, whitens and brightens your bowl, then flush for a squeaky clean toilet", 
            ],
            details_1 = [
                'Brand;-;Clorox',
                'Item Form;-;Gel',
                'Scent;-;Ocean',
                'Specific Uses For Product;-;Toilet',
                'Material Feature;-;Scented',
            ],
            details_2 = [
                'Is Discontinued By Manufacturer;-;No',
                'Product Dimensions;-;7.72 x 2.53 x 10.41 inches; 3.28 Pounds',
                'Item model number;-;C-HH447',
                'Date First Available;-;April 18, 2015',
                'Manufacturer;-;Clorox Company',
                'ASIN ;-;B00W5D1MDE',
                'Country of Origin;-;USA',
            ],
            images = [
                'https://m.media-amazon.com/images/I/8128kGBq5PL._AC_SX679_PIbundle-2,TopRight,0,0_SH20_.jpg', 
                'https://m.media-amazon.com/images/I/81-HmhxbcmL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/81RMDGgnTfL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/81dvB-STBIL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/81KqFsmq5GL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/81Lb5I6XiyL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/819t1oTSL-L._AC_SX679_.jpg',
            ],
            accum_sales_cnt = 0,
            avg_review_rating = 0,
            accum_review_cnt = 0,
            category = cats[1], 
            seller = sellers[1],
        ))

        items.append(Item(
            name = 'Lysol Multi-Surface Cleaner, Sanitizing and Disinfecting Pour, to Clean and Deodorize, Sparkling Lemon and Sunflower Essence, 90 Fl Oz',
            brand = 'Lysol',
            default_item_idx = 1,
            prices = [5.97, 6.18, ],
            discount_prices = [5.97, 6.18, ],
            amounts = [48, 90, ],
            units = ['Fl Oz', 'Fl Oz', ],
            packs = [1, 1, ],
            about_item = [
                "Pour directly on stains for spot cleaning", 
                "Dilute in water for use on large surfaces like floors", 
                "Kills 99.9% of viruses bacteria", 
                "Cuts through tough grease grime", 
                "Provides long lasting freshness", 
            ],
            details_1 = [
                'Brand;-;Lysol',
                'Item Form;-;Liquid',
                'Scent;-;Lemon & Sunflower',
                'Specific Uses For Product;-;Floor',
                'Item Volume;-;90 Fluid Ounces',
            ],
            details_2 = [
                'Product Dimensions;-;3.5 x 8 x 10.38 inches; 6.2 Pounds',
                'Item model number;-;3059466',
                'Date First Available;-;August 2, 2018',
                'Manufacturer;-;AmazonUs/RECAS',
                'ASIN ;-;B086LJ2XHC',
                'Country of Origin;-;USA',
            ],
            images = [
                'https://m.media-amazon.com/images/I/81DCKv5m0lL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/81K6LnBFkZL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/81+Uyq+yTbL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/81t-LaaC8sL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/81vaWKTXUOL._AC_SX679_.jpg', 
            ],
            accum_sales_cnt = 0,
            avg_review_rating = 0,
            accum_review_cnt = 0,
            category = cats[1], 
            seller = sellers[1],
        ))

        items.append(Item(
            name = 'Windex Glass and Window Cleaner Spray Bottle, New Packaging Designed to Prevent Leakage and Breaking, Original Blue, 23 fl oz',
            brand = 'Windex',
            default_item_idx = 0,
            prices = [3.97, 4.82, 14.91, 7.15, ],
            discount_prices = [3.48, 3.96, 14.91, 6.45, ],
            amounts = [23, 32, 32, 67.63, ],
            units = ['Fl Oz', 'Fl Oz', 'Fl Oz', 'Fl Oz', ],
            packs = [1, 1, 3, 1, ],
            about_item = [
                "Committed to bottles made from 100% recovered coastal plastic*", 
                "*Recovered Coastal Plastic, in partnership with Plastic Bank, is post-consumer recycled plastic collected on land within 31 miles of an ocean so that it does not reach oceans or landfills.", 
                "Windex Glass Cleaner leaves an unbeatable streak-free shine**_", 
                "**Based on Windex Original lab testing against leading competitor glass cleaners per Nielsen Scantrack US 52 weeks ended 3/29/19.", 
                "Starts working on smudges and fingerprints even before you wipe", 
            ],
            details_1 = [
                'Brand;-;Windex',
                'Item Form;-;Liquid',
                'Scent;-;Original',
                'Specific Uses For Product;-;Window',
                'Material Feature;-;Recycled',
            ],
            details_2 = [
                'Product Dimensions;-;12.01 x 4.37 x 2.72 inches; 1.87 Pounds',
                'Item model number;-;371564',
                'Date First Available;-;August 8, 2023',
                'Manufacturer;-;SC Johnson',
                'ASIN ;-;B0CF3BDBL2',
                'Country of Origin;-;USA',
            ],
            images = [
                'https://m.media-amazon.com/images/I/71+CsG1Y2RL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/61yx26EQuLL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/81l0Oa7Wk6L._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/817zHO1MgmL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/81Kg+SrcnKL._AC_SX679_.jpg', 
                'https://m.media-amazon.com/images/I/81vb9HhKB1L._AC_SX679_.jpg', 
            ],
            accum_sales_cnt = 0,
            avg_review_rating = 0,
            accum_review_cnt = 0,
            category = cats[1], 
            seller = sellers[1],
        ))

        # items.append(Item(
        #     name = '',
        #     brand = '',
        #     default_item_idx = 0,
        #     prices = [8.79, ],
        #     discount_prices = [8.79, ],
        #     amounts = [2.53, ],
        #     units = ['Fl Oz', ],
        #     packs = [4, ],
        #     about_item = [
        #         "", 
        #         "", 
        #         "", 
        #         "", 
        #         "", 
        #         "", 
        #     ],
        #     details_1 = [
        #         ';-;',
        #         ';-;',
        #         ';-;',
        #         ';-;',
        #         ';-;',
        #         ';-;',
        #     ],
        #     details_2 = [
        #         ';-;',
        #         ';-;',
        #         ';-;',
        #         ';-;',
        #         ';-;',
        #         ';-;',
        #     ],
        #     images = [
        #         '', 
        #         '', 
        #         '', 
        #         '', 
        #         '', 
        #         '', 
        #     ],
        #     accum_sales_cnt = 0,
        #     avg_review_rating = 0,
        #     accum_review_cnt = 0,
        #     category = cats[1], 
        #     seller = sellers[1],
        # ))

        for _ in range(30):
            items.append(Item(
                name = fake.catch_phrase(),
                brand = 'Dove',
                default_item_idx = 0,
                prices = [20.50, ],
                discount_prices = [15.79, ],
                amounts = [1, ],
                units = ['Count', ],
                packs = [3, ],
                about_item = [
                    "REFRESHES SKIN: Dove Cool Moisture Beauty Bar combines the refreshing scents of cucumber and green tea with Dove mild cleansers for skin care to revitalize both your senses and your skin",
                    "#1 DERMATOLOGIST RECOMMENDED: Dove Beauty Bar is the #1 dermatologist-recommended Beauty Bar in the U.S",
                    "MILD & MOISTURIZING: With ¼ moisturizing cream, Dove Beauty Bar helps your skin maintain its natural moisture barrier and keeps skin hydrated as part of your skin care routine",
                    "VERSATILE CLEANSER: The unique formulation for effective skin care can be enjoyed by the entire family as this all-in-one cleanser nourishes your face, body, and hands for beautiful skin",
                    "EFFECTIVE CLEANSING: Wash away dirt and germs, without drying your skin like ordinary bath soap can. This beauty bar is gentle enough to use every day on your body and your face",
                    "THOUGHTFULLY MADE SKIN CARE: This Beauty Bar is Certified Cruelty-Free by PETA and sulfate free cleansers, so you can feel good about switching from ordinary bar soap to Dove",
                ],
                details_1 = [
                    'Brand;-;Dove',
                    'Item Weight;-;0.57 Grams',
                    'Item dimensions L x W x H;-;4.13 x 2.5 x 725 inches',
                    'Scent;-;Cucumber, Green Tea',
                    'Age Range (Description);-;Adult',
                ],
                details_2 = [
                    'Is Discontinued By Manufacturer;-;No',
                    'Product Dimensions;-;4.13 x 2.5 x 725 inches; 0.02 ounces',
                    'Item model number;-;011111611177',
                    'UPC;-;011111611177',
                    'Manufacturer;-;Unilever',
                    'ASIN;-;B0016FWFDI',
                    'Country of Origin;-;USA',
                ],
                images = [
                    'https://m.media-amazon.com/images/I/71P6h4i-EHL._SX679_.jpg',
                    'https://m.media-amazon.com/images/I/71Z4oxHuxpL._SX679_.jpg',
                    'https://m.media-amazon.com/images/I/81dEJSdQasL._SX679_.jpg',
                    'https://m.media-amazon.com/images/I/71am83eSw9L._SX679_.jpg',
                    'https://m.media-amazon.com/images/I/61PtStpsLxL._SX679_.jpg',
                    'https://m.media-amazon.com/images/I/71K7V0lKJ0L._SX679_.jpg',
                ],
                accum_sales_cnt = 0,
                avg_review_rating = 0,
                accum_review_cnt = 0,
                category = cats[0], 
                seller = sellers[0],
            ))

        # db.session.add_all(items)
        # db.session.commit()


        ############################################################################
        # Reviews
        ############################################################################

        stars = [1, 2, 3, 4, 5]

        reviews = []
        for i in range(1, 20):
            for item in items: 
                review = Review(
                    rating = rc(stars), 
                    headline = fake.sentence(nb_words=6),
                    content = fake.paragraph(nb_sentences=3),
                    images = '',
                    review_done = 1,
                    item = item, 
                    customer = customers[i]
                )

                reviews.append(review)
                item.accum_review_cnt += 1
                item.avg_review_rating += (review.rating - item.avg_review_rating) / item.accum_review_cnt
        
        db.session.add_all(items)
        db.session.add_all(reviews)
        db.session.commit() 
