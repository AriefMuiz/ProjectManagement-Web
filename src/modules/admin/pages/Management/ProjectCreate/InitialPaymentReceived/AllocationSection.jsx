import React from "react";
import BankDetailsForm from "./BankDetailsForm";

const sectionStyle = "bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6";
const sectionHeader = "bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center";
const sectionTitle = "text-lg font-medium text-gray-700";
const sectionTotal = "bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm font-medium";

const AllocationSection = ({
                               title,
                               items,
                               sectionKey,
                               formData,
                               setFormData,
                               errors,
                               handleAllocationChange,
                               isBankDetailsComplete,
                               totalPaymentReceived,
                               getItemDisplayName
                           }) => {
    const sectionTotal = items.reduce((sum, item) => sum + (parseFloat(item.allocatedAmount) || 0), 0);
    const sectionMaxTotal = items.reduce((sum, item) => sum + (parseFloat(item.paymentAmount) || 0), 0);

    return (
        <div className={sectionStyle}>
            <div className={sectionHeader}>
                <h3 className={sectionTitle}>{title}</h3>
                <div className={sectionTotal}>
                    {sectionTotal.toFixed(2)} / {sectionMaxTotal.toFixed(2)} RM
                </div>
            </div>
            <div className="p-4">
                {items.map((item, idx) => {
                    const hasAllocation = (item.allocatedAmount || 0) > 0;
                    const bankComplete = isBankDetailsComplete(item);

                    return (
                        <div key={idx} className="mb-5 border-b border-gray-100 pb-6">
                            <div className="flex flex-col sm:flex-row gap-4 mb-3">
                                <div className="bg-gray-50 p-3 rounded-md flex-grow">
                                    <div className="font-medium text-gray-800">
                                        {getItemDisplayName(item, sectionKey)}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        Cost amount: RM {item.paymentAmount.toFixed(2)}
                                    </div>
                                    {hasAllocation && !bankComplete && (
                                        <div className="text-amber-600 text-xs mt-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            Bank details required
                                        </div>
                                    )}
                                </div>

                                <div className="w-full sm:w-48">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Allocated Amount
                                    </label>
                                    <input
                                        type="number"
                                        className={`input input-bordered w-full text-right ${errors[`${sectionKey}-${idx}-allocatedAmount`] ? 'border-red-500 focus:ring-red-500' : ''}`}
                                        placeholder="0.00"
                                        value={item.allocatedAmount || ""}
                                        onChange={e =>
                                            handleAllocationChange(
                                                items,
                                                idx,
                                                "allocatedAmount",
                                                e.target.value,
                                                sectionKey
                                            )
                                        }
                                        min="0"
                                        max={Math.min(item.paymentAmount, totalPaymentReceived)}
                                    />
                                    {errors[`${sectionKey}-${idx}-allocatedAmount`] && (
                                        <p className="text-red-500 text-xs mt-1">{errors[`${sectionKey}-${idx}-allocatedAmount`]}</p>
                                    )}
                                </div>
                            </div>

                            <BankDetailsForm
                                item={item}
                                sectionKey={sectionKey}
                                idx={idx}
                                hasAllocation={hasAllocation}
                                handleAllocationChange={handleAllocationChange}
                                items={items}
                            />
                        </div>
                    );
                })}
                {items.length === 0 && (
                    <div className="text-gray-500 text-sm italic">No items to allocate</div>
                )}
            </div>
        </div>
    );
};

export default AllocationSection;