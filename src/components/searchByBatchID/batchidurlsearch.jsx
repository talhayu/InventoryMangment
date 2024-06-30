import React, { useEffect, useState } from "react";
import axios from "axios";
import "./batchidsearch.css";
import { useParams } from "react-router-dom";

function Batchidurlsearch() {
    const {id} = useParams();
//   const [id, setId] = useState("");
  const [result, setResult] = useState({});
  const [loading, setLoding] = useState(false);
  const [error, setError] = useState(false);
  useEffect(()=>{
  const search = async () => {
    try {
      setLoding(false);
      setError(false);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/searchbybatchID/${id}`
      );
      console.log(response.data);
      setResult(response.data.msg.data);
      setLoding(true);
    } catch (err) {
      setError(true);
      console.log("Error Fetching Data: ", err);
    }
  };
  search();
  },[id]);
  return (
    <>
      {loading && (
        <table className="tableclass">
          <thead>
            <tr>
              <th className="tabledata">Product ID</th>
              <th className="tabledata">Product Name</th>
              <th className="tabledata">Quantity</th>
              <th className="tabledata">Date of Production</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="tabledata">{result.productId._id}</td>
              <td className="tabledata">{result.productId.productName}</td>
              <td className="tabledata">{result.remainingQuantity}</td>
              <td className="tabledata">
                {new Date(result.dateOfProduction).toLocaleDateString(
                  undefined,
                  { day: "numeric", month: "long", year: "numeric" }
                )}
              </td>
            </tr>
          </tbody>
        </table>
      )}
      {error && <h1 style={{ textAlign: "center" }}>No Product Found</h1>}
    </>
  );
}

export default Batchidurlsearch;
