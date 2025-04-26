"use client";
import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  age: number;
  isActive: boolean;
};

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    const data = [
      { id: 1, name: "John Doe", age: 28, isActive: true },
      { id: 2, name: "Jane Smith", age: 34, isActive: false },
      { id: 3, name: "Sam Johnson", age: 23, isActive: true },
      { id: 4, name: "Alice Brown", age: 45, isActive: true },
    ];
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const activeUsers = users
    .filter((user) => user.isActive)
    .map((user) => ({ ...user, name: user.name.toUpperCase() }));

  const averageAge =
    activeUsers.reduce((sum, user) => sum + user.age, 0) / activeUsers.length;

  return (
    <div className="max-w-[600px] m-auto px-4">
      <h2>Acitve users</h2>
      <ul>
        {activeUsers.map((user) => (
          <li key={user.id}>
            {user.name} - {user.age} years old
          </li>
        ))}
      </ul>
      <p>Average age of active user is: {averageAge.toFixed(2)}</p>
    </div>
  );
};

export default UserList;
