import React, { useEffect, useState } from "react";

const UserList = () => {
    const [users, setUsers] = useState([]);

    // ✅ Fetch users on component mount
    useEffect(() => {
        fetch("http://localhost:3001/api/auth/users") // ✅ Updated endpoint
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error("Error fetching users:", error));
    }, []);

    // ✅ Delete user function
    const handleDeleteUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/auth/${userId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete user");
            }

            const data = await response.json();
            console.log(data.message); // ✅ Log success message

            // ✅ Update UI by filtering out deleted user
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div>
            <h2>User List</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name} - {user.email}
                        <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
