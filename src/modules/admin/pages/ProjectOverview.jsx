import React, {useEffect, useState} from "react";
import projectsAPI from "../../../fetch/admin/projects.js";
import ProjectTable from "../../../components/table/ProjectTable.jsx";

const categories = ["UHSB", "UHE", "JELITA"];

function getCategoryStats(projects, funder) {
    const filtered = projects.filter(p => p.funder === funder);
    const count = filtered.length;
    const totalWithoutSST = filtered.reduce((sum, p) => sum + p.cost.withoutSST, 0);
    const totalWithSST = filtered.reduce((sum, p) => sum + p.cost.withSST, 0);
    return {count, totalWithSST, totalWithoutSST};
}

function getTotalStats(projects) {
    const count = projects.length;
    const totalWithoutSST = projects.reduce((sum, p) => sum + p.cost.withoutSST, 0);
    const totalWithSST = projects.reduce((sum, p) => sum + p.cost.withSST, 0);
    return {count, totalWithSST, totalWithoutSST};
}

function getRangeStats(projects, min, max = Infinity) {
    const filtered = projects.filter(
        p => p.cost.withoutSST >= min && p.cost.withoutSST < max
    );
    const count = filtered.length;
    const totalWithoutSST = filtered.reduce((sum, p) => sum + p.cost.withoutSST, 0);
    const totalWithSST = filtered.reduce((sum, p) => sum + p.cost.withSST, 0);
    return {count, totalWithSST, totalWithoutSST};
}

function StatCard({title, count, withSST, withoutSST, color}) {
    return (
        <div className={`rounded-xl shadow-lg p-6 bg-white border-t-4 ${color} flex-1 min-w-[220px]`}>
            <h2 className="text-lg font-bold mb-2 text-gray-700">{title}</h2>
            <div className="mb-2 text-3xl font-extrabold text-gray-900">{count}</div>
            <div className="text-sm text-gray-500">Projects</div>
            <div className="mt-4">
                <div className="text-xs text-gray-500">Total Revenue (w/ SST):</div>
                <div
                    className="text-lg font-semibold text-green-700">RM {withSST.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                <div className="text-xs text-gray-500 mt-1">Total Revenue (w/o SST):</div>
                <div
                    className="text-lg font-semibold text-blue-700">RM {withoutSST.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            </div>
        </div>
    );
}

function SubStatCard({title, count, color}) {
    return (
        <div className={`rounded-lg shadow p-4 bg-white border-l-4 ${color} flex-1 min-w-[180px]`}>
            <h3 className="text-base font-semibold text-gray-700 mb-1">{title}</h3>
            <div className="text-xl font-bold text-gray-900">{count}</div>
            <div className="text-xs text-gray-500">Projects</div>
        </div>
    );
}

function ProjectOverview() {
    const [projects, setProjects] = useState([]);
    const [costSummary, setCostSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toastType, setToastType] = useState("success");

    const setToast = (message, type) => {
        setToastMessage(message);
        setToastType(type);
    };


    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await projectsAPI.getAllProjects();
                setProjects(response.data || []);
            } catch (error) {
                console.error("Error fetching projects:", error);
                setError("Failed to load projects. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        const fetchCostSummary = async () => {
            try {
                const response = await projectsAPI.getCostSummary();
                console.log("Cost summary response:", response);
                setCostSummary(response || []);
            } catch (error) {
                console.error("Error fetching cost summary:", error);
            }
        };

        fetchProjects();
        fetchCostSummary();
    }, []);

    // Stats for each category
    const stats = categories.map((cat) => ({
        ...getCategoryStats(costSummary, cat),
        title: cat,
    }));
    const totalStats = getTotalStats(costSummary);

    // Sub-card stats
    const range200to500 = getRangeStats(costSummary, 200000, 500000);
    const rangeAbove500 = getRangeStats(costSummary, 500000);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                    <p className="mt-4 text-gray-600">Loading project data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <div className="alert alert-error max-w-md">
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 tracking-tight">
                Project Overview
            </h1>

            {/* Main Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="UHSB"
                    count={stats[0].count}
                    withSST={stats[0].totalWithSST}
                    withoutSST={stats[0].totalWithoutSST}
                    color="border-blue-600"
                />
                <StatCard
                    title="UHE"
                    count={stats[1].count}
                    withSST={stats[1].totalWithSST}
                    withoutSST={stats[1].totalWithoutSST}
                    color="border-purple-600"
                />
                <StatCard
                    title="JELITA"
                    count={stats[2].count}
                    withSST={stats[2].totalWithSST}
                    withoutSST={stats[2].totalWithoutSST}
                    color="border-pink-600"
                />
                <StatCard
                    title="TOTAL"
                    count={totalStats.count}
                    withSST={totalStats.totalWithSST}
                    withoutSST={totalStats.totalWithoutSST}
                    color="border-green-600"
                />
            </div>

            {/* Sub Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-10">
                <SubStatCard
                    title="Project Value RM200k–RM500k"
                    count={range200to500.count}
                    color="border-yellow-500"
                />
                <SubStatCard
                    title="Project Value > RM500k"
                    count={rangeAbove500.count}
                    color="border-red-500"
                />
            </div>

            <ProjectTable setToast={setToast}/>
        </div>
    );
}

export default ProjectOverview;