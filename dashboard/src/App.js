import React, {useState, useEffect} from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const labels = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => {return Math.floor(Math.random() * 100)}),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};

export function App() {
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  let [idx, setIdx] = useState(100);
  const graphData = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: data,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  useEffect(() => {
    const localLabels = [];
    const localData = [];
    for (let i = 0; i < 10; i++){
      localLabels.push(i)
      localData.push(Math.floor(Math.random() * 100))
    }
    setLabels(localLabels)
    setData(localData)
    const ws = new WebSocket(
      "ws://localhost:5679"
    );

    ws.onopen = () => {
      console.log("Connection Established!");
    };
    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log(response);
      idx = idx + 1
      setLabels(labels => [...labels, idx])
      setData(data => [...data, response])
      //ws.close();
    };
    ws.onclose = () => {
      console.log("Connection Closed!");
      //initWebsocket();
    };

    ws.onerror = () => {
      console.log("WS Error");
    };

    return () => {
      ws.close();
    };
  }, []);
  return <Line options={options} data={graphData} />;
}


export default App;
