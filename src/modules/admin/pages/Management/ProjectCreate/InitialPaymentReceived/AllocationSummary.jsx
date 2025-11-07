import React from "react";

const AllocationSummary = ({
                               totalPaymentReceived,
                               allocatedAmount,
                               remainingToAllocate,
                               hasAllBankDetailsComplete
                           }) => {
    return (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 shadow-sm p-5">
            <h3 className="text-lg font-medium text-blue-800 mb-3">Allocation Summary</h3>
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Total Payment:</span>
                    <span className="font-medium">RM {totalPaymentReceived.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Total Allocated:</span>
                    <span className="font-medium">RM {allocatedAmount.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between font-medium pt-2 border-t ${remainingToAllocate < 0 ? 'text-red-600' : remainingToAllocate > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                    <span>Remaining:</span>
                    <span>RM {remainingToAllocate.toFixed(2)}</span>
                </div>
            </div>

            <ValidationStatus
                totalPaymentReceived={totalPaymentReceived}
                remainingToAllocate={remainingToAllocate}
                hasAllBankDetailsComplete={hasAllBankDetailsComplete}
            />
        </div>
    );
};

const ValidationStatus = ({ totalPaymentReceived, remainingToAllocate, hasAllBankDetailsComplete }) => (
    <div className="mt-4 p-3 rounded-md bg-gray-50 border border-gray-200">
        <div className="text-xs font-medium text-gray-700 mb-2">Validation Status:</div>
        <div className="space-y-1">
            <div className={`flex items-center text-xs ${totalPaymentReceived > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${totalPaymentReceived > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                Payment amount entered
            </div>
            <div className={`flex items-center text-xs ${remainingToAllocate === 0 ? 'text-green-600' : 'text-gray-400'}`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${remainingToAllocate === 0 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                Fully allocated
            </div>
            <div className={`flex items-center text-xs ${hasAllBankDetailsComplete ? 'text-green-600' : 'text-gray-400'}`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${hasAllBankDetailsComplete ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                Bank details complete
            </div>
        </div>
    </div>
);

export default AllocationSummary;