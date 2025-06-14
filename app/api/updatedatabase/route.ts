// import { updateVectorDB } from "@/lib/utils/index";
// import { Pinecone } from "@pinecone-database/pinecone";
// import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
// import { TextLoader } from "langchain/document_loaders/fs/text";
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { NextApiRequest, NextApiResponse } from "next";

// const updateDatabase = async (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method === "POST") {
//     const { indexname, namespace } = JSON.parse(req.body);
//     await handleUpload(indexname, namespace, res);
//   }
// };

// async function handleUpload(
//   indexname: string,
//   namespace: string,
//   res: NextApiResponse
// ) {
//   let docs;
//   try {
//     const loader = new DirectoryLoader("./documents", {
//       ".pdf": (path: string) =>
//         new PDFLoader(path, {
//           splitPages: false,
//         }),
//       ".txt": (path: string) => new TextLoader(path),
//     });
//     docs = await loader.load();
//   } catch (error) {
//     console.error(`Error loading PDF: `, error);
//   }

//   const client = new Pinecone({
//     apiKey: process.env.PINECONE_API_KEY!,
//   });
  
//   await updateVectorDB(
//     client,
//     indexname,
//     namespace,
//     docs!,
//     (filename, totalChunks, chunksUpserted, isComplete) => {
//       console.log(`${filename}-${totalChunks}-${chunksUpserted}-${isComplete}`);
//       if (!isComplete) {
//         res.write(
//           JSON.stringify({
//             filename,
//             totalChunks,
//             chunksUpserted,
//             isComplete,
//           })
//         );
//       } else {
//         res.end();
//       }
//     }
//   );
// }

// export default updateDatabase;
