// src/components/widget/ProjectReview.jsx
import React from "react";
import StatusBadge from "./StatusBadge.jsx";
import useFetchSdgData from "../../hooks/useFetchSdgData.js";

const ProjectReview = ({ formData }) => {

  const {sdgOptions} = useFetchSdgData();

  // Calculate totals for cost breakdown
  const consultantPaymentsTotal = Object.values(formData.consultantPayments || {}).reduce(
      (sum, p) => sum + (parseFloat(p) || 0), 0
  );

  const directCostTotal = (formData.directCost || []).reduce(
      (sum, item) => sum + (parseFloat(item.paymentAmount) || 0), 0
  );

  const finderRewardTotal = (formData.finderReward || []).reduce(
      (sum, item) => sum + (parseFloat(item.paymentAmount) || 0), 0
  );

  const managementFeeBaseAmount = 0.15 * (consultantPaymentsTotal + directCostTotal);
  const managementFeeTotal = formData.managementFee?.length > 0 ? managementFeeBaseAmount : 0;

  const subtotal = consultantPaymentsTotal + directCostTotal + finderRewardTotal + managementFeeTotal;
  const sstAmount = formData.sstEnabled ? (0.06 * subtotal) : 0;
  const totalCost = subtotal + sstAmount;

  return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-3">Review Project Information</h2>

        {/* Project Details Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Project Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <InfoItem label="Project Code" value={formData.projectCode} />
              <InfoItem label="Quotation Number" value={formData.quotationNo} />
              <InfoItem label="Project Title" value={formData.projectTitle} />
              <InfoItem label="Project Status" value={<StatusBadge status={formData.status} />} />
              <InfoItem label="Project Under" value={formData.projectUnder} />
            </div>
            <div>
              <InfoItem label="Start Date" value={formData.startDate} />
              <InfoItem label="End Date" value={formData.endDate} />
              <InfoItem label="Duration (Months)" value={formData.duration} />
              <InfoItem label="Description" value={formData.projectDescription} />
              <InfoItem label="Deliverables" value={formData.projectDeliverables} />
            </div>
          </div>

          {/* Display selected SDGs */}
          {formData.sustainableDevelopmentGoals && formData.sustainableDevelopmentGoals.length > 0 && (
              <div className="mt-4">
                <h4 className="text-md font-medium mb-2">Sustainable Development Goals</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.sustainableDevelopmentGoals.map(sdgId => {
                    const sdg = sdgOptions.find(option => option.id === sdgId);
                    return sdg ? (
                        <span
                            key={sdg.id}
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: `${sdg.color}20`, color: sdg.color }}
                        >
                    {sdg.name}
                  </span>
                    ) : null;
                  })}
                </div>
              </div>
          )}

          {/* Clients */}
          <div className="mt-4">
            <h4 className="text-md font-medium mb-2">Clients</h4>
            {formData.clients && formData.clients.length > 0 ? (
                <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Company</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Contact Person</th>
                    </tr>
                    </thead>
                    <tbody>
                    {formData.clients.map((client, index) => (
                        <tr key={index} className="border-t border-gray-200">
                          <td className="px-4 py-2 font-medium">{client.company}</td>
                          <td className="px-4 py-2">{client.name}</td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
            ) : (
                <p className="text-gray-500 italic">No clients added</p>
            )}
          </div>
        </div>

        {/* Project Team Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Project Team
          </h3>

          {formData.projectConsultant && formData.projectConsultant.length > 0 ? (
              <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Staff ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                    <th className={"px-4 py-3 text-left font-semibold text-gray-700"}>Email</th>
                    <th className={"px-4 py-3 text-left font-semibold text-gray-700"}>Phone No</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Faculty</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Role</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Payment (RM)</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Bank Details</th>
                  </tr>
                  </thead>
                  <tbody>
                  {formData.projectConsultant.map((member) => (
                      <tr key={member.staffId} className="border-t border-gray-200">
                        <td className="px-4 py-3">{member.staffId}</td>
                        <td className="px-4 py-3 font-medium">{member.name}</td>
                        <td className="px-4 py-3">{member.email}</td>
                        <td className="px-4 py-3">{member.phoneNo}</td>

                        <td className="px-4 py-3">{member.faculty}</td>
                        <td className="px-4 py-3">
                      <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              member.projectRole === "Leader"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {member.projectRole === "Leader" ? "Leader" : "Member"}
                      </span>
                        </td>
                        <td className="px-4 py-3">
                          {formData.consultantPayments?.[member.staffId]?.toFixed(2) || "0.00"}
                        </td>
                        <td className="px-4 py-3">
                          {member.bank && member.bank.name && member.bank.accName && member.bank.accNo ? (
                              <div>
                                <div className="text-xs text-gray-500">{member.bank.name}</div>
                                <div className="text-xs">{member.bank.accName}</div>
                                <div className="text-xs text-gray-500">{member.bank.accNo}</div>
                              </div>
                          ) : (
                              <span className="text-amber-600 text-xs">Incomplete</span>
                          )}
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          ) : (
              <p className="text-gray-500 italic">No project consultants added</p>
          )}
        </div>

        {/* Cost Breakdown Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Cost Breakdown
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Section A: Payment to Consultants */}
            <div className="rounded-lg shadow-sm border border-gray-200">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-medium">
                Section A: Payment to Consultants
              </div>
              <div className="p-4">
                {formData.projectConsultant && formData.projectConsultant.length > 0 ? (
                    <div className="space-y-2">
                      {formData.projectConsultant.map(member => (
                          <div key={member.staffId} className="flex justify-between text-sm">
                            <span>{member.name}</span>
                            <span className="font-medium">
                        RM {formData.consultantPayments?.[member.staffId]?.toFixed(2) || "0.00"}
                      </span>
                          </div>
                      ))}
                      <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between font-medium">
                        <span>Total</span>
                        <span>RM {consultantPaymentsTotal.toFixed(2)}</span>
                      </div>
                    </div>
                ) : (
                    <p className="text-gray-500 italic text-sm">No consultants added</p>
                )}
              </div>
            </div>

            {/* Section B: Direct Cost */}
            <div className="rounded-lg shadow-sm border border-gray-200">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-medium">
                Section B: Direct Cost
              </div>
              <div className="p-4">
                {formData.directCost && formData.directCost.length > 0 ? (
                    <div className="space-y-2">
                      {formData.directCost.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>{item.item}</span>
                            <span className="font-medium">RM {parseFloat(item.paymentAmount).toFixed(2)}</span>
                          </div>
                      ))}
                      <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between font-medium">
                        <span>Total</span>
                        <span>RM {directCostTotal.toFixed(2)}</span>
                      </div>
                    </div>
                ) : (
                    <p className="text-gray-500 italic text-sm">No direct costs added</p>
                )}
              </div>
            </div>

            {/* Section C: Finders Reward */}
            <div className="rounded-lg shadow-sm border border-gray-200">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-medium">
                Section C: Finders Reward
              </div>
              <div className="p-4">
                {formData.finderReward && formData.finderReward.length > 0 ? (
                    <div className="space-y-2">
                      {formData.finderReward.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>{item.finderName}</span>
                            <span className="font-medium">RM {parseFloat(item.paymentAmount).toFixed(2)}</span>
                          </div>
                      ))}
                      <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between font-medium">
                        <span>Total</span>
                        <span>RM {finderRewardTotal.toFixed(2)}</span>
                      </div>
                    </div>
                ) : (
                    <p className="text-gray-500 italic text-sm">No finder rewards added</p>
                )}
              </div>
            </div>

            {/* Section D: Management Fee */}
            <div className="rounded-lg shadow-sm border border-gray-200">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-medium">
                Section D: Management Fee (15%)
              </div>
              <div className="p-4">
                {formData.managementFee && formData.managementFee.length > 0 ? (
                    <div className="space-y-2">
                      {formData.managementFee.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>{item.managedBy}</span>
                            <span className="font-medium">
                        RM {(managementFeeBaseAmount / formData.managementFee.length).toFixed(2)}
                      </span>
                          </div>
                      ))}
                      <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between font-medium">
                        <span>Total</span>
                        <span>RM {managementFeeTotal.toFixed(2)}</span>
                      </div>
                    </div>
                ) : (
                    <p className="text-gray-500 italic text-sm">No management fees added</p>
                )}
              </div>
            </div>
          </div>

          {/* SST and Total */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700">SST (6%)</span>
              <span className="font-medium">{formData.sstEnabled ? `RM ${sstAmount.toFixed(2)}` : "Not Applied"}</span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-300">
              <span className="font-bold text-lg text-gray-800">Total Project Cost</span>
              <span className="font-bold text-lg text-blue-600">RM {totalCost.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
  );
};

const InfoItem = ({ label, value }) => {
  return (
      <div className="mb-3">
        <div className="text-sm text-gray-500 mb-1">{label}</div>
        <div className="text-gray-800">{value || "-"}</div>
      </div>
  );
};

export default ProjectReview;