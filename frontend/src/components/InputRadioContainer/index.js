import React, { useEffect, useState } from 'react';
import './index.css';

import InputRadio from "../InputRadio/index.js";


function InputRadioContainer({ data, getParamSettings }) {

    return (
        <div className="params" style={{margin: "10px 0"}} > 
                
                {data.map((obj, index) => {
                    let result = [<InputRadio name="param_batch"
                                              htmlFor={obj.id}
                                              key={index}
                                              settings={obj}
                                              text={`Куб: ${obj.multipacks} мультипаков, мультипак: ${obj.packs} пачек`}
                                              callback={(s) => getParamSettings(s)} />]

                    if (index !== (data.length - 1)) {
                        result.push(<hr />)
                    }

                    return result;
                })}

            </div>
    );
}

export default InputRadioContainer;