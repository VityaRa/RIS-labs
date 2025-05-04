BEGIN;

-- Project table
CREATE TABLE IF NOT EXISTS public.project (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status_id INTEGER
);

-- ProjectStatus table
CREATE TABLE IF NOT EXISTS public.projectstatus (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Tag table
CREATE TABLE IF NOT EXISTS public.tag (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT
);

-- Task table
CREATE TABLE IF NOT EXISTS public.task (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    project_id INTEGER,
    status_id INTEGER,
    deadline TIMESTAMP WITH TIME ZONE
);

-- TaskStatuses table
CREATE TABLE IF NOT EXISTS public.taskstatuses (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Junction table for Task-Tag many-to-many relationship
CREATE TABLE IF NOT EXISTS public.tasktag (
    task_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (task_id, tag_id)
);

-- TimeLog table
CREATE TABLE IF NOT EXISTS public.timelog (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    description TEXT,
    task_id INTEGER NOT NULL,
    status_id INTEGER,
    deadline TIMESTAMP WITH TIME ZONE
);

-- Foreign key constraints
ALTER TABLE IF EXISTS public.project
    ADD CONSTRAINT project_status_fk FOREIGN KEY (status_id)
    REFERENCES public.projectstatus (id)
    ON UPDATE CASCADE
    ON DELETE SET NULL;

ALTER TABLE IF EXISTS public.task
    ADD CONSTRAINT task_status_fk FOREIGN KEY (status_id)
    REFERENCES public.taskstatuses (id)
    ON UPDATE CASCADE
    ON DELETE SET NULL;

ALTER TABLE IF EXISTS public.task
    ADD CONSTRAINT task_project_fk FOREIGN KEY (project_id)
    REFERENCES public.project (id)
    ON UPDATE CASCADE
    ON DELETE SET NULL;

ALTER TABLE IF EXISTS public.tasktag
    ADD CONSTRAINT tasktag_task_fk FOREIGN KEY (task_id)
    REFERENCES public.task (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.tasktag
    ADD CONSTRAINT tasktag_tag_fk FOREIGN KEY (tag_id)
    REFERENCES public.tag (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.timelog
    ADD CONSTRAINT timelog_task_fk FOREIGN KEY (task_id)
    REFERENCES public.task (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.timelog
    ADD CONSTRAINT timelog_status_fk FOREIGN KEY (status_id)
    REFERENCES public.taskstatuses (id)
    ON UPDATE CASCADE
    ON DELETE SET NULL;

END;