

export type Task = {
    id: string;
    title: string;
    due_date: number;
    priority: string;
    completed: boolean;
}

export type AddTaskDto = {
    title: string;
    due_date: number;
    priority: string;
    completed: boolean;
}

export type EditTaskDto = Task;