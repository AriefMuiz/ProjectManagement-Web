import React from 'react';

// src/App.jsx
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

//layouts
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";


//pages - public
// import SurveyForm from "./modules/public/pages/form.jsx";
import Home from "./modules/public/pages/home.jsx";
import Login from "./modules/public/pages/login.jsx";
// import Register from "./modules/public/pages/register.jsx";


//pages - admin
import Dashboard from "./modules/admin/pages/Dashboard.jsx";
import ProjectOverview from "./modules/admin/pages/ProjectOverview.jsx";
import ProjectManagement from "./modules/admin/pages/Management/ProjectManagement.jsx";
import ProjectList from "./modules/admin/pages/Management/ProjectList.jsx";
import ProjectCreate from "./modules/admin/pages/Management/ProjectCreate.jsx";
import ProjectDetail from "./modules/admin/pages/Management/ProjectDetail.jsx";
import ProjectEdit from "./modules/admin/pages/Management/ProjectEdit.jsx";

import MemoManagement from "./modules/admin/pages/Memo/MemoManagement.jsx";
import MemoCreate from "./modules/admin/pages/Memo/MemoCreate.jsx";
import MemoList from "./modules/admin/pages/Memo/MemoList.jsx";
import ProjectMemoList from "./modules/admin/pages/Memo/ProjectMemoList.jsx";
import ProjectMemoDetail from "./modules/admin/pages/Memo/ProjectMemoDetail.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
// import SurveyLayout from "./modules/admin/pages/Survey/Survey.jsx";
// import SurveyList from "./modules/admin/pages/Survey/List.jsx";
// import SurveyDetail from "./modules/admin/pages/Survey/Detail.jsx";
// import SurveyCreate from "./modules/admin/pages/Survey/Create.jsx";
// import PreviewSurveyForm from "./modules/public/survey/PreviewSurveyForm.jsx";

// import History from "./modules/public/pages/History.jsx";
// import Radar from "./modules/public/pages/Radar.jsx";


function App() {
    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route element={<PublicLayout/>}>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    {/*<Route path="/register" element={<Register/>}/>*/}
                    {/* Default route */}
                    <Route path="/" element={<Home/>}/>
                    {/* Fallback route for unmatched paths */}
                    <Route path="*" element={<Home/>}/>
                </Route>
                {/* Admin routes */}

                <Route   element={
                    <PrivateRoute>
                        <AdminLayout />
                    </PrivateRoute>
                }>

                    <Route path="/admin/dashboard" element={<Dashboard/>}/>
                    <Route path="/admin/overview" element={<ProjectOverview/>}/>

                    <Route path="/admin/project" element={<ProjectManagement/>}>
                        <Route index element={<ProjectList />} />
                        <Route path="create" element={<ProjectCreate />} />
                        <Route path="detail/:id" element={<ProjectDetail />} />
                        <Route path="edit/:id" element={<ProjectEdit />} />
                    </Route>

                    <Route path="/admin/memo" element={<MemoManagement/>}>
                        <Route index element={<MemoList />} />
                        <Route path="list/:projectId" element={<ProjectMemoList />} />
                        <Route path="detail/:projectId/:memoId" element={<ProjectMemoDetail />} />
                        <Route path=":projectId/create" element={<MemoCreate />} />
                        {/*<Route path="detail/:id" element={<MemoDetail />} />*/}
                        {/*<Route path="edit/:id" element={<MemoEdit />} />*/}
                    </Route>

                </Route>
            </Routes>
        </Router>
    );
}

export default App;
