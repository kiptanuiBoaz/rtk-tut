import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { incrementByAmount, reset, increment, decrement } from './counterSlice';
import { useState } from 'react';



const Counter = () => {
  const count = useSelector((state) => state.counter.count);
  const dispatch = useDispatch();
  const [incrementAmount, setIncrementAmount] = useState(0);
  //check if it's a number and set to zero if not
  const addValue = Number(incrementAmount) || 0;

  const resetAll = () => {
    setIncrementAmount(0);
    dispatch(reset());
  }
  return (
    <section>
      <p>{count}</p>
      <div>
        <button onClick={() => dispatch(increment())}>+</button>
        <button onClick={() => dispatch(decrement())}>-</button>

        <input type='text' value={incrementAmount} onChange={(e) => setIncrementAmount(e.target.value)}></input>

        <div>
          <button onClick={()=>dispatch(incrementByAmount(addValue))}>Add Amount</button>
          <button onClick={resetAll}>Reset All</button>
        </div>
        
      </div>
    </section>
  )
}

export default Counter