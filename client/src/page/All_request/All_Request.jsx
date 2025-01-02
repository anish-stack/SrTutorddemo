import React, { useEffect, useState } from "react";
import axios from "axios";
import "./All_Request.css";
import { Search, Filter, MapPin, Calendar, Book, Clock } from "lucide-react";
import HomeLoader from "../../Components/HomeLoader";

const All_Request = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    subject: "",
    className: "",
    minBudget: "",
    maxBudget: "",
  });
  const [filteredData, setFilteredData] = useState([]);
  const [classList, setClassList] = useState([]);

  const itemsPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.srtutorsbureau.com/api/v1/student/AllData"
        );
        const responseData = response.data.data;

        // Extract unique class names
        const uniqueClasses = [
          ...new Set(responseData.map((item) => item.className)),
        ].sort();
        setClassList(uniqueClasses);

        setData(responseData);
        setFilteredData(responseData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = [...data];

    if (filters.subject) {
      result = result.filter((item) =>
        item.subjects.some((sub) =>
          sub.toLowerCase().includes(filters.subject.toLowerCase())
        )
      );
    }

    if (filters.className) {
      result = result.filter(
        (item) => item.className.toLowerCase() === filters.className.toLowerCase()
      );
    }

    if (filters.maxBudget) {
      result = result.filter(
        (item) => item.maxBudget <= parseInt(filters.maxBudget)
      );
    }

    setFilteredData(result);
    setCurrentPage(1);
  }, [filters, data]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      subject: "",
      className: "",
      minBudget: "",
      maxBudget: "",
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (loading) return <HomeLoader />;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="container py-4">
      {/* Filter Section */}
      <div className="filter-section mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Filter by subject"
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              name="className"
              value={filters.className}
              onChange={handleFilterChange}
            >
              <option value="">Select Class</option>
              {classList.map((className, idx) => (
                <option key={idx} value={className}>
                  Class {className}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Max Budget"
              name="maxBudget"
              value={filters.maxBudget}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-muted mb-4">
        Showing {filteredData.length} results
      </p>

      {/* Request Cards */}
      <div className="row">
        {currentItems.map((item, index) => (
          <div key={index} className="col-md-6 shadow col-lg-4 mb-4">
            <a href={`/Student-Info?id=${item._id}`} className="card request-card h-100">
              <div className="card-body">
                <h5 className="card-title mb-3">
                  {item.studentInfo.studentName}
                </h5>
                <div className="mb-2">
                  {item.subjects.map((subject, idx) => (
                    <span key={idx} className="subjects-badge me-1">
                      {subject}
                    </span>
                  ))}
                </div>
                <p className="mb-2">
                  <Book className="me-2" size={16} />
                  Class {item.className}
                </p>
                <p className="mb-2">
                  <Clock className="me-2" size={16} />
                  {item.numberOfSessions}
                </p>
                <p className="mb-2">
                  <MapPin className="me-2" size={16} />
                  <span className="location-text">
                    {item?.AddressDetails?.area}, {item?.AddressDetails?.city}
                  </span>
                </p>
                <p className="budget-range mb-3">₹{item.maxBudget}</p>
                <button className="btn py-3 btn-contact w-100">
                  Contact Now
                </button>
              </div>
            </a>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="pagination-container">
          <ul className="pagination justify-content-center">
            <li
              className={`page-item ${
                currentPage === 1 ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(1)}
              >
                First
              </button>
            </li>
            <li
              className={`page-item ${
                currentPage === 1 ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
              >
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, idx) => (
              <li
                key={idx}
                className={`page-item ${
                  currentPage === idx + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, totalPages)
                  )
                }
              >
                Next
              </button>
            </li>
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(totalPages)}
              >
                Last
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default All_Request;
