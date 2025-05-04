# Project Management API

> Version 1.0.0

API for managing projects, tasks, and tags

## Path Table

| Method | Path | Description |
| --- | --- | --- |
| GET | [/projects](#getprojects) | Get all projects |
| GET | [/projects/{projectId}/tasks](#getprojectsprojectidtasks) | Get all tasks in a project |
| GET | [/projects/statuses](#getprojectsstatuses) | Get all project statuses |
| GET | [/tags](#gettags) | Get all tags |
| GET | [/tasks/{tagId}](#gettaskstagid) | Get all tasks by tag |
| GET | [/tasks/{statusId}](#gettasksstatusid) | Get all tasks by status |
| GET | [/tasks/statuses](#gettasksstatuses) | Get all task statuses |

## Reference Table

| Name | Path | Description |
| --- | --- | --- |
| Project | [#/components/schemas/Project](#componentsschemasproject) |  |
| Task | [#/components/schemas/Task](#componentsschemastask) |  |
| Tag | [#/components/schemas/Tag](#componentsschemastag) |  |
| ProjectStatus | [#/components/schemas/ProjectStatus](#componentsschemasprojectstatus) |  |
| TaskStatus | [#/components/schemas/TaskStatus](#componentsschemastaskstatus) |  |

## Path Details

***

### [GET]/projects

- Summary  
Get all projects

- Description  
Returns a list of all projects

#### Responses

- 200 A list of projects

`application/json`

```ts
{
  id?: integer
  title?: string
  description?: string
  status_id?: integer
}[]
```

***

### [GET]/projects/{projectId}/tasks

- Summary  
Get all tasks in a project

- Description  
Returns a list of all tasks belonging to a specific project

#### Responses

- 200 A list of tasks in the project

`application/json`

```ts
{
  id?: integer
  title?: string
  description?: string
  project_id?: integer
  status_id?: integer
  deadline?: string
}[]
```

- 404 Project not found

***

### [GET]/projects/statuses

- Summary  
Get all project statuses

- Description  
Returns a list of all possible project statuses

#### Responses

- 200 A list of project statuses

`application/json`

```ts
{
  id?: integer
  name?: string
}[]
```

***

### [GET]/tags

- Summary  
Get all tags

- Description  
Returns a list of all tags

#### Responses

- 200 A list of tags

`application/json`

```ts
{
  id?: integer
  title?: string
  description?: string
}[]
```

***

### [GET]/tasks/{tagId}

- Summary  
Get all tasks by tag

- Description  
Returns a list of all tasks associated with a specific tag

#### Responses

- 200 A list of tasks with the specified tag

`application/json`

```ts
{
  id?: integer
  title?: string
  description?: string
  project_id?: integer
  status_id?: integer
  deadline?: string
}[]
```

- 404 Tag not found

***

### [GET]/tasks/{statusId}

- Summary  
Get all tasks by status

- Description  
Returns a list of all tasks with a specific status

#### Parameters(Query)

```ts
statusId: integer
```

#### Responses

- 200 A list of tasks with the specified status

`application/json`

```ts
{
  id?: integer
  title?: string
  description?: string
  project_id?: integer
  status_id?: integer
  deadline?: string
}[]
```

***

### [GET]/tasks/statuses

- Summary  
Get all task statuses

- Description  
Returns a list of all possible task statuses

#### Responses

- 200 A list of task statuses

`application/json`

```ts
{
  id?: integer
  name?: string
}[]
```

## References

### #/components/schemas/Project

```ts
{
  id?: integer
  title?: string
  description?: string
  status_id?: integer
}
```

### #/components/schemas/Task

```ts
{
  id?: integer
  title?: string
  description?: string
  project_id?: integer
  status_id?: integer
  deadline?: string
}
```

### #/components/schemas/Tag

```ts
{
  id?: integer
  title?: string
  description?: string
}
```

### #/components/schemas/ProjectStatus

```ts
{
  id?: integer
  name?: string
}
```

### #/components/schemas/TaskStatus

```ts
{
  id?: integer
  name?: string
}
```
