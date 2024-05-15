from flask import current_app
from config import db
import sqlalchemy as sa


def add_to_index(index, model):
    if not current_app.elasticsearch:
        return
    
    payload = {}
    for field in model.__searchable__:
        payload[field] = getattr(model, field)
    current_app.elasticsearch.index(index=index, id=model.id, document=payload)

def remove_from_index(index, model):
    if not current_app.elasticsearch:
        return
    
    current_app.elasticsearch.delete(index=index, id=model.id)

def query_index(index, query, page, per_page):
    if not current_app.elasticsearch:
        raise Exception("Elastic search engine not initialized.")
    
    search = current_app.elasticsearch.search(
        index=index,
        query={'multi_match': {'query': query, 'fields': ['*']}},
        from_=(page - 1) * per_page,
        size=per_page
    )
    # print('Search: ', search)
    ids = [int(hit['_id']) for hit in search['hits']['hits']]
    return ids, search['hits']['total']['value']

def delete_index(index):
    if not current_app.elasticsearch or \
        not current_app.elasticsearch.indices.exists(index=index).body:
        print('delete_index: No need to delete.')
        return
    
    print(f'delete_index: deleting index: {index}')
    current_app.elasticsearch.indices.delete(index=index)


##################################################################################

class SearchableMixin(object):
    @classmethod
    def search(cls, expression, page, per_page):
        # print('in SearchableMixin, search')
        ids, total = query_index(cls.__tablename__, expression, page, per_page)
        if total == 0:
            return [], 0
        
        when = []
        for i in range(len(ids)):
            when.append((ids[i], i))
        query = sa.select(cls).where(cls.id.in_(ids)).order_by(db.case(*when, value=cls.id))
        return db.session.scalars(query), total
        
    @classmethod
    def before_commit(cls, session):
        session._changes = {
            'add': list(session.new),
            'update': list(session.dirty),
            'delete': list(session.deleted)
        }
    
    @classmethod
    def after_commit(cls, session):
        for obj in session._changes['add']:
            if isinstance(obj, SearchableMixin):
                add_to_index(obj.__tablename__, obj)
        
        for obj in session._changes['update']:
            if isinstance(obj, SearchableMixin):
                add_to_index(obj.__tablename__, obj)
        
        for obj in session._changes['delete']:
            if isinstance(obj, SearchableMixin):
                remove_from_index(obj.__tablename__, obj)
        
        session._changes = None
    
    @classmethod
    def reindex(cls):
        cls.del_index()

        for obj in db.session.scalars(sa.select(cls)):
            add_to_index(cls.__tablename__, obj)

    @classmethod
    def del_index(cls):
        delete_index(cls.__tablename__)

db.event.listen(db.session, 'before_commit', SearchableMixin.before_commit)
db.event.listen(db.session, 'after_commit', SearchableMixin.after_commit)

##################################################################################