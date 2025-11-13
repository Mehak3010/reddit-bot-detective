import { useState } from "react";
import { uploadDataset } from "@/utils/api";

const ResearcherUpload = () => {
  const [datasetName, setDatasetName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [message, setMessage] = useState<string>("");

  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a CSV file.");
      return;
    }
    setLoadingUpload(true);
    setMessage("");
    try {
      const res = await uploadDataset(datasetName.trim() || file.name, file);
      if (res.publicUrl) {
        setMessage(`Uploaded to cloud storage: ${res.publicUrl}`);
      } else if (res.storagePath) {
        setMessage(`Uploaded to storage path: ${res.storagePath}`);
      } else if (res.localPath) {
        setMessage(`Saved locally at ${res.localPath}`);
      } else {
        setMessage('Upload completed.');
      }
    } catch (err: any) {
      setMessage(err?.message || "Upload failed");
    } finally {
      setLoadingUpload(false);
    }
  };

  return (
    <section className="pt-6 pb-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Upload Your Dataset</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Upload a CSV; we will store the original file in secure cloud storage.
          </p>
          <form onSubmit={onUpload} className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Dataset name (optional)</label>
              <input
                type="text"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-background"
                placeholder="e.g. lab-aug-2025"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">CSV file</label>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full"
              />
            </div>
            <button
              type="submit"
              disabled={loadingUpload}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
            >
              {loadingUpload ? "Uploading…" : "Upload dataset"}
            </button>
          </form>
        </div>
      </div>
      {message && (
        <div className="max-w-7xl mx-auto mt-4 text-sm text-muted-foreground">
          {message}
        </div>
      )}
    </section>
  );
};

export default ResearcherUpload;