import React from "react";

const ProgressAndNextButton = ({
                                   totalPaymentReceived,
                                   allocatedAmount,
                                   totalProjectCost,
                                   isNextDisabled,
                                   onNext
                               }) => {
    const progressPercentage = Math.min(100, Math.round((allocatedAmount / totalPaymentReceived) * 100) || 0);

    return (
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Payment Allocation Progress</span>
                <span className="text-sm font-medium text-gray-700">
          {progressPercentage}%
        </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className={`h-2.5 rounded-full ${
                        allocatedAmount > totalPaymentReceived
                            ? 'bg-red-600'
                            : allocatedAmount === totalPaymentReceived && totalPaymentReceived > 0
                                ? 'bg-green-600'
                                : 'bg-blue-600'
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>

            <SummaryNumbers
                totalProjectCost={totalProjectCost}
                totalPaymentReceived={totalPaymentReceived}
                allocatedAmount={allocatedAmount}
            />

        </div>
    );
};

const SummaryNumbers = ({ totalProjectCost, totalPaymentReceived, allocatedAmount }) => (
    <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600">
            <div className="font-semibold">Total Project Cost:</div>
            <div>RM {totalProjectCost.toFixed(2)}</div>
        </div>
        <div className="text-sm text-gray-600">
            <div className="font-semibold">Total Payment Received:</div>
            <div>RM {totalPaymentReceived.toFixed(2)}</div>
        </div>
        <div className="text-sm text-gray-600">
            <div className="font-semibold">Total Allocated:</div>
            <div>RM {allocatedAmount.toFixed(2)}</div>
        </div>
    </div>
);


export default ProgressAndNextButton;