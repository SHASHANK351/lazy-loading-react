import "./App.css";
import {
  useState,
  useRef,
  useCallback,
  useDeferredValue,
  useEffect,
} from "react";
import useProductSearch from "./useProductsSearch";

function App() {
  const [query, setQuery] = useState("");
  const queryDeferred = useDeferredValue(query);
  const [skip, setSkip] = useState(0);
  const inputRef = useRef(null);
  const observer = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const { products, moreProducts, loading, error } = useProductSearch(
    queryDeferred,
    skip
  );

  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && moreProducts) {
          setSkip((prevSkip) => prevSkip + 10);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, moreProducts]
  );

  function getProducts(e) {
    setQuery(e.target.value);
    setSkip(0);
  }
  return (
    <>
      <input
        ref={inputRef}
        type="text"
        placeholder="Please search here..."
        value={query}
        onChange={getProducts}
      ></input>
      {query ? (
        <div className="optionsPanel">
          <div className="options">
            {products.map((product, index) => {
              if (products.length === index + 1) {
                return (
                  <div ref={lastProductRef} key={index}>
                    {index + 1}. {product}
                  </div>
                );
              } else {
                return (
                  <div key={index}>
                    {index + 1}. {product}
                  </div>
                );
              }
            })}
          </div>
          <div className="loading">{loading && "Loading..."}</div>
          <div className="error">{error && "Error"}</div>
          <div>{!loading && !products.length ? "No data" : ""}</div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default App;
