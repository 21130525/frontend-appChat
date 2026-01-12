import { Outlet } from 'react-router-dom';
import './../features/auth/auth.css';

const AuthLayout = () => {
    return (
        <div className="auth-background">
            {/* Paper Airplane Icons */}
            <div className="paper-airplane">✈️</div>
            <div className="paper-airplane">✈️</div>
            <div className="paper-airplane">✈️</div>
            
            <div className="auth-container">
                <div className="auth-card">
                    {/* Bird with Letter Icon */}
                    <div className="bird-letter-icon">
                        <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Bird body */}
                            <ellipse cx="35" cy="50" rx="20" ry="16" fill="#64B5F6"/>
                            <ellipse cx="35" cy="50" rx="16" ry="13" fill="#90CAF9"/>
                            
                            {/* Bird head */}
                            <circle cx="22" cy="42" r="12" fill="#64B5F6"/>
                            <circle cx="20" cy="40" r="4" fill="#1976D2"/>
                            
                            {/* Bird beak with letter */}
                            <path d="M12 42 L8 40 L8 44 Z" fill="#FFB74D"/>
                            
                            {/* Letter in beak */}
                            <rect x="8" y="38" width="12" height="10" rx="1.5" fill="#FFFFFF" stroke="#BBDEFB" strokeWidth="1.5"/>
                            <line x1="10" y1="41" x2="17" y2="41" stroke="#64B5F6" strokeWidth="1"/>
                            <line x1="10" y1="43.5" x2="16" y2="43.5" stroke="#64B5F6" strokeWidth="1"/>
                            
                            {/* Bird wing */}
                            <ellipse cx="40" cy="52" rx="10" ry="7" fill="#42A5F5" opacity="0.8"/>
                            
                            {/* Bird tail */}
                            <path d="M50 50 Q58 45 60 50 Q58 55 50 50" fill="#42A5F5" opacity="0.7"/>
                        </svg>
                    </div>
                    
                    {/* App Title */}
                    <h1 className="auth-title">App Chat</h1>
                    
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
