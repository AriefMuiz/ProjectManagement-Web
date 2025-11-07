import React, {useState} from "react";
import useFetchSdgData from "../../hooks/useFetchSdgData.js";
import useFetchClientList from "../../hooks/useFetchClientList.js"; // Adjust path as needed


const ProjectDetails = ({formData, setFormData}) => {

    const {sdgOptions, isLoadingSdg} = useFetchSdgData();
    const {clients, loading: isLoadingClients} = useFetchClientList(); // Fixed property names

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    // Add these states for client selection
    // Rest of your state variables and functions...
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);

    // Filter clients based on search term
    const filteredClients = clients
        ? clients.filter(client => {
            const matchesSearch = !searchTerm || client.companyName.toLowerCase().includes(searchTerm.toLowerCase());
            const isAlreadyAdded = formData.clients?.some(c => c.id === client.id);
            return matchesSearch && !isAlreadyAdded;
        })
        : [];

    // Handle client selection
    const handleClientSelect = (client) => {
        setSelectedClient(client);
        setSearchTerm(client.companyName);
        setIsDropdownOpen(false);
    };

    // Add client to the project
    const addClient = () => {
        if (selectedClient) {
            // Check if client is already added
            const clientAlreadyAdded = formData.clients?.some(c => c.id === selectedClient.id);
            if (!clientAlreadyAdded) {
                const updatedClients = [
                    ...(formData.clients || []),
                    {
                        id: selectedClient.id,
                        name: selectedClient.representativeName,
                        company: selectedClient.companyName,
                        email: selectedClient.email,
                        phone: selectedClient.phoneNo
                    }
                ];
                setFormData(prev => ({
                    ...prev,
                    clients: updatedClients
                }));
                setSelectedClient(null);
                setSearchTerm("");
            }
        }
    };

    // Remove client from the list
    const removeClient = (clientId) => {
        setFormData(prev => ({
            ...prev,
            clients: prev.clients.filter(client => client.id !== clientId)
        }));
    };


    const handleSdgToggle = (goalId) => {
        const currentGoals = [...(formData.sustainableDevelopmentGoals || [])];
        if (currentGoals.includes(goalId)) {
            setFormData({
                ...formData,
                sustainableDevelopmentGoals: currentGoals.filter((id) => id !== goalId),
            });
        } else {
            setFormData({
                ...formData,
                sustainableDevelopmentGoals: [...currentGoals, goalId],
            });
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-3">Project Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-5">
                    {/* Project Code */}
                    <div className="form-control">
                        <label className="label flex flex-col items-start">
                            <span className="text-sm font-medium text-gray-700">
                                Project Code <span className="text-red-500">*</span>
                            </span>
                        </label>
                        <input
                            name="projectCode"
                            value={formData.projectCode || ''}
                            onChange={handleChange}
                            className="input input-bordered w-full bg-gray-50 focus:bg-white transition-colors"
                            required
                        />
                    </div>

                    {/* Project Quotation Number */}
                    <div className="form-control">
                        <label className="label flex flex-col items-start">
                            <span className="text-sm font-medium text-gray-700">
                                Project Quotation Number <span className="text-red-500">*</span>
                            </span>
                        </label>
                        <input
                            name="quotationNo"
                            value={formData.quotationNo || ''}
                            onChange={handleChange}
                            className="input input-bordered w-full bg-gray-50 focus:bg-white transition-colors"
                            required
                        />
                    </div>

                    {/* Project Title */}
                    <div className="form-control">
                        <label className="label flex flex-col items-start">
                            <span className="text-sm font-medium text-gray-700">
                                Project Title <span className="text-red-500">*</span>
                            </span>
                        </label>
                        <input
                            name="projectTitle"
                            value={formData.projectTitle || ''}
                            onChange={handleChange}
                            className="input input-bordered w-full bg-gray-50 focus:bg-white transition-colors"
                            required
                        />
                    </div>

                    {/* Project Status */}
                    <div className="form-control">
                        <label className="label flex flex-col items-start">
                            <span className="text-sm font-medium text-gray-700">
                                Project Status <span className="text-red-500">*</span>
                            </span>
                        </label>
                        <select
                            name="status"
                            value={formData.status || ''}
                            onChange={handleChange}
                            className="select select-bordered w-full bg-gray-50 focus:bg-white transition-colors"
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="planning">Planning</option>
                            <option value="ongoing">On Going</option>
                            <option value="on_hold">On Hold</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* Project Under */}
                    <div className="form-control">
                        <label className="label flex flex-col items-start">
                            <span className="text-sm font-medium text-gray-700">
                                Project Under <span className="text-red-500">*</span>
                            </span>
                        </label>
                        <select
                            name="projectUnder"
                            value={formData.projectUnder || ''}
                            onChange={handleChange}
                            className="select select-bordered w-full bg-gray-50 focus:bg-white transition-colors"
                            required
                        >
                            <option value="">Select...</option>
                            <option value="UHSB">UHSB</option>
                            <option value="UHE">UHE</option>
                            <option value="JELITA">JELITA</option>
                        </select>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                    {/* Project Duration */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Project Duration <span className="text-red-500">*</span>
                        </label>

                        <div className="grid grid-cols-2 gap-3">
                            {/* Start Date */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="text-xs text-gray-500">Start Date</span>
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate || ''}
                                    onChange={handleChange}
                                    className="input input-bordered w-full bg-gray-50 focus:bg-white transition-colors"
                                    required
                                />
                            </div>

                            {/* End Date */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="text-xs text-gray-500">End Date</span>
                                </label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate || ''}
                                    onChange={handleChange}
                                    className="input input-bordered w-full bg-gray-50 focus:bg-white transition-colors"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Duration (Months) - Calculated */}
                    <div className="form-control">
                        <label className="label flex flex-col items-start">
                            <span className="text-sm font-medium text-gray-700">
                                Duration (Months)
                            </span>
                        </label>
                        <input
                            type="number"
                            name="duration"
                            value={formData.duration || ''}
                            className="input input-bordered w-full bg-gray-50"
                            readOnly
                        />
                        <label className="label">
                            <span className="label-text-alt text-gray-500">Automatically calculated</span>
                        </label>
                    </div>

                    {/* Project Description */}
                    <div className="form-control">
                        <label className="label flex flex-col items-start">
                            <span className="text-sm font-medium text-gray-700">
                                Project Description
                            </span>
                        </label>
                        <textarea
                            name="projectDescription"
                            value={formData.projectDescription || ''}
                            onChange={handleChange}
                            className="textarea textarea-bordered w-full bg-gray-50 focus:bg-white transition-colors"
                            rows="3"
                        ></textarea>
                    </div>

                    {/* Project Deliverables */}
                    <div className="form-control">
                        <label className="label flex flex-col items-start">
                            <span className="text-sm font-medium text-gray-700">
                                Project Deliverables
                            </span>
                        </label>
                        <textarea
                            name="projectDeliverables"
                            value={formData.projectDeliverables || ''}
                            onChange={handleChange}
                            className="textarea textarea-bordered w-full bg-gray-50 focus:bg-white transition-colors"
                            rows="3"
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* SDG section with loading state */}
            <div className="form-control mt-6 col-span-2">
                <label className="label flex flex-col items-start">
        <span className="text-sm font-medium text-gray-700">
            Sustainable Development Goals
            <span className="ml-2 text-xs text-gray-500">(Select all that apply)</span>
        </span>
                </label>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {isLoadingSdg ? (
                        <div className="flex justify-center p-4">
                            <span>Loading SDG data...</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">

                            {(sdgOptions || []).map((goal) => (
                                <div key={goal.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`sdg-${goal.id}`}
                                        checked={formData.sustainableDevelopmentGoals?.includes(goal.id) || false}
                                        onChange={() => handleSdgToggle(goal.id)}
                                        className="checkbox checkbox-sm mr-2"
                                    />
                                    <label htmlFor={`sdg-${goal.id}`}
                                           className="text-sm cursor-pointer flex items-center">
                                        <span className="w-5 h-5 inline-block mr-2 rounded-sm"
                                              style={{backgroundColor: goal.color}}></span>
                                        {goal.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Client Information</h3>

                <div className="bg-gray-50 p-4 rounded-md mb-4">
                    <div className="relative">
                        <div className="form-control mb-2">
                            <label className="label">
                                <span className="text-xs font-medium text-gray-600">Search and Select Client</span>
                            </label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setIsDropdownOpen(true);
                                }}
                                onClick={() => setIsDropdownOpen(true)}
                                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                                className="input input-bordered w-full"
                                placeholder="Search by company name"
                            />
                            {isDropdownOpen && (
                                <div
                                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {isLoadingClients ? (
                                        <div className="p-3 text-center text-gray-600">Loading clients...</div>
                                    ) : filteredClients && filteredClients.length > 0 ? (
                                        filteredClients.map(client => (
                                            <div
                                                key={client.id}
                                                className="p-3 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleClientSelect(client)}
                                            >
                                                <div className="font-medium">{client.companyName}</div>
                                                <div className="text-sm text-gray-600">
                                                    {client.representativeName} • {client.email}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-3 text-center text-gray-600">No clients found</div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            {selectedClient && (
                                <div className="text-sm">
                                    <span
                                        className="font-medium">Selected:</span> {selectedClient.companyName} ({selectedClient.representativeName})
                                </div>
                            )}
                            <button
                                type="button"
                                className="btn btn-primary btn-sm ml-auto"
                                onClick={addClient}
                                disabled={!selectedClient}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M12 4v16m8-8H4"/>
                                </svg>
                                Add Client
                            </button>
                        </div>
                    </div>
                </div>

                {/* Display added clients */}
                {formData.clients && formData.clients.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                            <tr>
                                <th>Company</th>
                                <th>Representative</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {formData.clients.map((client) => (
                                <tr key={client.id}>
                                    <td>{client.company}</td>
                                    <td>{client.name}</td>
                                    <td>{client.email}</td>
                                    <td>{client.phone}</td>
                                    <td>
                                        <button
                                            type="button"
                                            onClick={() => removeClient(client.id)}
                                            className="btn btn-error btn-xs"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;