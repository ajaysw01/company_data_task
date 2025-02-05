import { useEffect, useState } from "react";
import "./CompanyData.css";

const CompanyData = () => {
  const [companyData, setCompanyData] = useState([]);
  const [countryStats, setCountryStats] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8000/process_csv_v2");
      const data = await response.json();
      if (response.ok) {
        setCompanyData(data.data.company_data);
        setCountryStats(data.data.country_stats);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  return (
    <div className="grid-container">
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
            {companyData.map((company, index) => (
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
            ))}
          </tbody>
        </table>
      </div>

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
            {countryStats.map((stat, index) => (
              <tr key={index}>
                <td>{stat.country_code}</td>
                <td>{stat["Total Companies"]}</td>
                <td className="active-status">{stat["Active Companies"]}</td>
                <td className="inactive-status">{stat["Inactive Companies"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyData;
