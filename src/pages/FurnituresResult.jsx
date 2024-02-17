import "../style/furniture.css";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import heroSearch from "../asset/search-furniture.png";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import Footer from "../components/Footer";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

function FurnituresResult() {
  const { search } = useParams();

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataResult = async () => {
      try {
        const furnitures = collection(db, "furnitures");
        const querySnap = await getDocs(furnitures);

        let data = [];

        querySnap.forEach((doc) => {
          data.push(doc.data());
        });

        const lowercaseSearch = search.toLowerCase();
        const resultData = data.filter((item) => {
          const lowercaseName = item.name.toLowerCase();
          return lowercaseName.includes(lowercaseSearch);
        });

        setResults(resultData);
      } catch (error) {
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchDataResult();
  }, [search]);

  return (
    <>
      <Navbar />
      <div className="position-relative">
        <img
          src={heroSearch}
          alt="Hero"
          className="hero-image img-fluid"
          style={{ minHeight: "300px" }}
        />

        <div className="container text-center position-absolute container-search">
          <h1 className="text-white mb-4 hero-text">Find your furniture</h1>
          <p className="text-white mb-4 hero-text-second">
            Search your best quality furniture...
          </p>

          <SearchBar />
        </div>
      </div>

      <div className="container mt-5">
        {!loading && (
          <p className="fw-bold">
            Found {results.length || "0"} furniture for “{search}”
          </p>
        )}

        <hr className="border mb-2" />
        <div className="my-4">
          {loading ? (
            <Spinner />
          ) : (
            <>
              {results.length === 0 ? (
                <h5 className="text-center my-5">
                  Furniture not found, enter another keyword!
                </h5>
              ) : (
                <div className="row g-3">
                  {results.map((res, index) => (
                    <div className="col-sm-12 col-md-4 col-lg-3" key={index}>
                      <div className="mb-3">
                        <Card
                          imageSource={res.imageURL[0]}
                          title={res.name}
                          type={res.type}
                          rating={res.rating}
                          description={res.description}
                          price={res.price}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default FurnituresResult;
