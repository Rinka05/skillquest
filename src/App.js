import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import "./App.css";

const App = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "/dump.csv"
      );
      const csvText = await response.text();
      const rows = csvText.split("\n").map((row) => row.split(","));
      const headers = rows[0].map((header) => header.replace(/"/g, ""));
      const data = rows.slice(1).map((row) =>
        Object.fromEntries(
          row.map((value, index) => [
            headers[index],
            value.replace(/"/g, ""),
          ])
        )
      );
          console.log(data);
      setCompanies(data.filter((company) => company.index_name)); // Filter valid rows
    };

    fetchData();
  }, []);

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
  };

  const getChartOptions = () => {
    if (!selectedCompany) return {};

    return {
      title: {
        text: `Index Values for ${selectedCompany.index_name}`,
        left: "center",
      },
      tooltip: {},
      xAxis: {
        type: "category",
        data: ["Open", "High", "Low", "Close"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [
            parseFloat(selectedCompany.open_index_value),
            parseFloat(selectedCompany.high_index_value),
            parseFloat(selectedCompany.low_index_value),
            parseFloat(selectedCompany.closing_index_value),
          ],
          type: "bar",
          itemStyle: {
            color: (params) => {
              const colors = ["#f39c12", "#3498db", "#e74c3c", "#2ecc71"];
              return colors[params.dataIndex];
            },
          },
          
        },
      ],

    };

  };

  return (
    <div className="container">
      <div className="sidebar">
        <h3>Companies</h3>
        <ul>
          {companies.map((company) => (
            <li
              key={company.index_name}
              onClick={() => handleCompanyClick(company)}
            >
              {company.index_name}
            </li>
          ))}
        </ul>
      </div>
      <div className="content">
        {selectedCompany ? (
           <>
           <ReactECharts
             option={getChartOptions()}
             style={{ width: "100%", height: "400px" }}
           />
           <div className="company-details">
             <h3>other Details about {selectedCompany.index_name}</h3>
             <p><strong>Vloume:</strong> {selectedCompany.volume}</p>
             <p><strong>Market Cap:</strong> {selectedCompany.turnover_rs_cr}</p>
             <p><strong>PE Ratio:</strong> {selectedCompany.pe_ratio}</p>
             <p><strong>PP Ratio:</strong> {selectedCompany.pb_ratio}</p>
             <p><strong>Dividend Yield:</strong> {selectedCompany.div_yield}</p>
           </div>
         </>
        ) : (
          <h3>Select a company to view the data</h3>
        )}
      </div>
    </div>
  );
};

export default App;
