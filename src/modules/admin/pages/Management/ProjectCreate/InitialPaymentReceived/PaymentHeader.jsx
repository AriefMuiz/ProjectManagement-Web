import React from "react";
import AllocationSummary from "./AllocationSummary.jsx";

const PaymentHeader = ({
                           totalPaymentReceived,
                           totalProjectCost,
                           remainingToAllocate,
                           errors,
                           handleTotalPaymentChange,
                           handleAutoAllocate,
                           allocatedAmount
                       }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Payment Allocation</h3>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="flex-grow">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Total Payment Received
                        </label>
                        <input
                            type="number"
                            className={`input input-bordered w-full bg-white ${errors['totalPayment'] ? 'border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="Enter total payment received"
                            value={totalPaymentReceived}
                            onChange={e => handleTotalPaymentChange(e.target.value)}
                        />
                        {errors['totalPayment'] && (
                            <p className="text-red-500 text-xs mt-1">{errors['totalPayment']}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 mt-4 md:mt-0">
                        <div className="text-gray-600 text-sm">
                            <div className="mb-1">
                                Total Project Cost: <span className="font-semibold">RM {totalProjectCost.toFixed(2)}</span>
                            </div>
                            <div>
                                Amount to Be Allocated: <span className={`font-semibold ${remainingToAllocate < 0 ? 'text-red-600' : remainingToAllocate === 0 ? 'text-green-600' : 'text-blue-600'}`}>
                  RM {remainingToAllocate.toFixed(2)}
                </span>
                                {remainingToAllocate < 0 && <span className="ml-2 text-xs text-red-600">Exceeded payment amount</span>}
                            </div>
                        </div>
                        <button
                            type="button"
                            className={`btn btn-sm ${totalPaymentReceived === totalProjectCost ? 'btn-primary' : 'btn-outline btn-disabled'}`}
                            onClick={handleAutoAllocate}
                            disabled={totalPaymentReceived !== totalProjectCost}
                        >
                            Auto Allocate
                        </button>
                    </div>
                </div>
            </div>

            <AllocationSummary
                totalPaymentReceived={totalPaymentReceived}
                allocatedAmount={allocatedAmount}
                remainingToAllocate={remainingToAllocate}
            />
        </div>
    );
};

export default PaymentHeader;