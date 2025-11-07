import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import ProjectFilters from "../../../../components/table/filter/ProjectFilters.jsx";
import ProjectTable from "../../../../components/table/ProjectTable.jsx";


function ProjectList() {
    const navigate = useNavigate();

    const [toastType, setToastType] = useState("success");

    const setToast = (message, type) => {
        setToastMessage(message);
        setToastType(type);
    };


    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Project Management</h1>
                    <p className="text-sm text-gray-500">
                        View, edit, and manage all registered projects.
                    </p>
                </div>
                <button
                    onClick={() => navigate("/admin/project/create")}
                    className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90"
                >
                    + Add New Project
                </button>
            </div>

                <ProjectTable setToast={setToast}/>


        </div>
    );
}

export default ProjectList;