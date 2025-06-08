import { useState, useEffect } from 'react';

function App() {
  const [count, setCount] = useState(0);

  const click = () => {
    setCount(prevCount => prevCount + 1);
  }

  // Runs when the page is loaded
  /*
  useEffect(() => {
    alert("Page is loaded");
  }, []);
  */

  // Runs when count is modified
  /*
  useEffect(() => {
    alert("count has changed");
  }, [count]);
  */
 
  // Runs everytime App is rendered
  useEffect(() => {
    alert("ok");
  });

  return (
    <>
      <button onClick={click}>J'aime !</button>
      <p>{count}</p>
    </>
    
  );
}

export default App;
