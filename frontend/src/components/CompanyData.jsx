import { useEffect, useState } from "react";
import api from "../services/AxiosService";

const CompanyData = () => {
  const [companyData, setCompanyData] = useState([]);
  const [countryStats, setCountryStats] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 20;
  const totalPages = Math.ceil(companyData.length / itemsPerPage);

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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = companyData.slice(startIndex, startIndex + itemsPerPage);

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
          {currentItems.map((company, index) => (
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

      <nav aria-label="Page navigation">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>

          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>

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
