import React, { useState, useEffect } from "react";
import PaymentHeader from "./PaymentHeader";
import AllocationSection from "./AllocationSection";
import ConsultantAllocation from "./ConsultantAllocation";
import SSTAllocation from "./SSTAllocation";
import ProgressAndNextButton from "./ProgressAndNextButton.jsx";

const InitialPaymentReceived = ({ formData, setFormData }) => {
    const [allocatedAmount, setAllocatedAmount] = useState(0);
    const [errors, setErrors] = useState({});

    // Get totalPaymentReceived from formData with fallback to 0
    const totalPaymentReceived = formData.totalPaymentReceived || 0;
    const totalProjectCost = formData.totalCost || 0;
    const sstAmount = formData.sstAmount || 0;
    const remainingToAllocate = totalPaymentReceived - allocatedAmount;

    // Utility functions
    const isBankDetailsComplete = (item) => {
        return item.bankName && item.accountHolderName && item.accountNumber;
    };

    const hasAllBankDetailsComplete = () => {
        const consultantsWithAllocation = (formData.projectConsultant || []).filter(
            consultant => (consultant.allocatedAmount || 0) > 0
        );
        const consultantsComplete = consultantsWithAllocation.every(consultant =>
            consultant.bank?.name && consultant.bank?.accName && consultant.bank?.accNo
        );

        const directCostWithAllocation = (formData.directCost || []).filter(
            item => (item.allocatedAmount || 0) > 0
        );
        const directCostComplete = directCostWithAllocation.every(isBankDetailsComplete);

        const finderRewardWithAllocation = (formData.finderReward || []).filter(
            item => (item.allocatedAmount || 0) > 0
        );
        const finderRewardComplete = finderRewardWithAllocation.every(isBankDetailsComplete);

        const managementFeeWithAllocation = (formData.managementFee || []).filter(
            item => (item.allocatedAmount || 0) > 0
        );
        const managementFeeComplete = managementFeeWithAllocation.every(isBankDetailsComplete);

        const sstAllocationComplete = !formData.sstAllocation?.allocatedAmount ||
            (formData.sstAllocation.allocatedAmount > 0 ? isBankDetailsComplete(formData.sstAllocation) : true);

        return consultantsComplete && directCostComplete && finderRewardComplete &&
            managementFeeComplete && sstAllocationComplete;
    };

    const isNextDisabled = () => {
        return totalPaymentReceived === 0 ||
            remainingToAllocate !== 0 ||
            !hasAllBankDetailsComplete();
    };

    // Event handlers
    const handleTotalPaymentChange = (value) => {
        const payment = parseFloat(value) || 0;

        if (payment > totalProjectCost) {
            setErrors(prev => ({
                ...prev,
                'totalPayment': `Payment cannot exceed total project cost (RM ${totalProjectCost.toFixed(2)})`
            }));
        } else {
            setErrors(prev => {
                const newErrors = {...prev};
                delete newErrors['totalPayment'];
                return newErrors;
            });
        }

        // Save totalPaymentReceived to formData
        setFormData(prev => ({
            ...prev,
            totalPaymentReceived: payment
        }));
    };

    const handleAllocationChange = (items, idx, field, value, key) => {
        if (errors[`${key}-${idx}-${field}`]) {
            setErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[`${key}-${idx}-${field}`];
                return newErrors;
            });
        }

        if (field === "allocatedAmount") {
            const numVal = parseFloat(value) || 0;
            const maxAmount = items[idx].paymentAmount || 0;

            if (numVal > maxAmount) {
                setErrors(prev => ({
                    ...prev,
                    [`${key}-${idx}-${field}`]: `Amount exceeds maximum (RM ${maxAmount.toFixed(2)})`
                }));
            }

            if (numVal > totalPaymentReceived) {
                setErrors(prev => ({
                    ...prev,
                    [`${key}-${idx}-${field}`]: `Amount exceeds total payment received (RM ${totalPaymentReceived.toFixed(2)})`
                }));
            }
        }

        const updated = items.map((item, i) =>
            i === idx ? {
                ...item,
                [field]: field === "allocatedAmount" ? parseFloat(value) || 0 : value
            } : item
        );

        setFormData(prev => ({ ...prev, [key]: updated }));
        calculateAllocatedAmount();
    };

    const calculateAllocatedAmount = () => {
        const totalConsultantAllocation = (formData.projectConsultant || [])
            .reduce((sum, item) => sum + (parseFloat(item.allocatedAmount) || 0), 0);

        const totalOtherAllocations = [
            ...(formData.directCost || []),
            ...(formData.finderReward || []),
            ...(formData.managementFee || []),
        ].reduce((sum, item) => sum + (parseFloat(item.allocatedAmount) || 0), 0);

        const sstAllocation = formData.sstAllocation?.allocatedAmount || 0;

        setAllocatedAmount(totalConsultantAllocation + totalOtherAllocations + sstAllocation);
    };

    const handleAutoAllocate = () => {
        if (totalPaymentReceived !== totalProjectCost) return;

        const updatedConsultants = (formData.projectConsultant || []).map(consultant => ({
            ...consultant,
            allocatedAmount: formData.consultantPayments?.[consultant.staffId] || 0
        }));

        const totalDirectCost = (formData.directCost || []).reduce(
            (sum, item) => sum + (parseFloat(item.paymentAmount) || 0), 0
        );
        const updatedDirectCost = (formData.directCost || []).map(item => ({
            ...item,
            allocatedAmount: totalDirectCost > 0 ? item.paymentAmount * (item.paymentAmount / totalDirectCost) : 0
        }));

        const totalFinderReward = (formData.finderReward || []).reduce(
            (sum, item) => sum + (parseFloat(item.paymentAmount) || 0), 0
        );
        const updatedFinderReward = (formData.finderReward || []).map(item => ({
            ...item,
            allocatedAmount: totalFinderReward > 0 ? item.paymentAmount * (item.paymentAmount / totalFinderReward) : 0
        }));

        const updatedManagementFee = (formData.managementFee || []).map(item => ({
            ...item,
            allocatedAmount: item.paymentAmount
        }));

        const updatedSSTAllocation = {
            ...formData.sstAllocation,
            allocatedAmount: sstAmount
        };

        setFormData(prev => ({
            ...prev,
            projectConsultant: updatedConsultants,
            directCost: updatedDirectCost,
            finderReward: updatedFinderReward,
            managementFee: updatedManagementFee,
            sstAllocation: updatedSSTAllocation
        }));

        setTimeout(() => calculateAllocatedAmount(), 100);
    };

    const handleSSTAllocationChange = (value) => {
        const allocatedAmount = parseFloat(value) || 0;
        const maxAmount = sstAmount;

        if (allocatedAmount > maxAmount) {
            setErrors(prev => ({
                ...prev,
                'sst-allocatedAmount': `Amount exceeds maximum SST amount (RM ${maxAmount.toFixed(2)})`
            }));
        } else if (allocatedAmount > totalPaymentReceived) {
            setErrors(prev => ({
                ...prev,
                'sst-allocatedAmount': `Amount exceeds total payment received (RM ${totalPaymentReceived.toFixed(2)})`
            }));
        } else {
            setErrors(prev => {
                const newErrors = {...prev};
                delete newErrors['sst-allocatedAmount'];
                return newErrors;
            });
        }

        setFormData(prev => ({
            ...prev,
            sstAllocation: {
                ...prev.sstAllocation,
                allocatedAmount: allocatedAmount
            }
        }));
        calculateAllocatedAmount();
    };

    const getItemDisplayName = (item, sectionKey) => {
        switch (sectionKey) {
            case "directCost": return item.item;
            case "finderReward": return `Finder: ${item.finderName}`;
            case "managementFee": return `Management: ${item.managedBy}`;
            default: return "";
        }
    };

    const allocationSections = [
        { key: "directCost", title: "Direct Cost Allocation" },
        { key: "finderReward", title: "Finder Reward Allocation" },
        { key: "managementFee", title: "Management Fee Allocation" }
    ];

    useEffect(() => {
        calculateAllocatedAmount();
    }, [formData]);

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <PaymentHeader
                totalPaymentReceived={totalPaymentReceived}
                totalProjectCost={totalProjectCost}
                remainingToAllocate={remainingToAllocate}
                errors={errors}
                handleTotalPaymentChange={handleTotalPaymentChange}
                handleAutoAllocate={handleAutoAllocate}
                allocatedAmount={allocatedAmount}
                hasAllBankDetailsComplete={hasAllBankDetailsComplete()}
            />

            {allocationSections.map(({ key, title }) => (
                <AllocationSection
                    key={key}
                    title={title}
                    items={formData[key] || []}
                    sectionKey={key}
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    handleAllocationChange={handleAllocationChange}
                    isBankDetailsComplete={isBankDetailsComplete}
                    totalPaymentReceived={totalPaymentReceived}
                    getItemDisplayName={getItemDisplayName}
                />
            ))}

            <SSTAllocation
                formData={formData}
                setFormData={setFormData}
                sstAmount={sstAmount}
                totalPaymentReceived={totalPaymentReceived}
                errors={errors}
                handleSSTAllocationChange={handleSSTAllocationChange}
                isBankDetailsComplete={isBankDetailsComplete}
            />

            <ConsultantAllocation
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                handleAllocationChange={handleAllocationChange}
                totalPaymentReceived={totalPaymentReceived}
                isBankDetailsComplete={isBankDetailsComplete}
            />

            <ProgressAndNextButton
                totalPaymentReceived={totalPaymentReceived}
                allocatedAmount={allocatedAmount}
                totalProjectCost={totalProjectCost}
                isNextDisabled={isNextDisabled()}
                onNext={() => {/* Add your next step logic here */}}
            />
        </div>
    );
};

export default InitialPaymentReceived;