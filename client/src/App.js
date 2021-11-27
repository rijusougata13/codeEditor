import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import stubs from "./defaultStubs";
import moment from "moment";
import AceEditor from "react-ace";

function App() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("py");
  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("");
  const [jobDetails, setJobDetails] = useState(null);
  const [prevcode, setPrevCodes] = useState([]);
  const [textInput, setTextInput] = useState("");
  useEffect(() => {
    setCode(stubs[language]);
  }, [language]);
  useEffect(() => {
    axios.get("https://secret-chamber-70675.herokuapp.com/allJob").then((data) => {
      setPrevCodes(data.data.data);
    });
  }, []);

  const handleSubmit = async () => {
    try {
      setStatus("");
      setJobId("");
      setOutput("");
      setJobDetails(null);
      const { data } = await axios.post("https://secret-chamber-70675.herokuapp.com/run", {
        language: language,
        code,
        textInput,
      });

      setJobId(data.jobId);
      let intervalId;
      intervalId = setInterval(async () => {
        const { data: dataRes } = await axios.get(
          "https://secret-chamber-70675.herokuapp.com/status",
          { params: { id: data.jobId } }
        );

        const { success, job, error } = dataRes;
        console.log("datares", dataRes);
        setStatus(job.status);
        if (success) {
          const { status: jobStatus, output: jobOutput } = job;
          setJobDetails(job);
          setOutput(jobOutput);
          if (jobStatus === "pending") return;
          clearInterval(intervalId);
        } else {
          console.log(error);
          setOutput(error);
          clearInterval(intervalId);
        }
      }, 1000);
      setOutput(data.output);
      console.log(data);
    } catch ({ response }) {
      console.log(response?.data?.err?.stderr);
      setOutput(response?.data?.err?.stderr);
    }
  };

  const executionTime = () => {
    if (!jobDetails) return "";
    let result = "";
    let { submittedAt, completedAt, startedAt } = jobDetails;
    submittedAt = moment(submittedAt).toString();
    result = `submitted at ${submittedAt}`;

    if (!completedAt || !startedAt) return result;
    const start = moment(startedAt);
    const end = moment(completedAt);
    const executiontime = end.diff(start, "seconds", true);
    result = `execution time: ${executiontime}`;

    return result;
  };

  const prevCodes = () => {
    let result = "";
    prevcode.map((value) => {
      result += <p> value._id </p>;
    });
    return result;
  };

  return (
    <div class="App">
      <h1 style={{ margin: "0  0rem 5rem 0rem ", textAlign: "center" }}>
        Code and Compile
      </h1>
      <h5>C++ and other languages are under maintanance</h5>
      <div>
        <label>Language: </label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          {/* <option value="cpp">C++</option> */}
          <option value="py">Python</option>
        </select>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <div style={{ padding: "2rem" }}>
          <AceEditor
            style={{
              height: "60vh",
              width: "40vw",
            }}
            placeholder="Start Coding"
            theme="solarized_dark"
            name="basic-code-editor"
            onChange={(currentCode) => setCode(currentCode)}
            fontSize={18}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            value={code}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 4,
            }}
          />
          <br />
          <button onClick={handleSubmit}>Submit</button>
        </div>
        <div style={{ padding: "0rem 2rem" }}>
          <p>Input file</p>
          <textarea
            value={textInput}
            rows={10}
            cols={40}
            onChange={(e) => setTextInput(e.target.value)}
          ></textarea>

          <p>
            <p>Job Id: {jobId}</p>
            <p>Status:{status}</p>
            <p>{executionTime()}</p>
            <p>Output: </p>
            <textarea value={output} rows={10} cols={40}></textarea>
          </p>
        </div>
        <p>Prev Code:</p>

        {/* <div>
          {prevcode.map((val, index) => {
            if (index <= 3)
              return (
                <p>
                  <a href={prevcode[prevcode.length - index - 1]._id}>
                    {prevcode[prevcode.length - index - 1]._id}
                  </a>{" "}
                  - {prevcode[prevcode.length - index - 1].status}
                </p>
              );
          })}
        </div> */}
      </div>
    </div>
  );
}

export default App;
