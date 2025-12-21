import {createBrowserRouter, Navigate} from "react-router-dom";
import PublicRoute from "./PublicRoute.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import AuthLayout from "../components/AuthLayout.tsx";
import LoginPage from "../pages/login.tsx";
import RegisterPage from "../pages/register.tsx";
import {Component} from "react";

// Placeholder components for Chat
class ChatLayout extends Component {
    render() {
        return <div>Chat Layout</div>;
    }
}

class ChatEmpty extends Component {
    render() {
        return <div>Select a conversation</div>;
    }
}

class Conversation extends Component {
    render() {
        return <div>Conversation Detail</div>;
    }
}

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/chat" replace/>,
    },
    {
        element: <PublicRoute/>,
        children:[
            {
                path: "auth",
                element: <AuthLayout />,
                children: [
                    { index: true, element: <Navigate to="login" replace /> },
                    { path: "login", element: <LoginPage /> },
                    { path: "register", element: <RegisterPage /> },
                ],
            }
        ]
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "chat",
                element: <ChatLayout />,
                children: [
                    { index: true, element: <ChatEmpty /> },
                    { path: ":conversationId", element: <Conversation /> },
                ],
            },
        ],
    }

]);
