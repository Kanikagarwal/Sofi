import React from 'react'
import { checkHeading, replaceHeadingStars } from '../helper';
import { useEffect,useState } from 'react';

const Message = ({ans,idx,totalResult,type}) => {
  const [heading,setHeading] = useState(false);
  const [answer,setAnswer] = useState(ans);
  useEffect(() => {
      // console.log(ans,checkHeading(ans));
      
      if(checkHeading(ans)){
        setHeading(true)
        setAnswer(replaceHeadingStars(ans))
      }
      
    }, [])
  return (
    <div> 
    {
      (totalResult>1 && idx==0)?<span className='text-sm sm:text-lg block font-bold text-white'>{answer}</span>:heading ? <span className='text-sm sm:text-lg block font-bold text-white'>{answer}</span>:<span className={` ${type=='a'?'rp':''}`}>{answer}</span>
    }
      
    </div>
  )
}

export default Message
