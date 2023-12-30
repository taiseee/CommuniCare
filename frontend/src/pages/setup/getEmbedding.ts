import OpenAI from "openai";

export async function getEmbedding(text: string): Promise<number[]> {
    const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
    });

    const res = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text,
        encoding_format: "float",
    });

    return res.data[0].embedding;
}