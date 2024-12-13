import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import './viewPage.css';
import ContactForm from './Contact';

const ViewPage = () => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const { url } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await axios.get(`https://api.srtutorsbureau.com/api/v1/seo/get-page/${url}`);
        setPage(response.data);
      } catch (error) {
        console.error('Error fetching page:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPage();
  }, [url]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">Page Not Found</h4>
          <p>The requested page could not be found.</p>
          <hr />
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/seo')}
          >
            Return to Pages
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{page.MetaTitle || 'Default Title'}</title>
        <meta name="description" content={page.MetaDescription || 'Default Description'} />
        <meta name="keywords" content={page.MetaKeywords.join(', ') || 'Default, Keywords'} />
      </Helmet>

      <div className="page-wrapper">
        <div className="container-fluid px-5">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">Home</a>
              </li>
             
              <li className="breadcrumb-item active" aria-current="page">
                {page.PageTitle}
              </li>
            </ol>
          </nav>

          <div className="content-wrapper">
            <h1 className="page-title">{page.PageTitle}</h1>

            <div className="row">
              <div className="col-lg-3">
                <div className="content-section">
                  <div className="meta-info">
                    <div className="meta-value">{page.MetaDescription}</div>
                  </div>

                  <h2 className="section-title">Keywords</h2>
                  <div className="keywords-container flex flex-wrap gap-2">
                    {page.MetaKeywords.map((keyword, index) => (
                      keyword && (
                        <span
                          key={index}
                          className="keyword-tag inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
                        >
                          #{keyword}
                        </span>
                      )
                    ))}
                  </div>

                  <ContactForm />
                </div>
              </div>

              <div className="col-lg-9">
                <div className="content-section">
                  <div
                    className="page-content"
                    dangerouslySetInnerHTML={{ __html: page.PageContent }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewPage;