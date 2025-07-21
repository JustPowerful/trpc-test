"use client";
import { trpc } from "@/app/_trpc/client";
import { useState } from "react";

export default function TodoList() {
  const [input, setInput] = useState({
    title: "",
    description: "",
    completed: false,
  });
  const testRequest = trpc.test.hello.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
  const getTodos = trpc.todo.getTodos.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
  const addTodo = trpc.todo.addTodo.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });
  const updateStatus = trpc.todo.updateStatus.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });
  return (
    <div className="">
      <div>
        {testRequest.isLoading && <p>Loading...</p>}
        {testRequest.error && (
          <p className="text-red-500">Error: {testRequest.error.message}</p>
        )}
        {testRequest.data}
        <input
          placeholder="Title"
          value={input.title}
          onChange={(e) => {
            setInput({ ...input, title: e.target.value });
          }}
        />
        <input
          placeholder="Description"
          value={input.description}
          onChange={(e) => {
            setInput({ ...input, description: e.target.value });
          }}
        />
        <button
          onClick={() => {
            addTodo.mutate(input);
          }}
        >
          Create
        </button>
      </div>
      {/* {JSON.stringify(getTodos.data, null, 2)} */}
      <div className="w-full flex flex-col items-center gap-2">
        {getTodos.data?.map((todo) => (
          <div
            key={todo.id}
            className="bg-white text-black p-4 rounded-md max-w-md w-full"
          >
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <p
              onClick={() => {
                updateStatus.mutate({
                  id: todo.id,
                  completed: !todo.completed,
                });
              }}
              className="text-blue-500 underline cursor-pointer"
            >
              Completed: {todo.completed ? "Yes" : "No"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
