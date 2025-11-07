// src/modules/admin/pages/Management/ProjectDetail.jsx
import React, {useEffect, useState} from 'react';
import {useParams, useOutletContext} from 'react-router-dom';
import StatusBadge from "../../../../components/widget/StatusBadge.jsx";
import projectsAPI from "../../../../fetch/admin/projects";
import sdgAPI from "../../../../fetch/common/sdg.js";
import ProjectMemoTable from "../../../../components/widget/ProjectMemoTable.jsx";
import useFetchClientList from "../../../../hooks/useFetchClientList.js";

const ProjectDetail = () => {
    const {id} = useParams();
    const {setBreadcrumbItems, defaultBreadcrumb} = useOutletContext();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sdgOptions, setSdgOptions] = useState([]);



    useEffect(() => {
        // Set breadcrumb when component mounts
        if (setBreadcrumbItems) {
            setBreadcrumbItems([
                ...defaultBreadcrumb,
                {label: 'Detail', href: `/admin/project/${id}`}
            ]);
        }

        // Load SDG data using the API with caching
        const fetchSdgData = async () => {
            try {
                const sdgData = await sdgAPI.getSdgList();
                setSdgOptions(sdgData);
            } catch (err) {
                console.error('Failed to fetch SDG data:', err);
                // Fallback to default SDG data
                setSdgOptions([
                    {id: 1, name: "No Poverty", color: "#E5243B"},
                    {id: 2, name: "Zero Hunger", color: "#DDA63A"},
                    {id: 3, name: "Good Health and Well-being", color: "#4C9F38"},
                    {id: 4, name: "Quality Education", color: "#C5192D"},
                    {id: 5, name: "Gender Equality", color: "#FF3A21"},
                    {id: 6, name: "Clean Water and Sanitation", color: "#26BDE2"},
                    {id: 7, name: "Affordable and Clean Energy", color: "#FCC30B"},
                    {id: 8, name: "Decent Work and Economic Growth", color: "#A21942"},
                    {id: 9, name: "Industry, Innovation and Infrastructure", color: "#FD6925"},
                    {id: 10, name: "Reduced Inequalities", color: "#DD1367"},
                    {id: 11, name: "Sustainable Cities and Communities", color: "#FD9D24"},
                    {id: 12, name: "Responsible Consumption and Production", color: "#BF8B2E"},
                    {id: 13, name: "Climate Action", color: "#3F7E44"},
                    {id: 14, name: "Life Below Water", color: "#0A97D9"},
                    {id: 15, name: "Life on Land", color: "#56C02B"},
                    {id: 16, name: "Peace, Justice and Strong Institutions", color: "#00689D"},
                    {id: 17, name: "Partnerships for the Goals", color: "#19486A"}
                ]);
            }
        };

        const loadProject = async () => {
            setLoading(true);
            try {
                const response = await projectsAPI.getProjectById(id);
                setProject(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch project:', err);
                setError('Failed to load project data. Please try again.');
                setLoading(false);
            }
        };

        fetchSdgData();
        loadProject();

        // Reset breadcrumb on unmount
        return () => {
            if (setBreadcrumbItems) {
                setBreadcrumbItems(defaultBreadcrumb);
            }
        };
    }, [id, setBreadcrumbItems, defaultBreadcrumb]);

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p>{error}</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                <p>Project not found</p>
            </div>
        );
    }

    // Extract cost data from the nested structure
    const costData = project.projectCost || {};

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-700">Project Information</h2>
                <StatusBadge status={project.status}/>
            </div>

            {/* Project Details Section */}
            <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                    Project Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InfoItem label="Project Code" value={project.projectCode}/>
                        <InfoItem label="Quotation Number" value={project.quotationNumber}/>
                        <InfoItem label="Project Title" value={project.title}/>
                        <InfoItem label="Project Under" value={project.projectUnder}/>
                    </div>
                    <div>
                        <InfoItem label="Start Date" value={project.startDate}/>
                        <InfoItem label="End Date" value={project.endDate}/>
                        <InfoItem label="Duration (Months)" value={project.duration}/>
                        <InfoItem label="Description" value={project.description}/>
                        <InfoItem label="Deliverables" value={project.deliverables}/>
                    </div>
                </div>

                {/* Display selected SDGs */}
                {project.sdgs && project.sdgs.length > 0 && (
                    <div className="mt-4">
                        <h4 className="text-md font-medium mb-2">Sustainable Development Goals</h4>
                        <div className="flex flex-wrap gap-2">
                            {project.sdgs.map(goalId => {
                                const goal = sdgOptions.find(g => g.id === goalId);
                                return goal ? (
                                    <div
                                        key={goalId}
                                        className="px-3 py-1 rounded-full text-white text-xs font-medium flex items-center"
                                        style={{backgroundColor: goal.color}}
                                    >
                                        <span className="mr-1">Goal {goalId}:</span> {goal.name}
                                    </div>
                                ) : null;
                            })}
                        </div>
                    </div>
                )}

                {/* Clients */}
                <div className="mt-6">
                    <h4 className="text-md font-medium mb-2">Clients</h4>
                    {project.clients && project.clients.length > 0 ? (
                        <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Company</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Contact</th>
                                </tr>
                                </thead>
                                <tbody>
                                {project.clients.map((client) => (
                                    <tr key={client.id} className="border-t border-gray-200">
                                        <td className="px-4 py-3 font-medium">{client.name}</td>
                                        <td className="px-4 py-3">{client.company}</td>
                                        <td className="px-4 py-3">{client.email || client.phone}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No clients associated with this project</p>
                    )}
                </div>
            </div>

            {/* Project Team Section */}
            <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                    Project Team
                </h3>

                {project.members && project.members.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Staff ID</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Faculty</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Role</th>
                            </tr>
                            </thead>
                            <tbody>
                            {project.members.map((member) => (
                                <tr key={member.id} className="border-t border-gray-200">
                                    <td className="px-4 py-3 font-medium">{member.name}</td>
                                    <td className="px-4 py-3">{member.staffId}</td>
                                    <td className="px-4 py-3">{member.faculty}</td>
                                    <td className="px-4 py-3">
                                        {member.projectRole === 'leader' ? (
                                            <span
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800">
                                                    Project Leader
                                                </span>
                                        ) : (
                                            <span
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                                    Consultant
                                                </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No team members assigned to this project</p>
                )}
            </div>

            <ProjectMemoTable projectId={project.id}/>

            {/* Cost Breakdown Section */}
            <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                    Cost Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        {/* Section A */}
                        <h4 className="text-md font-medium mb-2">Section A: Payment to Consultants</h4>
                        {project.members && project.members.length > 0 ? (
                            <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 mb-4">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Consultant</th>
                                        <th className="px-4 py-3 text-right font-semibold text-gray-700">Payment (RM)
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {project.members.map((member) => (
                                        <tr key={member.id} className="border-t border-gray-200">
                                            <td className="px-4 py-3 font-medium">{member.name}</td>
                                            <td className="px-4 py-3 text-right">{(member.payment || 0).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-blue-50">
                                        <td className="px-4 py-3 font-medium">Total Section A</td>
                                        <td className="px-4 py-3 text-right font-medium">{(project.projectCost?.sectionATotal || 0).toFixed(2)}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No consultants added</p>
                        )}

                        {/* Section B */}
                        <h4 className="text-md font-medium mb-2">Section B: Direct Cost</h4>
                        <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 mb-4">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Description</th>
                                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Amount (RM)</th>
                                </tr>
                                </thead>
                                <tbody>
                                {(project.projectCost?.sectionB || []).map((item, idx) => (
                                    <tr key={idx} className="border-t border-gray-200">
                                        <td className="px-4 py-3">{item.desc}</td>
                                        <td className="px-4 py-3 text-right">{(item.amount || 0).toFixed(2)}</td>
                                    </tr>
                                ))}
                                <tr className="bg-blue-50">
                                    <td className="px-4 py-3 font-medium">Total Section B</td>
                                    <td className="px-4 py-3 text-right font-medium">{(project.projectCost?.sectionBTotal || 0).toFixed(2)}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Section C */}
                        <h4 className="text-md font-medium mb-2">Section C: Finders Reward</h4>
                        <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 mb-4">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Description</th>
                                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Amount (RM)</th>
                                </tr>
                                </thead>
                                <tbody>
                                {(project.projectCost?.sectionC || []).map((item, idx) => (
                                    <tr key={idx} className="border-t border-gray-200">
                                        <td className="px-4 py-3">{item.desc}</td>
                                        <td className="px-4 py-3 text-right">{(item.amount || 0).toFixed(2)}</td>
                                    </tr>
                                ))}
                                <tr className="bg-blue-50">
                                    <td className="px-4 py-3 font-medium">Total Section C</td>
                                    <td className="px-4 py-3 text-right font-medium">{(project.projectCost?.sectionCTotal || 0).toFixed(2)}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Section D */}
                        <h4 className="text-md font-medium mb-2">Section D: Management Fee</h4>
                        <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 mb-4">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Description</th>
                                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Amount (RM)</th>
                                </tr>
                                </thead>
                                <tbody>
                                {(project.projectCost?.sectionD || []).map((item, idx) => (
                                    <tr key={idx} className="border-t border-gray-200">
                                        <td className="px-4 py-3">{item.desc}</td>
                                        <td className="px-4 py-3 text-right">{(item.amount || 0).toFixed(2)}</td>
                                    </tr>
                                ))}
                                <tr className="bg-blue-50">
                                    <td className="px-4 py-3 font-medium">Total Section D</td>
                                    <td className="px-4 py-3 text-right font-medium">{(project.projectCost?.sectionDTotal || 0).toFixed(2)}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Section E: SST */}
                        {project.projectCost?.sstEnabled && (
                            <div className="mb-4">
                                <h4 className="text-md font-medium mb-2">Section E: SST (6%)</h4>
                                <div className="flex justify-between px-4 py-3 border rounded bg-gray-50">
                                    <span>SST Amount</span>
                                    <span>RM {(project.projectCost?.sstAmount || 0).toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Grand Total */}
                    <div>
                        <h4 className="text-md font-medium mb-2">Project Total</h4>
                        <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-700 font-medium">Total Cost</span>
                                <span className="text-xl font-bold text-blue-700">
                        RM {(project.projectCost?.totalCost || 0).toFixed(2)}
                    </span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Section A: Payment to Consultants</span>
                                    <span
                                        className="text-gray-800">RM {(project.projectCost?.sectionATotal || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Section B: Direct Cost</span>
                                    <span
                                        className="text-gray-800">RM {(project.projectCost?.sectionBTotal || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Section C: Finders Reward</span>
                                    <span
                                        className="text-gray-800">RM {(project.projectCost?.sectionCTotal || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Section D: Management Fee</span>
                                    <span
                                        className="text-gray-800">RM {(project.projectCost?.sectionDTotal || 0).toFixed(2)}</span>
                                </div>
                                {project.projectCost?.sstEnabled && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Section E: SST Amount</span>
                                        <span
                                            className="text-gray-800">RM {(project.projectCost?.sstAmount || 0).toFixed(2)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper component for displaying information
const InfoItem = ({label, value}) => {
    return (
        <div className="mb-3">
            <div className="text-xs text-gray-500">{label}</div>
            <div className="font-medium">{value || "-"}</div>
        </div>
    );
};

export default ProjectDetail;