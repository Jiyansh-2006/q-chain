
import React, { ReactNode } from 'react';

interface CardProps {
    title: string;
    children: ReactNode;
    className?: string;
    icon?: ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', icon }) => {
    return (
        <div className={`bg-dark-card border border-dark-border rounded-xl shadow-lg overflow-hidden animate-slide-in ${className}`}>
            <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
                    {icon && <div className="text-brand-secondary">{icon}</div>}
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

export default Card;
