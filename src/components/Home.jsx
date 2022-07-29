import React, { useEffect, useState, useLayoutEffect } from "react";
import Header from './Header';
import alert from "../assets/alert.png";
import button from "../assets/button.png";

const Home = () => {
  const [divisas, setDivisas] = useState([]);
  const [result, setResult] = useState(0);
  const [error, setError] = useState("");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [currOptions, setCurrOptions] = useState([]);
  const [currencies, setCurrencies] = useState({ from: "", to: "" });
  const [amount, setAmount] = useState(1.0);
  const [conversionTo, setConversionTo] = useState("");
  const [lastUpdate, setLastUpdate] = useState("");
  const [time, setTime] = useState("");
  const [refreshDescription, setRefreshDescription] = useState("");
  const apiRates = "https://api.vatcomply.com/rates";
  const apiCurrencies = "https://api.vatcomply.com/currencies";

  useEffect(() => {
    fetch(`${apiRates}?base=${from}&symbols=${to}`)
      .then((response) => response.json())
      .then((data) => {
        setDivisas(data.rates);
        setFrom(from);
        setTo(to);
      });
  }, [from, to]);

  useEffect(() => {
    fetch(apiRates)
      .then((response) => response.json())
      .then((data) => {
        setCurrOptions([...Object.keys(data.rates)]);
        setLastUpdate(data.date);
      });
  }, [from, to]);

  useLayoutEffect(() => {
    fetch(apiCurrencies)
      .then((response) => response.json())
      .then((data) => {
        setCurrencies({ from: data[from].name, to: data[to].name });
        setRefreshDescription("false");
      });
  }, [from, to, refreshDescription]);

  useEffect(() => {
    fetch(`${apiRates}?base=${to}`)
      .then((response) => response.json())
      .then((data) => {
        setConversionTo(data.rates[from]);
      });
  }, [from, to]);

  const handleChange = (e) => {
    if (e.target.value >= 0) {
      setError("");
      e.preventDefault();
      setAmount(e.target.value);
      setResult(e.target.value * divisas[to]);
      let now = new Date();
      const withPmAm = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      let time = withPmAm;
      setTime(time);
    } else {
      setError("Negative values are not allowed");
    }
  };

  const handleChange2 = (event) => {
    setFrom(event.target.value);
  };

  const handleChange3 = (event) => {
    setTo(event.target.value);
  };

  const handleClick = (event) => {
    event ? setRefreshDescription("true") : console.log("no response");
    setFrom(to);
    setTo(from);
  };

  return (
    <>
      <Header 
          from={from} 
          to={to} 
          currTo={currencies.to} 
          currFrom = {currencies.from} 
      />
      <div className="card">
        <div className="card-container">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            label="amount"
            id="valueToConvert"
            onChange={handleChange}
            placeholder="1.00"
            name="input"
          ></input>

          <label htmlFor="from">From</label>
          <div className="container-curr-button">
            <select
              className="currencyOptions"
              value={from}
              onChange={handleChange2}
            >
              {currOptions.map((optionCurrFrom) => (
                <option key={optionCurrFrom} value={optionCurrFrom}>
                  {optionCurrFrom} - {currencies.from}
                </option>
              ))}
            </select>
            <button className="btn" onClick={handleClick}>
              <img src={button} alt="button" />
            </button>
          </div>

          <label htmlFor="to">To</label>
          <select
            className="currencyOptions"
            value={to}
            onChange={handleChange3}
          >
            {currOptions.map((optionCurrTo) => (
              <option key={optionCurrTo} value={optionCurrTo}>
                {optionCurrTo} - {currencies.to}
              </option>
            ))}
          </select>

          <h3 className="result">
            <p>
              {amount} {currencies.from} =
            </p>
            {result} {currencies.to}
            <div className="conversion">
              <p>
                {" "}
                1 {to} = {divisas[to]} {from}
              </p>
              <p>
                {" "}
                1 {from} = {conversionTo} {to}
              </p>
            </div>
            <div className="advice">
              <img src={alert} alt="warning Alert" className="icon" />
              <p>We use the market rate. This is for informational purposes only.</p>
            </div>
          </h3>
          <p className="errorMessage">{error}</p>
        </div>
        <div className="updates">
          Conversion from {currencies.from} to {currencies.to} - Last updated:{" "}
          {lastUpdate}, {time}
        </div>
      </div>
    </>
  );
};

export default Home;
