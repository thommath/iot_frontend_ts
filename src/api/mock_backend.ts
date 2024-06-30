import { AddTaskDto, Task } from "../types/TaskTypes";

const createTask = (): Task => ({
    id: String(Math.random()),
    completed: Math.random() > 0.5,
    due_date: Date.now() + (Math.random() * 10000000000),
    priority: Math.random() > 0.5 ? "high" : "low",
    title: "Heeey"
})

export const deleteTask = ({ id }: { id: string }) => Promise.resolve();
export const getTaskList = async () => {
    return { tasks: new Array(1000).fill(0).map(createTask) }
};
export const addTask = ({ data }: { data: AddTaskDto }) => Promise.resolve();