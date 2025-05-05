RIS labs completion

* go - ready for test
* elixir - TODO
* python - TODO
* ERD - Done - ![ERD](./ERD.png?raw=true "ERD")
* OpenAPI v3 spec - Done
* Frontend 

# Project Management API

> Version 1.0.0

API for managing projects, tasks, and tags

## Path Table

| Method | Path | Description |
| --- | --- | --- |
| GET | [/projects](#getprojects) | Get all projects |
| POST | [/projects](#postprojects) | Create a new project |
| PUT | [/projects/{projectId}](#putprojectsprojectid) | Update a project |
| DELETE | [/projects/{projectId}](#deleteprojectsprojectid) | Delete a project |
| GET | [/projects/{projectId}/tasks](#getprojectsprojectidtasks) | Get project tasks |
| GET | [/projects/statuses](#getprojectsstatuses) | Get project statuses |
| GET | [/tasks](#gettasks) | Get all tasks |
| POST | [/tasks](#posttasks) | Create a new task |
| PUT | [/tasks/{taskId}](#puttaskstaskid) | Update a task |
| DELETE | [/tasks/{taskId}](#deletetaskstaskid) | Delete a task |
| GET | [/tasks/{tagId}](#gettaskstagid) | Get tasks by tag |
| GET | [/tasks/{statusId}](#gettasksstatusid) | Get tasks by status |
| GET | [/tasks/statuses](#gettasksstatuses) | Get task statuses |
| POST | [/tasks/statuses](#posttasksstatuses) | Create a new task status |
| GET | [/tags](#gettags) | Get all tags |
| POST | [/tags](#posttags) | Create a new tag |
| PUT | [/tags/{tagId}](#puttagstagid) | Update a tag |
| DELETE | [/tags/{tagId}](#deletetagstagid) | Delete a tag |

## Reference Table

| Name | Path | Description |
| --- | --- | --- |
| StandardResponse | [#/components/schemas/StandardResponse](#componentsschemasstandardresponse) |  |
| StandardArrayResponse | [#/components/schemas/StandardArrayResponse](#componentsschemasstandardarrayresponse) |  |
| Project | [#/components/schemas/Project](#componentsschemasproject) |  |
| ProjectInput | [#/components/schemas/ProjectInput](#componentsschemasprojectinput) |  |
| Task | [#/components/schemas/Task](#componentsschemastask) |  |
| TaskInput | [#/components/schemas/TaskInput](#componentsschemastaskinput) |  |
| Tag | [#/components/schemas/Tag](#componentsschemastag) |  |
| TagInput | [#/components/schemas/TagInput](#componentsschemastaginput) |  |
| ProjectStatus | [#/components/schemas/ProjectStatus](#componentsschemasprojectstatus) |  |
| TaskStatus | [#/components/schemas/TaskStatus](#componentsschemastaskstatus) |  |
| TaskStatusInput | [#/components/schemas/TaskStatusInput](#componentsschemastaskstatusinput) |  |
| projectId | [#/components/parameters/projectId](#componentsparametersprojectid) | ID of the project |
| taskId | [#/components/parameters/taskId](#componentsparameterstaskid) | ID of the task |
| tagId | [#/components/parameters/tagId](#componentsparameterstagid) | ID of the tag |
| statusId | [#/components/parameters/statusId](#componentsparametersstatusid) | ID of the status |
| BadRequest | [#/components/responses/BadRequest](#componentsresponsesbadrequest) | Bad request |
| NotFound | [#/components/responses/NotFound](#componentsresponsesnotfound) | Resource not found |
| InternalServerError | [#/components/responses/InternalServerError](#componentsresponsesinternalservererror) | Internal server error |

## Path Details

***

### [GET]/projects

- Summary  
Get all projects

- Description  
Returns a list of all projects

#### Responses

- 200 Successful operation

`application/json`

```ts
{
  data: {
  }[]
  error: string
}
```

- 500 undefined

***

### [POST]/projects

- Summary  
Create a new project

- Description  
Create a new project with the provided data

#### RequestBody

- application/json

```ts
{
  title: string
  description?: string
  status_id: integer
}
```

#### Responses

- 201 Project created successfully

`application/json`

```ts
{
  data: {
  }
  error: string
}
```

- 400 undefined

- 500 undefined

***

### [PUT]/projects/{projectId}

- Summary  
Update a project

- Description  
Update an existing project by ID

#### RequestBody

- application/json

```ts
{
  title: string
  description?: string
  status_id: integer
}
```

#### Responses

- 200 Project updated successfully

`application/json`

```ts
{
  data: {
  }
  error: string
}
```

- 400 undefined

- 404 undefined

- 500 undefined

***

### [DELETE]/projects/{projectId}

- Summary  
Delete a project

- Description  
Delete a project by ID

#### Responses

- 204 Project deleted successfully

- 404 undefined

- 500 undefined

***

### [GET]/projects/{projectId}/tasks

- Summary  
Get project tasks

- Description  
Returns all tasks for a specific project

#### Responses

- 200 Successful operation

`application/json`

```ts
{
  data: {
  }[]
  error: string
}
```

- 404 undefined

- 500 undefined

***

### [GET]/projects/statuses

- Summary  
Get project statuses

- Description  
Returns all available project statuses

#### Responses

- 200 Successful operation

`application/json`

```ts
{
  data: {
  }[]
  error: string
}
```

- 500 undefined

***

### [GET]/tasks

- Summary  
Get all tasks

- Description  
Returns all tasks across all projects

#### Responses

- 200 Successful operation

`application/json`

```ts
{
  data: {
  }[]
  error: string
}
```

- 500 undefined

***

### [POST]/tasks

- Summary  
Create a new task

- Description  
Create a new task with the provided data

#### RequestBody

- application/json

```ts
{
  title: string
  description?: string
  project_id: integer
  status_id: integer
  deadline?: string
}
```

#### Responses

- 201 Task created successfully

`application/json`

```ts
{
  data: {
  }
  error: string
}
```

- 400 undefined

- 500 undefined

***

### [PUT]/tasks/{taskId}

- Summary  
Update a task

- Description  
Update an existing task by ID

#### RequestBody

- application/json

```ts
{
  title: string
  description?: string
  project_id: integer
  status_id: integer
  deadline?: string
}
```

#### Responses

- 200 Task updated successfully

`application/json`

```ts
{
  data: {
  }
  error: string
}
```

- 400 undefined

- 404 undefined

- 500 undefined

***

### [DELETE]/tasks/{taskId}

- Summary  
Delete a task

- Description  
Delete a task by ID

#### Responses

- 204 Task deleted successfully

- 404 undefined

- 500 undefined

***

### [GET]/tasks/{tagId}

- Summary  
Get tasks by tag

- Description  
Returns all tasks associated with a specific tag

#### Responses

- 200 Successful operation

`application/json`

```ts
{
  data: {
  }[]
  error: string
}
```

- 404 undefined

- 500 undefined

***

### [GET]/tasks/{statusId}

- Summary  
Get tasks by status

- Description  
Returns all tasks with a specific status

#### Responses

- 200 Successful operation

`application/json`

```ts
{
  data: {
  }[]
  error: string
}
```

- 500 undefined

***

### [GET]/tasks/statuses

- Summary  
Get task statuses

- Description  
Returns all available task statuses

#### Responses

- 200 Successful operation

`application/json`

```ts
{
  data: {
  }[]
  error: string
}
```

- 500 undefined

***

### [POST]/tasks/statuses

- Summary  
Create a new task status

- Description  
Create a new task status with the provided data

#### RequestBody

- application/json

```ts
{
  name: string
}
```

#### Responses

- 201 Task status created successfully

`application/json`

```ts
{
  data: {
  }
  error: string
}
```

- 400 undefined

- 500 undefined

***

### [GET]/tags

- Summary  
Get all tags

- Description  
Returns all available tags

#### Responses

- 200 Successful operation

`application/json`

```ts
{
  data: {
  }[]
  error: string
}
```

- 500 undefined

***

### [POST]/tags

- Summary  
Create a new tag

- Description  
Create a new tag with the provided data

#### RequestBody

- application/json

```ts
{
  title: string
  description?: string
}
```

#### Responses

- 201 Tag created successfully

`application/json`

```ts
{
  data: {
  }
  error: string
}
```

- 400 undefined

- 500 undefined

***

### [PUT]/tags/{tagId}

- Summary  
Update a tag

- Description  
Update an existing tag by ID

#### RequestBody

- application/json

```ts
{
  title: string
  description?: string
}
```

#### Responses

- 200 Tag updated successfully

`application/json`

```ts
{
  data: {
  }
  error: string
}
```

- 400 undefined

- 404 undefined

- 500 undefined

***

### [DELETE]/tags/{tagId}

- Summary  
Delete a tag

- Description  
Delete a tag by ID

#### Responses

- 204 Tag deleted successfully

- 404 undefined

- 500 undefined

## References

### #/components/schemas/StandardResponse

```ts
{
  data: {
  }
  error: string
}
```

### #/components/schemas/StandardArrayResponse

```ts
{
  data: {
  }[]
  error: string
}
```

### #/components/schemas/Project

```ts
{
  id?: integer
  title: string
  description?: string
  status_id: integer
}
```

### #/components/schemas/ProjectInput

```ts
{
  title: string
  description?: string
  status_id: integer
}
```

### #/components/schemas/Task

```ts
{
  id?: integer
  title: string
  description?: string
  project_id: integer
  status_id: integer
  deadline?: string
}
```

### #/components/schemas/TaskInput

```ts
{
  title: string
  description?: string
  project_id: integer
  status_id: integer
  deadline?: string
}
```

### #/components/schemas/Tag

```ts
{
  id?: integer
  title: string
  description?: string
}
```

### #/components/schemas/TagInput

```ts
{
  title: string
  description?: string
}
```

### #/components/schemas/ProjectStatus

```ts
{
  id?: integer
  name: string
}
```

### #/components/schemas/TaskStatus

```ts
{
  id?: integer
  name: string
}
```

### #/components/schemas/TaskStatusInput

```ts
{
  name: string
}
```

### #/components/parameters/projectId

```ts
projectId: integer
```

### #/components/parameters/taskId

```ts
taskId: integer
```

### #/components/parameters/tagId

```ts
tagId: integer
```

### #/components/parameters/statusId

```ts
statusId: integer
```

### #/components/responses/BadRequest

- application/json

```ts
{
  data: {
  }
  error: string
}
```

### #/components/responses/NotFound

- application/json

```ts
{
  data: {
  }
  error: string
}
```

### #/components/responses/InternalServerError

- application/json

```ts
{
  data: {
  }
  error: string
}
```
