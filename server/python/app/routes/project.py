from flask import Blueprint, request, jsonify
from models import db, Project, ProjectStatus

project_bp = Blueprint('project', __name__)

@project_bp.route('/', methods=['GET'])
def get_projects():
    projects = Project.query.all()
    return jsonify([{
        'id': p.id,
        'title': p.title,
        'description': p.description,
        'status_id': p.status_id
    } for p in projects])

@project_bp.route('/', methods=['POST'])
def create_project():
    data = request.json
    project = Project(
        title=data['title'],
        description=data.get('description'),
        status_id=data.get('status_id')
    )
    db.session.add(project)
    db.session.commit()
    return jsonify({'id': project.id}), 201

@project_bp.route('/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    project = Project.query.get_or_404(project_id)
    data = request.json
    project.title = data.get('title', project.title)
    project.description = data.get('description', project.description)
    project.status_id = data.get('status_id', project.status_id)
    db.session.commit()
    return jsonify({'message': 'Project updated'})

@project_bp.route('/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    project = Project.query.get_or_404(project_id)
    db.session.delete(project)
    db.session.commit()
    return '', 204

@project_bp.route('/statuses', methods=['GET'])
def get_project_statuses():
    statuses = ProjectStatus.query.all()
    return jsonify([{'id': s.id, 'name': s.name} for s in statuses])
