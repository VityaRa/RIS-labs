from app import db

class ProjectStatus(db.Model):
    __tablename__ = 'project_statuses'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)

class TaskStatus(db.Model):
    __tablename__ = 'task_statuses'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)

class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status_id = db.Column(db.Integer, db.ForeignKey('project_statuses.id'))
    tasks = db.relationship('Task', backref='project', lazy=True)

class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text, nullable=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    status_id = db.Column(db.Integer, db.ForeignKey('task_statuses.id'))
    deadline = db.Column(db.DateTime, nullable=True)
    tags = db.relationship('Tag', secondary='task_tags', back_populates='tasks')

class Tag(db.Model):
    __tablename__ = 'tags'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(64), nullable=False)
    description = db.Column(db.Text, nullable=True)
    tasks = db.relationship('Task', secondary='task_tags', back_populates='tags')

class TaskTag(db.Model):
    __tablename__ = 'task_tags'
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), primary_key=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.id'), primary_key=True)
