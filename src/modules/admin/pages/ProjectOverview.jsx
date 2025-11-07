import React, {useEffect, useState} from "react";
import ProjectFilters from "../../../components/table/filter/ProjectFilters.jsx";
import ProjectTable from "../../../components/widget/ProjectTable";
import projectsAPI from "../../../fetch/admin/projects.js";

// Mock dataset — replace with API later



const categories = ["UHSB", "UHE", "JELITA"];

function getCategoryStats(projects, funder) {
    const filtered = projects.filter(p => p.funder === funder);
    const count = filtered.length;
    const totalWithoutSST = filtered.reduce((sum, p) => sum + p.cost.withoutSST, 0);
    const totalWithSST = filtered.reduce((sum, p) => sum + p.cost.withSST, 0);
    return { count, totalWithSST, totalWithoutSST };
}

function getTotalStats(projects) {
    const count = projects.length;
    const totalWithoutSST = projects.reduce((sum, p) => sum + p.cost.withoutSST, 0);
    const totalWithSST = projects.reduce((sum, p) => sum + p.cost.withSST, 0);
    return { count, totalWithSST, totalWithoutSST };
}

function getRangeStats(projects, min, max = Infinity) {
    const filtered = projects.filter(
        p => p.cost.withoutSST >= min && p.cost.withoutSST < max
    );
    const count = filtered.length;
    const totalWithoutSST = filtered.reduce((sum, p) => sum + p.cost.withoutSST, 0);
    const totalWithSST = filtered.reduce((sum, p) => sum + p.cost.withSST, 0);
    return { count, totalWithSST, totalWithoutSST };
}

function StatCard({ title, count, withSST, withoutSST, color }) {
    return (
        <div className={`rounded-xl shadow-lg p-6 bg-white border-t-4 ${color} flex-1 min-w-[220px]`}>
            <h2 className="text-lg font-bold mb-2 text-gray-700">{title}</h2>
            <div className="mb-2 text-3xl font-extrabold text-gray-900">{count}</div>
            <div className="text-sm text-gray-500">Projects</div>
            <div className="mt-4">
                <div className="text-xs text-gray-500">Total Revenue (w/ SST):</div>
                <div className="text-lg font-semibold text-green-700">RM {withSST.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
                <div className="text-xs text-gray-500 mt-1">Total Revenue (w/o SST):</div>
                <div className="text-lg font-semibold text-blue-700">RM {withoutSST.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
            </div>
        </div>
    );
}

function SubStatCard({ title, count, color }) {
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
    const [filteredProjects, setFilteredProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await projectsAPI.getAllProjects();
                // The API returns projects in response.data
                setProjects(response.data || []);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching projects:", error);
                setError("Failed to load projects. Please try again later.");
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        const fetchCostSummary = async () => {
            try {
                setLoading(true);
                const response = await projectsAPI.getCostSummary();
                console.log("response:", response);
                // The API returns projects in response.data
                setCostSummary(response || []);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching projects:", error);
                setError("Failed to load projects. Please try again later.");
                setLoading(false);
            }
        };

        fetchCostSummary();
    }, []);

    useEffect(() => {
        setFilteredProjects(projects);
    }, [projects]);

    const handleFilter = (filters) => {
        console.log("Applied Filters:", filters);

        let filtered = [...projects];

        // Apply status filter
        if (filters.status && filters.status !== "all") {
            filtered = filtered.filter(
                project => project.status.toLowerCase() === filters.status
            );
        }

        // Apply faculty filter
        if (filters.faculty && filters.faculty !== "All") {
            filtered = filtered.filter(
                project => project.faculty === filters.faculty
            );
        }

        // Apply search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(
                project =>
                    project.title.toLowerCase().includes(searchLower) ||
                    project.projectCode?.toLowerCase().includes(searchLower) ||
                    project.leaderConsultantName?.toLowerCase().includes(searchLower)
            );
        }

        setFilteredProjects(filtered);
    };

    // Stats for each category
const stats = categories.map((cat) => ({
    ...getCategoryStats(costSummary, cat),
    title: cat,
}));
    const totalStats = getTotalStats(costSummary);
console.log("costSummary:", costSummary);
    // Sub-card stats
    const range200to500 = getRangeStats(costSummary, 200000, 500000);
    const rangeAbove500 = getRangeStats(costSummary, 500000);



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

            {/* Filters */}
            <ProjectFilters onFilter={handleFilter}/>

            {/* Loading, Error, and Table Display */}
            {loading ? (
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>{error}</p>
                </div>
            ) : (
                <ProjectTable
                    projects={filteredProjects.map(project => ({
                        id: project.id,
                        code: project.projectCode,
                        title: project.title,
                        faculty: project.faculty,
                        staff: project.leaderConsultantName,
                        status: project.status.toLowerCase(),
                        funder: project.projectUnder,
                        startDate: project.startDate,
                        endDate: project.endDate,
                        amount: parseFloat(project.grandTotal || 0)
                    }))}
                />
            )}
        </div>
    );
}

export default ProjectOverview;