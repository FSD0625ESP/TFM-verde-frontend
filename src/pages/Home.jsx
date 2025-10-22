import { AuthContext } from "../contexts/AuthContext";
import React from "react";


const Home = () => {
    const { user } = React.useContext(AuthContext);
    return (
        <>
            home page
            <div>
                {user ? (
                    <p>Welcome, {user.firstName}!</p>
                ) : (
                    <p>Please log in to access more features.</p>
                )}
            </div>
        </>
    );
};

export default Home;
