import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import ProjectConsultantDetails from "../../../../components/widget/ProjectConsultantDetails.jsx";
import ProjectDetails from "../../../../components/widget/ProjectDetails.jsx";
import CostBreakdown from "../../../../components/widget/CostBreakdown.jsx";
import ProjectReview from "../../../../components/widget/ProjectReview.jsx";
import Toast from "../../../../components/ui/Toast.jsx";
import { projectsAPI } from "../../../../fetch/admin";


const ProjectEdit = () => {
    const { id } = useParams();
    const { setBreadcrumbItems, defaultBreadcrumb } = useOutletContext();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setBreadcrumbItems([
            ...defaultBreadcrumb,
            { label: "Edit Project", to: `/admin/project/edit/${id}` }
        ]);
        return () => setBreadcrumbItems(defaultBreadcrumb);
    }, [setBreadcrumbItems, defaultBreadcrumb, id]);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const response = await projectsAPI.getProjectById(id);
                // Map API response to formData structure as in ProjectCreate
                const data = response.data;
                console.log("Fetched project data:", data);


                setFormData({
                    // Staff Details
                    staffId: "",
                    staffName: "",
                    faculty: "",
                    stCategory: "",
                    staffStatus: "",
                    bankName: "",
                    accountName: "",
                    accountNumber: "",

                    // Project Details
                    projectCode: data.projectCode || "",
                    quotationNumber: data.quotationNumber || "",
                    projectTitle: data.title || "",
                    status: data.status || "",
                    projectUnder: data.projectUnder || "",
                    startDate: data.startDate || "",
                    endDate: data.endDate || "",
                    duration: data.duration || "",
                    projectDescription: data.description || "",
                    projectDeliverables: data.deliverables || "",
                    clients: (data.clients || []).map(client => ({
                        company: client.company || "",
                        name: client.name || ""
                    })),

                    // Cost Breakdown
                    consultantPayments: Object.fromEntries(
                        (data.members || []).map(m => [m.staffId, m.payment])
                    ),
                    sectionB: data.projectCost?.sectionB || [],
                    sectionC: data.projectCost?.sectionC || [],
                    sectionD: data.projectCost?.sectionD || [],
                    sectionATotal: data.projectCost?.sectionATotal || 0,
                    sectionBTotal: data.projectCost?.sectionBTotal || 0,
                    sectionCTotal: data.projectCost?.sectionCTotal || 0,
                    sectionDTotal: data.projectCost?.sectionDTotal || 0,
                    totalCost: data.projectCost?.totalCost || 0,
                    sstAmount: data.projectCost?.sstAmount || 0,
                    sstEnabled: data.projectCost?.sstEnabled || false,

                    // Project members/team
                    projectMembers: (data.members || []).map(member => ({
                        ...member,
                        bankName: member.bank?.bankName || "",
                        accountName: member.bank?.accountName || "",
                        accountNumber: member.bank?.accountNumber || ""
                    })),
                    projectLeaderId: data.members?.find(m => m.projectRole === "leader")?.staffId || ""
                });
                setLoading(false);
            } catch (error) {
                setToastMessage("Error: " + (error.message || "Failed to fetch project data"));
                setShowToast(true);
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const projectData = {
                projectCode: formData.projectCode,
                quotationNumber: formData.quotationNumber,
                projectTitle: formData.projectTitle,
                status: formData.status.toLowerCase(),
                projectUnder: formData.projectUnder,
                startDate: formData.startDate,
                endDate: formData.endDate,
                projectDescription: formData.projectDescription,
                projectDeliverables: formData.projectDeliverables,
                sdgGoals: formData.sustainableDevelopmentGoals || [],
                clients: (formData.clients || []).map(client => ({
                    clientCompany: client.company || "",
                    clientName: client.name || ""
                })),
                consultantPayments: (formData.projectMembers || []).map(member => ({
                    staffId: member.staffId,
                    payment: parseFloat(formData.consultantPayments[member.staffId] || 0)
                })),
                // New cost breakdown structure
                sectionB: formData.sectionB || [],
                sectionC: formData.sectionC || [],
                sectionD: formData.sectionD || [],
                sectionATotal: formData.sectionATotal || 0,
                sectionBTotal: formData.sectionBTotal || 0,
                sectionCTotal: formData.sectionCTotal || 0,
                sectionDTotal: formData.sectionDTotal || 0,
                sstAmount: formData.sstAmount || 0,
                sstEnabled: formData.sstEnabled || false,
                totalCost: formData.totalCost || 0,

                projectMembers: (formData.projectMembers || []).map(member => ({
                    staffId: member.staffId,
                    name: member.name,
                    projectRole: member.staffId === formData.projectLeaderId ? "leader" : "member",
                    department: member.faculty || "Not specified",
                    bank: {
                        name: member.bankName || "Not provided",
                        accName: member.accountName || member.name || "",
                        accNo: member.accountNumber || "Not provided"
                    }
                })),
                consultantLeaderId: formData.projectLeaderId || ""
            };
            await projectsAPI.updateProject(id, projectData);
            setToastMessage("Project updated successfully!");
            setShowToast(true);
            setTimeout(() => {
                navigate("/admin/project");
            }, 1500);
        } catch (error) {
            setToastMessage("Error: " + (error.message || "Failed to update project"));
            setShowToast(true);
        }
    };

    if (loading || !formData) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Project</h1>
            <ul className="steps w-full mb-6">
                <li className={`step ${step >= 1 ? "step-primary" : ""}`}>Project Details</li>
                <li className={`step ${step >= 2 ? "step-primary" : ""}`}>Consultant Details</li>
                <li className={`step ${step >= 3 ? "step-primary" : ""}`}>Cost Breakdowns</li>
                <li className={`step ${step >= 4 ? "step-primary" : ""}`}>Review & Submit</li>
            </ul>
            <form onSubmit={handleSubmit}>
                {step === 1 && (
                    <ProjectDetails formData={formData} setFormData={setFormData} />
                )}
                {step === 2 && (
                    <ProjectConsultantDetails formData={formData} setFormData={setFormData} />
                )}
                {step === 3 && (
                    <CostBreakdown formData={formData} setFormData={setFormData} />
                )}
                {step === 4 && (
                    <ProjectReview formData={formData} />
                )}
                <div className="flex justify-between mt-6">
                    {step > 1 &&
                        <button type="button" onClick={prevStep} className="btn btn-outline">Back</button>}
                    {step < 4 &&
                        <button type="button" onClick={nextStep} className="btn btn-primary">Next</button>}
                    {step === 4 && <button type="submit" className="btn btn-success">Update</button>}
                </div>
            </form>
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

export default ProjectEdit;