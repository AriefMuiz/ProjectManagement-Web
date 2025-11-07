import React from "react";

const sectionStyle = "bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6";
const sectionHeader = "bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center";
const sectionTitle = "text-lg font-medium text-gray-700";
const sectionTotal = "bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm font-medium";

const BANKS = [
    "Maybank",
    "CIMB Bank",
    "Public Bank",
    "RHB Bank",
    "Hong Leong Bank",
    "AmBank",
    "Bank Islam",
    "Bank Rakyat",
    "OCBC Bank",
    "HSBC Bank",
    "Standard Chartered",
    "Other"
];

const SSTAllocation = ({
                           formData,
                           setFormData,
                           sstAmount,
                           totalPaymentReceived,
                           errors,
                           handleSSTAllocationChange,
                           isBankDetailsComplete
                       }) => {
    if (!formData.sstEnabled || sstAmount <= 0) {
        return null;
    }

    const sstAllocation = formData.sstAllocation || {};
    const allocatedAmount = sstAllocation.allocatedAmount || 0;

    return (
        <div className={sectionStyle}>
            <div className={sectionHeader}>
                <h3 className={sectionTitle}>SST (6%) Allocation</h3>
                <div className={sectionTotal}>
                    {allocatedAmount.toFixed(2)} / {sstAmount.toFixed(2)} RM
                </div>
            </div>
            <div className="p-4">
                <div className="mb-5 border-b border-gray-100 pb-6">
                    <SSTAllocationHeader
                        sstAmount={sstAmount}
                        allocatedAmount={allocatedAmount}
                        isBankDetailsComplete={isBankDetailsComplete}
                        sstAllocation={sstAllocation}
                    />

                    <SSTAllocationInput
                        allocatedAmount={allocatedAmount}
                        sstAmount={sstAmount}
                        totalPaymentReceived={totalPaymentReceived}
                        errors={errors}
                        handleSSTAllocationChange={handleSSTAllocationChange}
                    />

                    <SSTBankDetailsForm
                        sstAllocation={sstAllocation}
                        setFormData={setFormData}
                        allocatedAmount={allocatedAmount}
                    />
                </div>
            </div>
        </div>
    );
};

const SSTAllocationHeader = ({ sstAmount, allocatedAmount, isBankDetailsComplete, sstAllocation }) => (
    <div className="flex flex-col sm:flex-row gap-4 mb-3">
        <div className="bg-gray-50 p-3 rounded-md flex-grow">
            <div className="font-medium text-gray-800">
                SST (6%) Tax Amount
            </div>
            <div className="text-sm text-gray-500 mt-1">
                Total SST amount: RM {sstAmount.toFixed(2)}
            </div>
            {allocatedAmount > 0 && !isBankDetailsComplete(sstAllocation) && (
                <div className="text-amber-600 text-xs mt-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Bank details required
                </div>
            )}
        </div>
    </div>
);

const SSTAllocationInput = ({
                                allocatedAmount,
                                sstAmount,
                                totalPaymentReceived,
                                errors,
                                handleSSTAllocationChange
                            }) => (
    <div className="w-full sm:w-48">
        <label className="block text-sm font-medium text-gray-600 mb-1">
            Allocated Amount
        </label>
        <input
            type="number"
            className={`input input-bordered w-full text-right ${errors['sst-allocatedAmount'] ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="0.00"
            value={allocatedAmount || ""}
            onChange={e => handleSSTAllocationChange(e.target.value)}
            min="0"
            max={Math.min(sstAmount, totalPaymentReceived)}
        />
        {errors['sst-allocatedAmount'] && (
            <p className="text-red-500 text-xs mt-1">{errors['sst-allocatedAmount']}</p>
        )}
    </div>
);

const SSTBankDetailsForm = ({ sstAllocation, setFormData, allocatedAmount }) => {
    const hasAllocation = allocatedAmount > 0;

    const handleBankDetailChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            sstAllocation: {
                ...prev.sstAllocation,
                [field]: value
            }
        }));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 bg-white p-3 rounded-md">
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Bank</label>
                <select
                    className={`select select-bordered w-full bg-white ${hasAllocation && !sstAllocation.bankName ? 'border-amber-500' : ''}`}
                    value={sstAllocation.bankName || ""}
                    onChange={e => handleBankDetailChange("bankName", e.target.value)}
                >
                    <option value="">Select Bank</option>
                    {BANKS.map(bank => (
                        <option key={bank} value={bank}>{bank}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                    Account Holder
                </label>
                <input
                    type="text"
                    className={`input input-bordered w-full bg-white ${hasAllocation && !sstAllocation.accountHolderName ? 'border-amber-500' : ''}`}
                    placeholder="Account Holder Name"
                    value={sstAllocation.accountHolderName || ""}
                    onChange={e => handleBankDetailChange("accountHolderName", e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                    Account Number
                </label>
                <input
                    type="text"
                    className={`input input-bordered w-full bg-white ${hasAllocation && !sstAllocation.accountNumber ? 'border-amber-500' : ''}`}
                    placeholder="Account Number"
                    value={sstAllocation.accountNumber || ""}
                    onChange={e => handleBankDetailChange("accountNumber", e.target.value)}
                />
            </div>
        </div>
    );
};

export default SSTAllocation;