import os
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

VECTOR_PATH = "vectorstore"


embeddings=HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')


async def ingest_file(data):
    try:
        file_path = data["filePath"]
        file_id = data["fileId"]
        file_type = data["fileType"]

        print("📂 FILE PATH:", file_path)
        print("📂 EXISTS:", os.path.exists(file_path))

        if not os.path.exists(file_path):
            return {"error": "File not found at path"} 

        if file_type == "pdf":
            loader = PyPDFLoader(file_path)
        elif file_type == "txt":
            loader = TextLoader(file_path)
        else:
            return {"error": "Unsupported file type"}

        docs = loader.load()
        
        print("📄 DOCS LOADED:", len(docs))
       
        if not docs:
            return {"error": "No content found in file"}

      
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )

        chunks = splitter.split_documents(docs)

       
        if not chunks:
            return {"error": "Text splitting failed"}

      
        for i, chunk in enumerate(chunks):
            chunk.metadata["chunk"] = i
            chunk.metadata["source"] = file_id

       
        vectorstore = FAISS.from_documents(chunks, embeddings)

       
        save_path = os.path.join(VECTOR_PATH, file_id)
        os.makedirs(save_path, exist_ok=True)

        vectorstore.save_local(save_path)

        return {
            "status": "success",
            "chunks": len(chunks)
        }

    except Exception as e:
        return {
            "error": str(e)
        }