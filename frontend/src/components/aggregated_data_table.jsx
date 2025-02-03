import React, { useState, useEffect } from "react";
import { fetchCompanyData } from "../services/api";

const AggregatedDataTable = () => {
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState({ company: 1, country: 1, type: 1 });
  const [pageSize] = useState(10); 
  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchCompanyData();
        console.log("Fetched data:", result);
        setData(result);
      } catch (error) {
        console.error("Failed to fetch company data:", error);
      }
    };

    getData();
  }, []);

  if (!data) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const { company_data, country_stats, type_distributions } = data;

  // Pagination Logic
  const paginate = (data, page) => data.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = {
    company: Math.ceil(company_data.length / pageSize),
    country: Math.ceil(country_stats.length / pageSize),
    type: Math.ceil(type_distributions.length / pageSize),
  };

  const handlePageChange = (table, action) => {
    setCurrentPage((prev) => ({
      ...prev,
      [table]: action === "prev" ? Math.max(prev[table] - 1, 1) : Math.min(prev[table] + 1, totalPages[table]),
    }));
  };

  return (
    <div className="container mt-5 w-auto">
      {/* Header Section */}
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold text-primary">Company Analytics</h1>
      </div>

      {/* Company Data Table */}
      <div className="card shadow-lg mb-5 w-100% mx-auto border border-primary">
        <div className="card-header bg-primary text-white text-center">
          <h4 className="mb-0">Company Data</h4>
        </div>
        <div className="card-body">
          <table className="table table-hover table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th className="w-25">Company ID</th>
                <th className="w-50">Company Name</th>
                <th>Credit Score</th>
                <th>Credit Limit</th>
                <th>Turnover</th>
                <th>Status</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {paginate(company_data, currentPage.company).map((company, index) => (
                <tr key={index}>
                  <td>{company.safeNumber}</td>
                  <td>{company.matched_name}</td>
                  <td>{company.credit_score_type}</td>
                  <td>{company.credit_limit_type}</td>
                  <td>{company.turnover_type}</td>
                  <td>
                    <span className={`badge ${company.status === "Active" ? "bg-success" : "bg-danger"}`}>
                      {company.status}
                    </span>
                  </td>
                  <td>{company.country_code}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button className="btn btn-secondary" onClick={() => handlePageChange("company", "prev")} disabled={currentPage.company === 1}>
              Previous
            </button>
            <span className="fw-bold">
              Page {currentPage.company} of {totalPages.company}
            </span>
            <button className="btn btn-secondary" onClick={() => handlePageChange("company", "next")} disabled={currentPage.company === totalPages.company}>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Country Statistics Table */}
      <div className="card shadow-lg mb-5 w-100 mx-auto border border-success">
        <div className="card-header bg-success text-white text-center">
          <h4 className="mb-0">Country Statistics</h4>
        </div>
        <div className="card-body">
          <table className="table table-hover table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th className="w-25">Country Code</th>
                <th className="w-25">Total Companies</th>
                <th className="w-25">Active Companies</th>
                <th className="w-25">Inactive Companies</th>
              </tr>
            </thead>
            <tbody>
              {paginate(country_stats, currentPage.country).map((stat, index) => (
                <tr key={index}>
                  <td>{stat.country_code}</td>
                  <td>{stat.total_companies}</td>
                  <td className="text-success fw-bold">{stat.active_companies}</td>
                  <td className="text-danger fw-bold">{stat.inactive_companies}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button className="btn btn-secondary" onClick={() => handlePageChange("country", "prev")} disabled={currentPage.country === 1}>
              Previous
            </button>
            <span className="fw-bold">
              Page {currentPage.country} of {totalPages.country}
            </span>
            <button className="btn btn-secondary" onClick={() => handlePageChange("country", "next")} disabled={currentPage.country === totalPages.country}>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Type Distribution Table */}
      <div className="card shadow-lg mb-5 w-100 mx-auto border border-warning">
        <div className="card-header bg-warning text-dark text-center">
          <h4 className="mb-0">Type Distribution</h4>
        </div>
        <div className="card-body">
          <table className="table table-hover table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th className="w-25">Credit Score Type</th>
                <th className="w-25">Credit Limit Type</th>
                <th className="w-25">Turnover Type</th>
                <th className="w-25">Count</th>
              </tr>
            </thead>
            <tbody>
              {paginate(type_distributions, currentPage.type).map((dist, index) => (
                <tr key={index}>
                  <td>{dist.credit_score_type}</td>
                  <td>{dist.credit_limit_type}</td>
                  <td>{dist.turnover_type}</td>
                  <td className="fw-bold">{dist.count}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button className="btn btn-secondary" onClick={() => handlePageChange("type", "prev")} disabled={currentPage.type === 1}>
              Previous
            </button>
            <span className="fw-bold">
              Page {currentPage.type} of {totalPages.type}
            </span>
            <button className="btn btn-secondary" onClick={() => handlePageChange("type", "next")} disabled={currentPage.type === totalPages.type}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AggregatedDataTable;
