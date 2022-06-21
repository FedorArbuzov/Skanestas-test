export default function Tickers(props) {
    return (
        <div className="tickers">
            {props.data.map((item) => (
                <button key={item[0]} onClick={() => props.setMainTicker(item[0])}>{item[0]} {item[1]}</button>
            ))}
        </div>
    );
}