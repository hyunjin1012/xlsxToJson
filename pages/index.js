import JSZip from "jszip";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { saveAs } from "file-saver";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [file, setFile] = useState(null);
  const [json, setJson] = useState(null);
  const [name, setName] = useState("");
  const [RMNTUrl, setRMNTUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [artist, setArtist] = useState("");
  const [license, setLicense] = useState("");

  let fileReader;
  useEffect(() => {
    fileReader = new FileReader();
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleRMNTUrlChange = (e) => {
    setRMNTUrl(e.target.value);
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  const handleArtistChange = (e) => {
    setArtist(e.target.value);
  };

  const handleLicenseChange = (e) => {
    setLicense(e.target.value);
  };

  const csvFileToArray = (string) => {
    var array = string.toString().split("\r\n");
    var data = [];
    for (const r of array) {
      let row = r.toString().split(",");
      data.push(row);
    }
    var heading = data[0];
    var result = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var obj = { trait_type: "", value: "" };
      var attributes = [];
      for (var j = 1; j < heading.length; j++) {
        if (row[j] != "") {
          obj.trait_type = heading[j].replaceAll(" ", "_");
          obj.value = row[j].toString().replaceAll(" ", "_");

          attributes.push(JSON.parse(JSON.stringify(obj)));
        }
      }
      result.push({
        name: name + " #" + row[0],
        external_url: RMNTUrl,
        image: imageUrl,
        artist: artist,
        license: license,
        attributes: attributes,
      });
    }
    console.log(result);
    setJson(result);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);
      };
      fileReader.readAsText(file);
    }
  };

  const exportFile = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(json, null, 2)], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "json.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const exportZip = () => {
    const zip = new JSZip();
    for (let i = 0; i < json.length; i++) {
      const file = new Blob([JSON.stringify(json[i], null, 2)], {
        type: "text/plain",
      });
      zip.file(json[i].name.split("#")[1] + ".json", file);
    }
    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, "json.zip");
    });
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <h1 className="text-4xl font-bold text-center">CSV to JSON</h1>
      <div className="flex flex-col items-center justify-center mt-4">
        {json && (
          <div className="py-8 flex flex-col items-center justify-center gap-4">
            <div className="flex gap-1">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="button"
                onClick={exportFile}
              >
                Download in a single file
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="button"
                onClick={exportZip}
              >
                Download in multiple files
              </button>
            </div>
            <pre className="flex flex-col items-center justify-center text-sm">
              {json && JSON.stringify(json, null, 2)}
            </pre>
          </div>
        )}

        <form className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Enter the character name"
            onChange={handleNameChange}
          />
          <input
            type="text"
            placeholder="Enter the RMNT url"
            onChange={handleRMNTUrlChange}
          />
          <input
            type="text"
            placeholder="Enter the image url"
            onChange={handleImageUrlChange}
          />
          <input
            type="text"
            placeholder="Enter the artist name"
            onChange={handleArtistChange}
          />
          <input
            type="text"
            placeholder="Enter the license description"
            onChange={handleLicenseChange}
          />
          <div className="flex items-center justify-center gap-1">
            <label>CSV File: </label>
            <input type="file" onChange={handleFileChange} />
          </div>
          <button
            onClick={handleOnSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Convert
          </button>
        </form>
      </div>
    </main>
  );
}
