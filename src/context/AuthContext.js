import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {

        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
            const user = JSON.parse(localStorage.getItem("loggedInUser"));
            setLoggedInUser(user);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ loggedInUser, setLoggedInUser, isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
