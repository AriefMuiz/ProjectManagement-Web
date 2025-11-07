import React, { useState } from 'react';
import Breadcrumb from '../../../../components/widget/Breadcrumb.jsx';
import {Outlet} from "react-router-dom";


const defaultBreadcrumb = [
    { label: 'Home', href: '/admin/project' },
    { label: 'Project', href: '/admin/project' }
];
const ProjectManagement = () => {
    const [breadcrumbItems, setBreadcrumbItems] = useState(defaultBreadcrumb);

    return (
            <div className="card bg-base-100 shadow">
                <div className="card-body">
                    <Breadcrumb items={breadcrumbItems} />
                    <Outlet context={{ setBreadcrumbItems, defaultBreadcrumb }} />
                </div>
            </div>


    );
};

export default ProjectManagement;