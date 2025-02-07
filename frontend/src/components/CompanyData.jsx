import { useEffect, useState } from "react";
import api from "../services/AxiosService";

const CompanyData = () => {
  const [companyData, setCompanyData] = useState([]);
  const [countryStats, setCountryStats] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get("/process_csv_v2");
      setCompanyData(response.data.data.company_data);
      setCountryStats(response.data.data.country_stats);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  return (
    <div>
      <h2>Company Data</h2>
      <table border="1">
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
              <td>{company.status}</td>
              <td>{company.country_code}</td>
              <td>{company.sector}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Country Statistics</h2>
      <table border="1">
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
              <td>{stat["Active Companies"]}</td>
              <td>{stat["Inactive Companies"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyData;
