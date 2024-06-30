import { AddTaskDto, Task } from "../types/TaskTypes";

const createTask = (): Task => ({
    id: String(Math.random()),
    completed: Math.random() > 0.5,
    due_date: Date.now() + (Math.random() * 10000000000),
    priority: Math.random() > 0.5 ? "high" : "low",
    title: "Heeey"
})

let tasks = new Array(1000).fill(0).map(createTask);

export const deleteTask = async ({ id: deleteId }: { id: string }) => {
    tasks = tasks.filter(({ id }) => id !== deleteId);
};
export const getTaskList = async () => ({ tasks: tasks });
export const addTask = async ({ data }: { data: AddTaskDto }) => {
    tasks.push(({
        id: String(Math.random()),
        ...data
    }));
};
