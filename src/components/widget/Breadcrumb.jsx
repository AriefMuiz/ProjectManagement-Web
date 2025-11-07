import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items }) => (
    <div className="breadcrumbs text-xs bg-base-200 p-1 rounded mb-4 min-w-[120px] max-w-[280px] w-full overflow-x-auto">
        <ul className="inline-flex whitespace-nowrap">
            {items.map((item, index) => (
                <li key={index}>
                    {index < items.length - 1 ? (
                        <Link to={item.href}>{item.label}</Link>
                    ) : (
                        <span className="font-bold">{item.label}</span>
                    )}
                </li>
            ))}
        </ul>
    </div>
);

export default Breadcrumb;