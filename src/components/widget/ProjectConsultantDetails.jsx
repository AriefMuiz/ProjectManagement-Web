import React, { useState } from "react";
import useFetchConsultantList from "../../hooks/useFetchConsultantList";

const ProjectConsultantDetails = ({formData, setFormData}) => {
    const [viewingBankDetails, setViewingBankDetails] = useState(null);
    const { consultants, loading: isLoadingConsultants } = useFetchConsultantList();

    // States for consultant selection
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedConsultant, setSelectedConsultant] = useState(null);

    // Filter consultants based on search term and exclude already added ones
    const filteredConsultants = consultants
        ? consultants.filter(consultant => {
            const matchesSearch = !searchTerm ||
                consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                consultant.email.toLowerCase().includes(searchTerm.toLowerCase());
            const isAlreadyAdded = formData.projectConsultant?.some(c => c.consultantId === consultant.id);
            return matchesSearch && !isAlreadyAdded;
        })
        : [];

    // Handle consultant selection
    const handleConsultantSelect = (consultant) => {
        setSelectedConsultant(consultant);
        setSearchTerm(consultant.name);
        setIsDropdownOpen(false);
    };

    // Add new consultant to the project
    const addMember = () => {
        if (selectedConsultant) {
            const newConsultant = {
                consultantId: selectedConsultant.id,
                staffId: selectedConsultant.staffId,
                name: selectedConsultant.name,
                email: selectedConsultant.email,
                phoneNo: selectedConsultant.phoneNo,
                projectRole: "Member",
                faculty: selectedConsultant.faculty,
                bank: {
                    id: selectedConsultant.bank?.id || 0,
                    name: selectedConsultant.bank?.name || "",
                    accName: selectedConsultant.bank?.accName || "",
                    accNo: selectedConsultant.bank?.accNo || ""
                },
                paymentAmount: 0
            };

            setFormData(prev => ({
                ...prev,
                projectConsultant: [...(prev.projectConsultant || []), newConsultant]
            }));

            setSelectedConsultant(null);
            setSearchTerm("");
        }
    };

    // Set a consultant as project leader
    const setLeader = (consultantId) => {
        setFormData(prev => ({
            ...prev,
            projectConsultant: prev.projectConsultant.map(consultant => ({
                ...consultant,
                projectRole: consultant.consultantId === consultantId ? "Leader" : "Member"
            }))
        }));
    };

    // Check if bank details are complete
    const isBankDetailsComplete = (consultant) => {
        return consultant.bank &&
            consultant.bank.name &&
            consultant.bank.accName &&
            consultant.bank.accNo;
    };

    // View/edit bank details for a consultant
    const viewBankDetails = (consultant) => {
        setViewingBankDetails({
            consultantId: consultant.consultantId,
            name: consultant.name,
            bankName: consultant.bank?.name || "",
            accountName: consultant.bank?.accName || "",
            accountNumber: consultant.bank?.accNo || ""
        });
    };

    // Remove a consultant from the project
    const removeMember = (consultantId) => {
        setFormData(prev => ({
            ...prev,
            projectConsultant: prev.projectConsultant.filter(
                consultant => consultant.consultantId !== consultantId
            )
        }));
    };

    // Update bank details for a consultant
    const updateBankDetails = (consultantId, bankDetails) => {
        setFormData(prev => ({
            ...prev,
            projectConsultant: prev.projectConsultant.map(consultant => {
                if (consultant.consultantId === consultantId) {
                    return {
                        ...consultant,
                        bank: {
                            id: consultant.bank?.id || 0,
                            name: bankDetails.bankName,
                            accName: bankDetails.accountName,
                            accNo: parseInt(bankDetails.accountNumber, 10) || 0
                        }
                    };
                }
                return consultant;
            })
        }));

        setViewingBankDetails(null);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Consultant Selection */}
            <div className="flex flex-col">
                <h3 className="text-lg font-medium mb-4">Staff Selection</h3>

                {/* Search and Select Consultant */}
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                    <div className="relative">
                        <div className="form-control mb-2">
                            <label className="label">
                                <span className="text-xs font-medium text-gray-600">Search and Select Consultant</span>
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
                                placeholder="Search by name or email"
                            />
                            {isDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {isLoadingConsultants ? (
                                        <div className="p-3 text-center text-gray-600">Loading consultants...</div>
                                    ) : filteredConsultants.length > 0 ? (
                                        filteredConsultants.map(consultant => (
                                            <div
                                                key={consultant.id}
                                                className="p-3 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleConsultantSelect(consultant)}
                                            >
                                                <div className="font-medium">{consultant.name}</div>
                                                <div className="text-sm text-gray-600">
                                                    {consultant.email} • {consultant.faculty}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-3 text-center text-gray-600">No consultants found</div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            {selectedConsultant && (
                                <div className="text-sm">
                                    <span className="font-medium">Selected:</span> {selectedConsultant.name} ({selectedConsultant.faculty})
                                </div>
                            )}
                            <button
                                type="button"
                                className="btn btn-primary btn-sm ml-auto"
                                onClick={addMember}
                                disabled={!selectedConsultant}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                                </svg>
                                Add as Project Member
                            </button>
                        </div>
                    </div>
                </div>

                {/* Selected consultant details */}
                {selectedConsultant && (
                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                        <h4 className="font-medium mb-2">Consultant Details</h4>
                        <div className="grid grid-cols-1 gap-2 text-sm">
                            <p><span className="font-medium">Staff Id:</span> {selectedConsultant.staffId}</p>
                            <p><span className="font-medium">Name:</span> {selectedConsultant.name}</p>
                            <p><span className="font-medium">Email:</span> {selectedConsultant.email}</p>
                            <p><span className="font-medium">Phone:</span> {selectedConsultant.phoneNo}</p>
                            <p><span className="font-medium">Faculty:</span> {selectedConsultant.faculty}</p>
                            <p><span className="font-medium">Bank:</span> {selectedConsultant.bank?.name}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column - Members Table */}
            <div className="flex flex-col">
                <h3 className="text-lg font-medium mb-4">Project Members</h3>

                {(formData.projectConsultant && formData.projectConsultant.some(consultant => consultant.consultantId)) ? (
                    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Leader</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Faculty</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-700">Bank</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {formData.projectConsultant.map((consultant) => (
                                <tr
                                    key={consultant.consultantId}
                                    className={`border-t border-gray-200 hover:bg-gray-50 ${
                                        consultant.projectRole === "Leader" ? "bg-blue-50" : ""
                                    }`}
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex justify-center items-center">
                                            <input
                                                type="radio"
                                                name="projectLeader"
                                                checked={consultant.projectRole === "Leader"}
                                                onChange={() => setLeader(consultant.consultantId)}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-medium">{consultant.name}</td>
                                    <td className="px-4 py-3">{consultant.email || "-"}</td>
                                    <td className="px-4 py-3">{consultant.faculty}</td>
                                    <td className="px-4 py-3">
                                        {isBankDetailsComplete(consultant) ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1"
                                                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          strokeWidth={2} d="M5 13l4 4L19 7"/>
                                                </svg>
                                                Complete
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1"
                                                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          strokeWidth={2}
                                                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                                </svg>
                                                Incomplete
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => viewBankDetails(consultant)}
                                                className={`btn btn-sm ${
                                                    isBankDetailsComplete(consultant)
                                                        ? "btn-outline btn-success"
                                                        : "btn-outline btn-warning"
                                                }`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1"
                                                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                                                </svg>
                                                {isBankDetailsComplete(consultant) ? "View" : "Add"} Bank
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeMember(consultant.consultantId)}
                                                className="btn btn-sm btn-outline btn-error"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                                                     viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
                        <div className="flex">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <div>
                                <p className="text-sm text-blue-700">No project members added yet. The
                                    first member added will automatically be assigned as the leader.</p>
                            </div>
                        </div>
                    </div>
                )}

                {formData.projectConsultant && formData.projectConsultant.some(c => c.consultantId) && (
                    <div className="mt-2 text-xs text-gray-500">
                        <p>* Select radio button to assign member as project leader</p>
                        {formData.projectConsultant.some(c => c.projectRole === "Leader") && (
                            <p className="mt-1 font-medium text-blue-600">
                                Current leader: {formData.projectConsultant.find(m => m.projectRole === "Leader")?.name}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Bank Details Modal */}
            {viewingBankDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-medium text-gray-700">Bank Account Details</h3>
                            <button
                                onClick={() => setViewingBankDetails(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>

                        <div className="p-4">
                            <div className="text-sm mb-4">
                                <p className="font-medium text-gray-700">{viewingBankDetails.name}</p>
                            </div>

                            <div className="space-y-4">
                                {/* Bank Name */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Bank Name</span>
                                    </label>
                                    <select
                                        value={viewingBankDetails.bankName || ""}
                                        onChange={(e) => setViewingBankDetails({
                                            ...viewingBankDetails,
                                            bankName: e.target.value
                                        })}
                                        className="select select-bordered w-full"
                                    >
                                        <option value="">Select Bank...</option>
                                        <option value="Maybank">Maybank</option>
                                        <option value="CIMB">CIMB</option>
                                        <option value="Public Bank">Public Bank</option>
                                        <option value="RHB">RHB</option>
                                        <option value="Hong Leong Bank">Hong Leong Bank</option>
                                        <option value="AmBank">AmBank</option>
                                        <option value="Bank Islam">Bank Islam</option>
                                        <option value="Bank Rakyat">Bank Rakyat</option>
                                        <option value="OCBC">OCBC</option>
                                        <option value="HSBC">HSBC</option>
                                    </select>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Account Holder Name</span>
                                    </label>
                                    <input
                                        value={viewingBankDetails.accountName || ""}
                                        onChange={(e) => setViewingBankDetails({
                                            ...viewingBankDetails,
                                            accountName: e.target.value
                                        })}
                                        className="input input-bordered w-full"
                                        placeholder="Name as per bank account"
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Account Number</span>
                                    </label>
                                    <input
                                        value={viewingBankDetails.accountNumber || ""}
                                        onChange={(e) => setViewingBankDetails({
                                            ...viewingBankDetails,
                                            accountNumber: e.target.value
                                        })}
                                        className="input input-bordered w-full"
                                        placeholder="Enter account number"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t flex justify-end space-x-2">
                            <button
                                onClick={() => setViewingBankDetails(null)}
                                className="btn btn-outline btn-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => updateBankDetails(viewingBankDetails.consultantId, {
                                    bankName: viewingBankDetails.bankName,
                                    accountName: viewingBankDetails.accountName,
                                    accountNumber: viewingBankDetails.accountNumber
                                })}
                                className="btn btn-primary btn-sm"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectConsultantDetails;