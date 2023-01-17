export default function JsonFilePicker({ setJsonData }) {
  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        console.log(event.target.result);
        setJsonData(JSON.parse(event.target.result));
      });
      reader.readAsText(file);
    }
  };

  return (
      <div>
        <div>
          <input type="file" accept="application/json" name="jsonFile" onChange={uploadToClient} />
        </div>
      </div>
  )
}
