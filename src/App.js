import React, { useState, useRef, useEffect } from 'react';
import './App.css'; // Import the CSS for crazy design

function App() {
  const [monthlyInvestment, setMonthlyInvestment] = useState('');
  const [annualReturn, setAnnualReturn] = useState('');
  const [years, setYears] = useState('');
  const [expenseRatio, setExpenseRatio] = useState('');
  const [inflationRate, setInflationRate] = useState('');
  const [data, setData] = useState(null);
  const [showResult, setShowResult] = useState(false); // State to show the result page

  const resultRef = useRef(null); // Ref for the result section

  const formatNumber = (num) => {
    return num.toLocaleString('en-IN');
  };

  const calculateSIP = () => {
    let months = years * 12;
    let monthlyRateWithoutER = annualReturn / 12 / 100; // Rate without expense ratio
    let netAnnualReturn = annualReturn - expenseRatio; // Adjusting return with expense ratio
    let monthlyRateWithER = netAnnualReturn / 12 / 100; // Rate with expense ratio
    let totalInvestment = monthlyInvestment * months;

    let futureValueWithoutER = 0;
    let futureValueWithER = 0;

    // Calculating future value without expense ratio
    for (let i = 0; i < months; i++) {
      futureValueWithoutER += monthlyInvestment * Math.pow(1 + monthlyRateWithoutER, months - i);
    }

    // Calculating future value with expense ratio
    for (let i = 0; i < months; i++) {
      futureValueWithER += monthlyInvestment * Math.pow(1 + monthlyRateWithER, months - i);
    }

    // Adjusting future value for inflation
    let inflationFactor = Math.pow(1 + inflationRate / 100, years);
    let adjustedFutureValueWithoutER = futureValueWithoutER / inflationFactor;
    let adjustedFutureValueWithER = futureValueWithER / inflationFactor;

    setData({
      totalInvestment,
      futureValueWithoutER,
      futureValueWithER,
      adjustedFutureValueWithoutER,
      adjustedFutureValueWithER,
    });

    setShowResult(true); // Show the result section
  };

  // Scroll to the result section when the result is shown
  useEffect(() => {
    if (showResult && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showResult]);

  // Function to go back to the form
  const handleGoBack = () => {
    setShowResult(false);
    setMonthlyInvestment('');
    setAnnualReturn('');
    setYears('');
    setExpenseRatio('');
    setInflationRate('');
  };

  return (
    <div className="app-container">
      <h1 className="title">SIP Calculator (With Expense Ratio and Inflation)</h1>
      {!showResult && (
        <div className="form-container">
          <label>Monthly Investment Amount</label>
          <input
            type="number"
            placeholder="Monthly Investment"
            value={monthlyInvestment}
            onChange={(e) => setMonthlyInvestment(e.target.value)}
          />
          <label>Annual Return (%)</label>
          <input
            type="number"
            placeholder="Annual Return (%)"
            value={annualReturn}
            onChange={(e) => setAnnualReturn(e.target.value)}
          />
          <label>Duration (Years)</label>
          <input
            type="number"
            placeholder="Investment Duration (Years)"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
          <label>Expense Ratio (%)</label>
          <input
            type="number"
            placeholder="Expense Ratio (%)"
            value={expenseRatio}
            onChange={(e) => setExpenseRatio(e.target.value)}
          />
          <label>Inflation Rate (%)</label>
          <input
            type="number"
            placeholder="Inflation Rate (%)"
            value={inflationRate}
            onChange={(e) => setInflationRate(e.target.value)}
          />
          <button onClick={calculateSIP}>Calculate</button>
        </div>
      )}

      {showResult && (
        <div className="result-container" ref={resultRef}>
          <h2>Results</h2>
          <p>Total Investment: ₹{formatNumber(data.totalInvestment)}</p>

          {/* Results without Expense Ratio */}
          <h3>Without Expense Ratio:</h3>
          <p>Projected Returns: ₹{formatNumber(data.futureValueWithoutER - data.totalInvestment)}</p>
          <p>Total Corpus: ₹{formatNumber(data.futureValueWithoutER)}</p>
          <p>
            Inflation-Adjusted Total Corpus: ₹{formatNumber(data.adjustedFutureValueWithoutER)}
          </p>

          {/* Results with Expense Ratio */}
          <h3>With Expense Ratio:</h3>
          <p>Projected Returns: ₹{formatNumber(data.futureValueWithER - data.totalInvestment)}</p>
          <p>Total Corpus: ₹{formatNumber(data.futureValueWithER)}</p>
          <p>
            Inflation-Adjusted Total Corpus: ₹{formatNumber(data.adjustedFutureValueWithER)}
          </p>

          {/* Go Back Button */}
          <button onClick={handleGoBack}>Go Back</button>
        </div>
      )}
    </div>
  );
}

export default App;
