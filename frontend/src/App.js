import axios from "axios";
import { useState } from "react";
import "./index.css";
import * as XLSX from "xlsx"

function App() {
  const [msg, setmsg] = useState("");
  const [status, setstaus] = useState(false);
  const[emailList,setemailList]=useState([])

  function handlemsg(event) {
    setmsg(event.target.value);
  }
 
  function handlefile(event)
  {
    const file=event.target.files[0]
   console.log(file);
   
   const reader=new FileReader()

   reader.onload=function(event)
   {
    const data=event.target.result
    
    const workbook=XLSX.read(data,{type:"binary"})
    console.log(workbook);

    const sheetname=workbook.SheetNames[0]
    const worksheet=workbook.Sheets[sheetname]
    console.log(worksheet);
    
    const emaillist=XLSX.utils.sheet_to_json(worksheet,{header:'A'})
    console.log(emaillist);
    const totalemail=emaillist.map(function(item)
  {
    return item.A
  })
  console.log(totalemail);
  setemailList(totalemail)
  
    
    

   }


   reader.readAsBinaryString(file)
}
function send() {
  setstaus(true);
  axios
    .post("http://localhost:5000/sendemail", { msg: msg,emailList:emailList })
    .then(function (data) {
      if (data.data === true) {
        alert("Email sent Successfully");
        setstaus(false)
      } else {
        alert("Failed");
      }
    });
  }
  
  return (
    <>
      <div className="bg-yellow-800 text-center ">
        <h1 className="text-2xl font-bold px-5 py-3">Bulkmail</h1>
      </div>
      <div className="bg-yellow-500 text-center ">
        <h1 className="text-xl font-medium px-5 py-3">
          We can help your business with sending multiple Emails at once
        </h1>
      </div>
      <div className="bg-yellow-400 text-center ">
        <h1 className="text-xl font-medium px-5 py-3">Drag and Drop</h1>
      </div>
      <div className="bg-yellow-300 flex flex-col items-center px-5 py-3">
        <textarea
          onChange={handlemsg}
          value={msg}
          className='w-[80%] h-32 py-2 outline-none px-2 border-2 border-black rounded-md placeholder="Enter  the email text'
        ></textarea>

        <div>
          <input onChange={handlefile}
            type="file"
            className="border-4 border-black border-dashed py-4 px-4 mt-5 mb-5 "
          />
        </div>
        <p>Total Emails in the File: {emailList.length}</p>
        <button
          onClick={send}
          className="bg-yellow-600 py-2 px-2 font-medium rounded-md w-fit mx-40 mt-5"
        >
          {status ? "Sending" : "Send"}
        </button>
      </div>
      <div className="bg-yellow-200 text-center p-8 ">
        <h1 className="text-xl font-medium px-5 py-3"></h1>
      </div>
      <div className="bg-yellow-100 text-center p-8 ">
        <h1 className="text-xl font-medium px-5 py-3"></h1>
      </div>
    </>
  );
}

export default App;
