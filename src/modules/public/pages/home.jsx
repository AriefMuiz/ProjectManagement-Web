import React from 'react';

import bcgImage from '../../../lib/img/png/bcg_image.png';

// Adjust the path as necessary


const Home = () => (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Header */}
      <header
          className="bg-primary text-base-100 py-8 shadow bg-cover bg-center"
          style={{backgroundImage: `url(${bcgImage})`}}
      >
        <div className="bg-black/50 py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              UTeM Holding Project Management Portal
            </h1>
            <p className="text-lg opacity-80">
              Internal platform for managing and tracking all UTeM Holding projects
            </p>
          </div>
        </div>
      </header>


      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="max-w-4xl w-full px-4">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-primary">Welcome, UTeM Holding Team</h2>
            <p className="text-base-content/80 mb-2">
              Access and oversee all ongoing and completed projects. Collaborate with colleagues, monitor progress, and
              generate reports to ensure our collective success.
            </p>
          </section>
          <section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card bg-base-100 shadow-md p-6 items-center">
                <div className="text-4xl text-primary mb-4">
                  <i className="fas fa-tasks"></i>
                </div>
                <h3 className="font-semibold mb-2">Project Overview</h3>
                <p className="text-base-content/70 text-center">
                  View all UTeM Holding projects, milestones, and deadlines in one place.
                </p>
              </div>
              <div className="card bg-base-100 shadow-md p-6 items-center">
                <div className="text-4xl text-primary mb-4">
                  <i className="fas fa-users"></i>
                </div>
                <h3 className="font-semibold mb-2">Team Workspace</h3>
                <p className="text-base-content/70 text-center">
                  Collaborate, assign tasks, and communicate with your project teams.
                </p>
              </div>
              <div className="card bg-base-100 shadow-md p-6 items-center">
                <div className="text-4xl text-primary mb-4">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3 className="font-semibold mb-2">Reports & Insights</h3>
                <p className="text-base-content/70 text-center">
                  Generate and review reports to track project performance and outcomes.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
);

export default Home;