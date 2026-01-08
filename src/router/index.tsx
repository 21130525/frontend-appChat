import {createBrowserRouter, Navigate} from "react-router-dom";
import PublicRoute from "./PublicRoute.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import AuthLayout from "../layout/AuthLayout.tsx";
import LoginPage from "../features/auth/login.tsx";
import RegisterPage from "../features/auth/register.tsx";
import TestAPI from "../features/testAPI/TestAPI.tsx";
import ChatLayout from "../layout/ChatLayout.tsx";
import RootLayout from "../layout/RootLayout.tsx";
import ChatPage from "../features/chat/ChatPage.tsx";

export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <Navigate to="/chat" replace />,
            },
            {
                path: "testAPI",
                element: <TestAPI />,
            },

            {
                element: <PublicRoute />,
                children: [
                    {
                        path: "auth",
                        element: <AuthLayout />,
                        children: [
                            { index: true, element: <Navigate to="login" replace /> },
                            { path: "login", element: <LoginPage /> },
                            { path: "register", element: <RegisterPage /> },
                        ],
                    },
                ]
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: "chat",
                        element: <ChatLayout />,
                        children: [
                            { index: true, element: <ChatPage /> },
                        ]
                    },

                ],
            }
        ]
    },

]);
