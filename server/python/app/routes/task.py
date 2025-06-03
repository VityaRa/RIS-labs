from flask import Blueprint, request, jsonify
from models import db, Task, TaskStatus, Tag

task_bp = Blueprint('task', __name__)

@task_bp.route('/', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([{
        'id': t.id,
        'title': t.title,
        'description': t.description,
        'project_id': t.project_id,
        'status_id': t.status_id
    } for t in tasks])

@task_bp.route('/', methods=['POST'])
def create_task():
    data = request.json
    task = Task(
        title=data['title'],
        description=data.get('description'),
        project_id=data.get('project_id'),
        status_id=data.get('status_id')
    )
    db.session.add(task)
    db.session.commit()
    return jsonify({'id': task.id}), 201

@task_bp.route('/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.json
    task.title = data.get('title', task.title)
    task.description = data.get('description', task.description)
    task.project_id = data.get('project_id', task.project_id)
    task.status_id = data.get('status_id', task.status_id)
    db.session.commit()
    return jsonify({'message': 'Task updated'})

@task_bp.route('/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return '', 204

@task_bp.route('/by_tag/<int:tag_id>', methods=['GET'])
def get_tasks_by_tag(tag_id):
    tag = Tag.query.get_or_404(tag_id)
    return jsonify([{'id': t.id, 'title': t.title} for t in tag.tasks])

@task_bp.route('/by_status/<int:status_id>', methods=['GET'])
def get_tasks_by_status(status_id):
    tasks = Task.query.filter_by(status_id=status_id).all()
    return jsonify([{'id': t.id, 'title': t.title} for t in tasks])

@task_bp.route('/statuses', methods=['GET'])
def get_task_statuses():
    statuses = TaskStatus.query.all()
    return jsonify([{'id': s.id, 'name': s.name} for s in statuses])

@task_bp.route('/statuses', methods=['POST'])
def create_task_status():
    data = request.json
    status = TaskStatus(name=data['name'])
    db.session.add(status)
    db.session.commit()
    return jsonify({'id': status.id}), 201
