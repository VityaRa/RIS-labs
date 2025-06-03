from flask import Blueprint, request, jsonify
from models import db, Tag

tag_bp = Blueprint('tag', __name__)

@tag_bp.route('/', methods=['GET'])
def get_tags():
    tags = Tag.query.all()
    return jsonify([{'id': t.id, 'title': t.title, 'description': t.description} for t in tags])

@tag_bp.route('/', methods=['POST'])
def create_tag():
    data = request.json
    tag = Tag(title=data['title'], description=data.get('description'))
    db.session.add(tag)
    db.session.commit()
    return jsonify({'id': tag.id}), 201

@tag_bp.route('/<int:tag_id>', methods=['PUT'])
def update_tag(tag_id):
    tag = Tag.query.get_or_404(tag_id)
    data = request.json
    tag.title = data.get('title', tag.title)
    tag.description = data.get('description', tag.description)
    db.session.commit()
    return jsonify({'message': 'Tag updated'})

@tag_bp.route('/<int:tag_id>', methods=['DELETE'])
def delete_tag(tag_id):
    tag = Tag.query.get_or_404(tag_id)
    db.session.delete(tag)
    db.session.commit()
    return '', 204