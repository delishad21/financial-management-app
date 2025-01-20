import { env } from "next-runtime-env";
// import { useSWR } from "swr";

const parseCSVUrl = env("NEXT_PUBLIC_DATA_SVC_URL") + "/parser/csv";

export const parseCSVData = async (bankName: string, file: File) => {
  const formData = new FormData();
  formData.append("csvFile", file);
  formData.append("bankName", bankName);

  try {
    const response = await fetch(parseCSVUrl, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      return (await response.json()).fileName;
    } else {
      throw new Error(`Parsing failed: ${await response.text()}`);
    }
  } catch (error) {
    throw new Error("An error occurred while parsing the file.");
  }
};

export const fetchParsedData = async (fileName: string) => {
  console.log(`Fetching parsed data for file ID: ${fileName}`);
  const fetchURL =
    env("NEXT_PUBLIC_DATA_SVC_URL") + "/parser/retrieve/" + fileName;
  const response = await fetch(fetchURL);
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`Fetching failed: ${await response.text()}`);
  }
};
