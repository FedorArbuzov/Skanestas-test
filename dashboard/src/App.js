import React, {useState, useEffect} from 'react';
import Graph from './components/Graph';
import Tickers from './components/Tickers';

import './App.css';

export function App() {
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const [currentPrices, setCurrentPrices] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState(0)
  const graphData = {
    labels,
    datasets: [
      {
        label: `ticker_${selectedTicker}`,
        data: data,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const getAllData = async (ticker) => {
    console.log(ticker)
    const response = await fetch(`http://localhost:5000/?ticker=${ticker}`)
    const responseData = await response.json()
    console.log(responseData)
    const localLabels = []
    const localData = []
    for(let i = 0; i < responseData.length; i++){
      localLabels.push(responseData[i][2])
      localData.push(responseData[i][1])
    }
    setLabels(localLabels)
    setData(localData)
    setSelectedTicker(ticker)
  }

  useEffect(() => {
    const fetchData = async () => {
      await getAllData(selectedTicker)
    }
    fetchData().catch(console.error)
    const ws = new WebSocket(
      "ws://localhost:5679"
    );

    ws.onopen = () => {
      console.log("Connection Established!");
    };
    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      setCurrentPrices(response);
    };
    ws.onclose = () => {
      console.log("Connection Closed!");
    };

    ws.onerror = () => {
      console.log("WS Error");
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
      const currentPrice = currentPrices[selectedTicker];
      if (currentPrice){
        setLabels(labels => [...labels, currentPrice[2]])
        setData(data => [...data, currentPrice[1]])
      }
  }, [currentPrices])

  return (
    <>
      <Graph data={graphData}/>
      <Tickers data={currentPrices} setMainTicker={getAllData} />
    </>
  )
  ;
}


export default App;
