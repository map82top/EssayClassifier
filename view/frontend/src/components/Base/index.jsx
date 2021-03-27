import React from 'react';
import "./_style.scss"
import cn from "classnames";

const Index = ({className, children}) => {
    return (
        <>
            <div className="header">
                <div className="header-logo">Оценщик</div>
            </div>
            <div className={cn("content", className)}>
                {children}
            </div>
        </>
    )
};

export default Index;


