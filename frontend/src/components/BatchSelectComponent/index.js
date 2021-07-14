import React, { useState, useEffect } from 'react';
import address from 'src/address';

function BatchSelectComponent() {
   
  const [items, setItems] = useState([]);

  const [items, setItems] = useState([]);

  useEffect(() => {
  async function getBatches() {
    const response = await fetch(address + "/api/v1_0/batches");
    console.log(response)
    const body = await response.json();
    console.log(body)
    const numbers = body.map(item =>{
      return{
        label:item.number.batch_number,
        value:item.number.batch_number
      }
    })  
    const numberslice = numbers.slice(-5)
   setItems(numberslice) 
  }
  getBatches();
}, []);

return (
  <select>
      {items.map(({ label, value }) => (
  <option key={label} value={value} onChange={(event)=> setItems(event.target.value)}>
       {label}
  </option>
   ))}
  </select>  
);
}

  export default BatchSelectComponent

