import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import ProjectConsultantDetails from "../../../../components/widget/ProjectConsultantDetails.jsx";
import ProjectDetails from "../../../../components/widget/ProjectDetails.jsx";
import CostBreakdown from "../../../../components/widget/CostBreakdown.jsx";
import ProjectReview from "../../../../components/widget/ProjectReview.jsx";
import Toast from "../../../../components/ui/Toast.jsx";
import {projectsAPI} from "../../../../fetch/common";
import {useNavigate} from "react-router-dom";
import InitialPaymentReceived from "./ProjectCreate/InitialPaymentReceived/Index.jsx";


const ProjectCreate = () => {
    const {setBreadcrumbItems, defaultBreadcrumb} = useOutletContext();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const navigate = useNavigate();
    // breadcrumb items
    useEffect(() => {
        setBreadcrumbItems([
            ...defaultBreadcrumb,
            {label: "Create Project", to: `/admin/survey/create`}
        ]);
        return () => setBreadcrumbItems(defaultBreadcrumb);
    }, [setBreadcrumbItems, defaultBreadcrumb]);


    // Step state
    const [step, setStep] = useState(1);

    // Form state
    const [formData, setFormData] = useState({
        // Project Details fields
        projectCode: "",
        quotationNo: "",
        projectTitle: "",
        status: "",
        projectUnder: "",
        startDate: "",
        endDate: "",
        duration: "",
        projectDescription: "",
        projectDeliverables: "",
        sustainableDevelopmentGoals: [],
        clients: [],

        // Cost Breakdown fields
        directCost: [],
        finderReward: [],
        managementFee: [],
        consultantPayments: {}, // Add this missing field
        totalCost: 0,
        sstPercentage: 0,
        sstEnabled: false,

        // Project members/team fields
        projectConsultant: [],

        // Payment allocation fields (for InitialPaymentReceived)
        totalPaymentReceived: 0,
    });
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const projectData = {
                projectCode: formData.projectCode,
                quotationNo: formData.quotationNo,
                projectTitle: formData.projectTitle,
                status: formData.status.toLowerCase(),
                projectUnder: formData.projectUnder,
                startDate: formData.startDate,
                endDate: formData.endDate,
                projectDescription: formData.projectDescription,
                projectDeliverables: formData.projectDeliverables,
                sdgGoals: formData.sustainableDevelopmentGoals || [],
                clients: (formData.clients || []).map(client => client.id || ""),
                sstPercentage: formData.sstPercentage || 0,
                sstEnabled: formData.sstEnabled || false,

                // Project consultants (previously projectMembers)
                projectConsultant: (formData.projectConsultant || [])
                    .filter((member) => member.staffId && member.name) // ✅ skip empty rows
                    .map((member) => ({
                        consultantId: member.consultantId,
                        paymentAmount: parseFloat(member.paymentAmount) || 0,
                        projectRole: member.projectRole || "Member",
                        bankId: member.bank?.id || 0,
                    })),

                // Cost breakdown sections
                directCost: (formData.directCost || []).map(item => ({
                    item: item.item || "",
                    paymentAmount: parseFloat(item.paymentAmount) || 0
                })),

                finderReward: (formData.finderReward || []).map(item => ({
                    finderName: item.finderName || "",
                    percentCharged: parseFloat(item.percent) || 0,
                    paymentAmount: parseFloat(item.paymentAmount) || 0
                })),

                managementFee: (formData.managementFee || []).map(item => ({
                    managedBy: item.managedBy || "",
                    percentCharged: parseFloat(item.percent) || 0,
                    paymentAmount: parseFloat(item.paymentAmount) || 0
                })),
                initialPayment: {
                    totalReceived: formData.totalPaymentReceived || 0,
                    allocations: {
                        consultants: formData.projectConsultant?.map(c => ({
                            consultantId: c.consultantId,
                            allocatedAmount: c.allocatedAmount || 0,
                            bankDetails: c.bank
                        })),
                        directCost: formData.directCost?.map(item => ({
                            item: item.item,
                            allocatedAmount: item.allocatedAmount || 0,
                            bankDetails: {
                                bankName: item.bankName,
                                accountHolderName: item.accountHolderName,
                                accountNumber: item.accountNumber
                            }
                        })),
                        finderReward: formData.finderReward?.map(item => ({
                            item: item.item,
                            allocatedAmount: item.allocatedAmount || 0,
                            bankDetails: {
                                bankName: item.bankName,
                                accountHolderName: item.accountHolderName,
                                accountNumber: item.accountNumber
                            }
                        })),
                        managementFee: formData.managementFee?.map(item => ({
                            item: item.item,
                            allocatedAmount: item.allocatedAmount || 0,
                            bankDetails: {
                                bankName: item.bankName,
                                accountHolderName: item.accountHolderName,
                                accountNumber: item.accountNumber
                            }
                        })),
                        sstAllocation: {
                            allocatedAmount: 0,
                            bankName: "",
                            accountHolderName: "",
                            accountNumber: ""
                        }
                    }
                }


            };

            console.log("Sending API request:", projectData);

            const result = await projectsAPI.createProject(projectData);
            console.log("Project created successfully:", result);
            setToastMessage("Project created successfully!");
            setShowToast(true);

            // Add navigation after a short delay to show the success message
            setTimeout(() => {
                navigate("/admin/project"); // Add this line to navigate to project list
            }, 1500);
        } catch (error) {
            console.error("Error creating project:", error);
            setToastMessage("Error: " + (error.message || "Failed to create project"));
            setShowToast(true);
        }
    };

    useEffect(() => {
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);

            // Calculate months difference
            let months =
                (end.getFullYear() - start.getFullYear()) * 12 +
                (end.getMonth() - start.getMonth());

            // Ensure at least 0
            months = Math.max(0, months);

            setFormData((prev) => ({
                ...prev,
                duration: months
            }));
        }
    }, [formData.startDate, formData.endDate]);

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));



    return (
        <div className=" p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Project</h1>

            {/* Steps Indicator */}
            <ul className="steps w-full mb-6">
                <li className={`step ${step >= 1 ? "step-primary" : ""}`}>Project Details</li>
                <li className={`step ${step >= 2 ? "step-primary" : ""}`}>Consultant Details</li>
                <li className={`step ${step >= 3 ? "step-primary" : ""}`}>Cost Breakdowns</li>
                <li className={`step ${step >= 4 ? "step-primary" : ""}`}>Initial Payment Received</li>
                <li className={`step ${step >= 5 ? "step-primary" : ""}`}>Review & Submit</li>
            </ul>

            <form onSubmit={handleSubmit}>
                {/* Step 1 - Staff Details */}
                {step === 1 && (
                    <ProjectDetails formData={formData} setFormData={setFormData}/>
                )}
                {/* Step 2 - Project Details */}
                {step === 2 && (
                    <ProjectConsultantDetails formData={formData} setFormData={setFormData}/>
                )}

                {/* Step 3 - Cost Breakdowns */}
                {step === 3 && (
                    <CostBreakdown formData={formData} setFormData={setFormData}/>
                )}

                {step === 4 && (
                    <InitialPaymentReceived formData={formData} setFormData={setFormData}/>
                )}

                {/* Step 4 - Review & Submit */}
                {step === 5 && (
                    <ProjectReview formData={formData}/>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                    {step > 1 &&
                        <button type="button" onClick={prevStep} className="btn btn-outline">Back</button>}
                    {step < 5 &&
                        <button type="button" onClick={nextStep} className="btn btn-primary">Next</button>}
                    {step === 5 && <button type="submit" className="btn btn-success">Submit</button>}
                </div>
            </form>

            {/* Toast notification */}
            {showToast && (
                <Toast
                    message={toastMessage}
                    type="success"
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
};

export default ProjectCreate;
