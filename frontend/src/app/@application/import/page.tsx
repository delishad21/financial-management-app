"use client";

import { useState } from "react";
import PageContainer from "@/components/container/PageContainer";
import FileUploader from "@/components/import/file-uploader";
import { parseCSVData } from "@/services/parsing-service";
import { useRouter } from "next/navigation";

const ImportPage = () => {
  const router = useRouter();
  const [selectedBank, setSelectedBank] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setUploadedFile(event.target.files[0]);
    }
  };

  const handleParse = async () => {
    if (!uploadedFile) {
      setUploadStatus("Please upload a file first.");
      return;
    }
    if (!selectedBank) {
      setUploadStatus("Please select a bank first.");
      return;
    }

    try {
      setUploadStatus("Parsing file...");
      const fileName = await parseCSVData(selectedBank, uploadedFile);

      router.push(`/import/${fileName}`);
    } catch (error) {
      console.error(error);
      setUploadStatus("An error occurred while parsing the file.");
    }
  };

  return (
    <PageContainer
      title="Import Page"
      description="Upload and parse your bank files"
    >
      <FileUploader
        handleFileChange={handleFileChange}
        uploadedFile={uploadedFile}
        selectedBank={selectedBank}
        setSelectedBank={setSelectedBank}
        handleParse={handleParse}
        uploadStatus={uploadStatus}
      />
    </PageContainer>
  );
};

export default ImportPage;
