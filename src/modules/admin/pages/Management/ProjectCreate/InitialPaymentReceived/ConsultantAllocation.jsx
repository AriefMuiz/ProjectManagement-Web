import React from "react";

const sectionStyle = "bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6";
const sectionHeader = "bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center";
const sectionTitle = "text-lg font-medium text-gray-700";
const sectionTotal = "bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm font-medium";

const ConsultantAllocation = ({
                                  formData,
                                  setFormData,
                                  errors,
                                  handleAllocationChange,
                                  totalPaymentReceived,
                                  isBankDetailsComplete
                              }) => {
    const consultants = formData.projectConsultant || [];
    const sectionTotal = consultants.reduce((sum, item) => sum + (parseFloat(item.allocatedAmount) || 0), 0);

    return (
        <div className={sectionStyle}>
            <div className={sectionHeader}>
                <h3 className={sectionTitle}>Consultant Allocation</h3>
                <div className={sectionTotal}>
                    {sectionTotal.toFixed(2)} RM
                </div>
            </div>
            <div className="p-4">
                {consultants.map((consultant, idx) => {
                    const hasAllocation = (consultant.allocatedAmount || 0) > 0;
                    const bankComplete = consultant.bank?.name && consultant.bank?.accName && consultant.bank?.accNo;

                    return (
                        <ConsultantAllocationItem
                            key={idx}
                            consultant={consultant}
                            idx={idx}
                            hasAllocation={hasAllocation}
                            bankComplete={bankComplete}
                            errors={errors}
                            handleAllocationChange={handleAllocationChange}
                            consultants={consultants}
                            totalPaymentReceived={totalPaymentReceived}
                        />
                    );
                })}
                {consultants.length === 0 && (
                    <div className="text-gray-500 text-sm italic">No consultants to allocate payments to</div>
                )}
            </div>
        </div>
    );
};

const ConsultantAllocationItem = ({
                                      consultant,
                                      idx,
                                      hasAllocation,
                                      bankComplete,
                                      errors,
                                      handleAllocationChange,
                                      consultants,
                                      totalPaymentReceived
                                  }) => {
    return (
        <div className="mb-5 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="bg-gray-50 p-3 rounded-md flex-grow">
                    <div className="font-medium text-gray-800">
                        {consultant.name}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:gap-4">
                        <div className="text-sm text-gray-600">
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {consultant.projectRole}
              </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            {consultant.bank?.name ?
                                `${consultant.bank.name}: ${consultant.bank.accNo || 'No account number'}` :
                                'No bank details'
                            }
                        </div>
                    </div>
                    {hasAllocation && !bankComplete && (
                        <BankDetailsWarning />
                    )}
                </div>

                <div className="w-full sm:w-48">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Allocated Amount
                    </label>
                    <input
                        type="number"
                        className={`input input-bordered w-full text-right ${errors[`projectConsultant-${idx}-allocatedAmount`] ? 'border-red-500' : ''}`}
                        placeholder="0.00"
                        value={consultant.allocatedAmount || ""}
                        onChange={e =>
                            handleAllocationChange(
                                consultants,
                                idx,
                                "allocatedAmount",
                                e.target.value,
                                "projectConsultant"
                            )
                        }
                        min="0"
                        max={Math.min(consultant.paymentAmount, totalPaymentReceived)}
                    />
                    {errors[`projectConsultant-${idx}-allocatedAmount`] && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors[`projectConsultant-${idx}-allocatedAmount`]}
                        </p>
                    )}
                    <div className="text-sm text-gray-500 mt-1">
                        Max: RM {Math.min(consultant.paymentAmount, totalPaymentReceived).toFixed(2)}
                    </div>
                </div>
            </div>
        </div>
    );
};

const BankDetailsWarning = () => (
    <div className="text-amber-600 text-xs mt-1 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        Bank details required
    </div>
);

export default ConsultantAllocation;