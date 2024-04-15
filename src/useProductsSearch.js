import { useEffect, useState } from "react";
import axios from "axios";

export default function useProductSearch(query, skip) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [products, setProducts] = useState([]);
  const [moreProducts, setMoreProducts] = useState(false);

  useEffect(() => {
    setProducts([]);
  }, [query]);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      setError(false);
      setProducts([]);
      return;
    }
    setLoading(true);
    setError(false);
    let cancelToken;
    axios({
      method: "GET",
      url: "https://dummyjson.com/products/search",
      params: { q: query, skip: skip, limit: 10, select: "title" },
      cancelToken: new axios.CancelToken((c) => (cancelToken = c)),
    })
      .then((res) => {
        setProducts((prevProducts) => {
          return [
            ...prevProducts,
            ...res.data.products.map((product) => product.title),
          ];
        });
        setMoreProducts(skip + res.data.products.length < res.data.total);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancelToken();
  }, [query, skip]);

  return { loading, error, products, moreProducts };
}
