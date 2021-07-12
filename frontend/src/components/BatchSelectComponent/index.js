import React, { useState, useEffect } from 'react';

function BatchSelectComponent() {
   
  const [items, setItems] = useState([]);

  useEffect(() => {
  async function getBatches() {
    const response = await fetch( address +"/api/v1_0/batches");
    //console.log(response)
    const body = await response.json();
    //console.log(body)
    const numbers = body.map(item =>{
      return{
        label:item.number.batch_number,
        value:item.number.batch_number
      }
    })    
   setItems(numbers) 
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

