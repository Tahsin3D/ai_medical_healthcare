import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

const prompt = `Attached is an image of a clinical report. 
Go over the the clinical report and identify biomarkers that show slight or large abnormalities. 
Then summarize in 100 words. You may increase the word limit if the report has multiple pages. 
Do not output patient's personal information or companies information except pateients age and gender or anything that is related to the report. 
Make sure to include numerical values and key details from the report, 
including report title. organize it in easily readable format.
also style it with numbers and headers`;

export async function POST(req: Request, res: Response) {
    // const { base64 } = await req.json();
    // const filePart = fileToGenerativePart(base64)

    // console.log(filePart);
    // const generatedContent = await model.generateContent([prompt, filePart]);

    // console.log(generatedContent);
    // const textResponse = generatedContent.response.candidates![0].content.parts[0].text;
    // return new Response(textResponse, { status: 200 })

    // this is a dummy response for avoiding the gemini quota error 
    // Remeber to change this code after getting paid gemini api
    const dummyResponse = `This is a dummy image extraction details, not actual. Time is ${Date.now().toLocaleString()}`
    return new Response(dummyResponse, { status: 200 })
}

function fileToGenerativePart(imageData: string) {
  const mimeType = imageData.substring(
    imageData.indexOf(":") + 1,
    imageData.lastIndexOf(";")
  );
  const data = imageData.split(",")[1];

  if (!data || !mimeType) {
    throw new Error("Invalid base64 format.");
  }

  return {
    inlineData: {
      data,
      mimeType,
    },
  };
}
