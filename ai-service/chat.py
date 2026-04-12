import os
from langchain_openai import ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from fastapi.responses import StreamingResponse
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()


async def chat_with_notes(data):
    query = data["query"]
    file_id = data["fileId"]

    # Load vectorstore
    embeddings=HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')
    vectorstore = FAISS.load_local(
        f"vectorstore/{file_id}",
        embeddings,
        allow_dangerous_deserialization=True
    )
    retriever = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={"k": 8}
    )

    docs = retriever.invoke(query)
    print(f"\n🔍 QUERY: {query}")
    for i, doc in enumerate(docs):
        print(f"\n--- CHUNK {i} ---")
        print(doc.page_content[:200])
    
    context = "\n\n".join([doc.page_content for doc in docs])
    print(f"\n📄 FULL CONTEXT:\n{context[:500]}")

    

    #  Prompt
    prompt = f"""
    You are an intelligent document assistant.

    Rules:
    - Extract exact answers from context
    - Understand short queries like "name", "guide", "registration"
    - Match similar meanings (e.g., reg no = registration number)
    - If found, return ONLY the value
    - If not found, say "Not in notes"

    Context:
    {context}

    Question:
    {query}
"""

    llm = ChatGroq(
       model="openai/gpt-oss-20b",
        streaming=True,
        temperature=0
    )

    # Streaming generator
    async def stream():
        async for chunk in llm.astream(prompt):
            yield chunk.content

    return StreamingResponse(stream(), media_type="text/plain")