import React, { useEffect, useState } from "react";
import "./CompanyData.css"; 

const CompanyData = () => {
  const [companyData, setCompanyData] = useState([]);
  const [countryStats, setCountryStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/process_csv_v2");
      const data = await response.json();

      if (response.ok) {
        setCompanyData(data.data.company_data);
        setCountryStats(data.data.country_stats);
      } else {
        throw new Error(data.detail || "Failed to fetch data");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="process-csv-container">
      <div className="header">
        <h1>Processed CSV Data</h1>
        <button className="refresh-button" onClick={fetchData} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {error && <p className="error-message">Error: {error}</p>}

      <div className="grid-container">
        {/* Company Data Table */}
        <div className="card">
          <div className="card-title">Company Data</div>
          <table className="table">
            <thead>
              <tr>
                <th>Safe Number</th>
                <th>Name</th>
                <th>Credit Score</th>
                <th>Credit Limit</th>
                <th>Turnover</th>
                <th>Status</th>
                <th>Country</th>
                <th>Sector</th>
              </tr>
            </thead>
            <tbody>
              {companyData.length > 0 ? (
                companyData.map((company, index) => (
                  <tr key={index}>
                    <td>{company.safeNumber}</td>
                    <td>{company.matched_name}</td>
                    <td>{company.credit_score_type}</td>
                    <td>{company.credit_limit_type}</td>
                    <td>{company.turnover_type}</td>
                    <td className={company.status === "Active" ? "active-status" : "inactive-status"}>
                      {company.status}
                    </td>
                    <td>{company.country_code}</td>
                    <td>{company.sector}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center">No company data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Country Statistics Table */}
        <div className="card">
          <div className="card-title">Country Statistics</div>
          <table className="table">
            <thead>
              <tr>
                <th>Country Code</th>
                <th>Total Companies</th>
                <th>Active Companies</th>
                <th>Inactive Companies</th>
              </tr>
            </thead>
            <tbody>
              {countryStats.length > 0 ? (
                countryStats.map((stat, index) => (
                  <tr key={index}>
                    <td>{stat.country_code}</td>
                    <td>{stat["Total Companies"]}</td>
                    <td className="active-status">{stat["Active Companies"] }</td>
                    <td className="inactive-status">{stat["Inactive Companies"]}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">No country statistics available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompanyData;
