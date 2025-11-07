import React from "react";

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

const BankDetailsForm = ({
                             item,
                             sectionKey,
                             idx,
                             hasAllocation,
                             handleAllocationChange,
                             items
                         }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 bg-white p-3 rounded-md">
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Bank</label>
                <select
                    className={`select select-bordered w-full bg-white ${hasAllocation && !item.bankName ? 'border-amber-500' : ''}`}
                    value={item.bankName || ""}
                    onChange={e =>
                        handleAllocationChange(
                            items,
                            idx,
                            "bankName",
                            e.target.value,
                            sectionKey
                        )
                    }
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
                    className={`input input-bordered w-full bg-white ${hasAllocation && !item.accountHolderName ? 'border-amber-500' : ''}`}
                    placeholder="Account Holder Name"
                    value={item.accountHolderName || ""}
                    onChange={e =>
                        handleAllocationChange(
                            items,
                            idx,
                            "accountHolderName",
                            e.target.value,
                            sectionKey
                        )
                    }
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                    Account Number
                </label>
                <input
                    type="text"
                    className={`input input-bordered w-full bg-white ${hasAllocation && !item.accountNumber ? 'border-amber-500' : ''}`}
                    placeholder="Account Number"
                    value={item.accountNumber || ""}
                    onChange={e =>
                        handleAllocationChange(
                            items,
                            idx,
                            "accountNumber",
                            e.target.value,
                            sectionKey
                        )
                    }
                />
            </div>
        </div>
    );
};

export default BankDetailsForm;