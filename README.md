# React-ToDo-Application
A basic Kanban System for managing tasks based on their status and time allotment.
Can create multiple tasks but Run only single task at a time.

If you close the app, whenever you return simply press the Task's "Go" button to see timer running.

Developed Using:
1. Webpack
2. React
3. Web Dev Server

Task Input:
1. Give Task Name
2. Task Start Date
3. Start Time (24 hour format)
4. End Time (24 hour format)

Guidelines:
1. Newly Created task has status as "New"
2. A task can be started on or after start time. If not started it starts automatically at provided start time.
3. When started, status changes to "In Progress" and task cannot be edited.
4. Task can be ended after started. It ends automatically if end time reached. When stopped, status changes to "Ready For QA".
5. End time cannot be less than start time and has to be +10 minutes of start time.
6. Only a task with status "Ready for QA" can be changed to "Closed".
7. A task can be created for the same date only.

Task Status has strict flow:

New -> In Progress -> Ready For QA -> Closed.

Future Enhancements:
1. Improve code. (currently little long and simple code)
2. Add separate timer for each task.
3. Filter completed, ongoing or new tasks.

