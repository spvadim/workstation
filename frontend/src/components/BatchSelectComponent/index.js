import React, { useState, useEffect } from 'react';
import address from 'src/address';

function BatchSelectComponent() {
   
  const [items, setItems] = useState([]);

  useEffect(() => {
  async function getBatches() {
    const response = await fetch( address +"/api/v1_0/batches");
    const body = await response.json();
    const numbers = body.map(item =>{
      return{
        label:item.number.batch_number,
        value:item.number.batch_number
      }
    }) 
    setItems(numbers)    
    const numberslice = numbers.slice(-2)
      
  }  
  getBatches();
}, []);
return (
  <select>
      {items.map(({ label, value }) => (
    <option key={value} value={value}>
       {label}
    </option>
   ))}
  </select>  
);
}
  export default BatchSelectComponent

