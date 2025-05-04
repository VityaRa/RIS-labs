BEGIN;

-- Insert Project Statuses
INSERT INTO public.projectstatus (name) VALUES 
('Planning'),
('Active'),
('On Hold'),
('Completed'),
('Cancelled');

-- Insert Task Statuses
INSERT INTO public.taskstatuses (name) VALUES 
('Backlog'),
('To Do'),
('In Progress'),
('In Review'),
('Done'),
('Blocked');

-- Insert Tags
INSERT INTO public.tag (title, description) VALUES 
('Frontend', 'Related to user interface development'),
('Backend', 'Related to server-side development'),
('Database', 'Related to database operations'),
('Bug', 'Identified system defect'),
('Feature', 'New functionality request'),
('Urgent', 'High priority item');

-- Insert Projects
INSERT INTO public.project (title, description, status_id) VALUES 
('E-Commerce Platform', 'New online shopping system', 2),
('CRM System', 'Customer relationship management upgrade', 1),
('Mobile App', 'iOS/Android application development', 2),
('Data Migration', 'Legacy system data transfer', 3),
('API Gateway', 'Centralized API management system', 2);

-- Insert Tasks for Project 1 (E-Commerce Platform)
INSERT INTO public.task (title, description, project_id, status_id, deadline) VALUES 
('Product Page UI', 'Design product detail page', 1, 3, NOW() + INTERVAL '7 days'),
('Shopping Cart API', 'Implement cart functionality', 1, 2, NOW() + INTERVAL '14 days'),
('Payment Integration', 'Connect with Stripe API', 1, 4, NOW() + INTERVAL '5 days'),
('Database Schema', 'Design product catalog tables', 1, 5, NOW() - INTERVAL '2 days'),
('Performance Testing', 'Load test checkout flow', 1, 1, NOW() + INTERVAL '21 days');

-- Insert Tasks for Project 2 (CRM System)
INSERT INTO public.task (title, description, project_id, status_id, deadline) VALUES 
('Requirements Gathering', 'Interview stakeholders', 2, 5, NOW() - INTERVAL '10 days'),
('Contact Management UI', 'Design contact cards', 2, 3, NOW() + INTERVAL '3 days'),
('Import/Export Feature', 'CSV data processing', 2, 2, NOW() + INTERVAL '12 days');

-- Create Task-Tag relationships
INSERT INTO public.tasktag (task_id, tag_id) VALUES 
(1, 1), (1, 6),  -- Product Page UI (Frontend, Urgent)
(2, 2), (2, 3),  -- Shopping Cart API (Backend, Database)
(3, 2), (3, 5),  -- Payment Integration (Backend, Feature)
(4, 3),          -- Database Schema (Database)
(5, 1), (5, 2),  -- Performance Testing (Frontend, Backend)
(6, 5),          -- Requirements Gathering (Feature)
(7, 1), (7, 5),  -- Contact Management UI (Frontend, Feature)
(8, 2), (8, 3);  -- Import/Export Feature (Backend, Database)

-- Insert Time Logs
INSERT INTO public.timelog (description, task_id, status_id, deadline) VALUES 
('Initial prototype', 1, 6, NOW() - INTERVAL '3 days'),
('API specification', 2, 3, NOW() - INTERVAL '1 day'),
('Stripe connection completed', 3, 5, NOW()),
('Schema review meeting', 4, 5, NOW() - INTERVAL '5 days'),
('Test plan creation', 5, 1, NOW() + INTERVAL '2 days'),
('User interviews', 6, 5, NOW() - INTERVAL '12 days'),
('UI component library', 7, 3, NOW() - INTERVAL '2 days');

COMMIT;