
import { useEffect, useState } from 'react';
import { fetchUsers } from '/utils/api';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const data = await fetchUsers();
                setUsers(data);
            } catch (error) {
                setError('Error fetching users');
                console.error(error);
            }
        };

        getUsers();
    }, []);

    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Users</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default UsersPage;
