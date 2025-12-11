declare module "langchain/text_splitter" {
  export interface RecursiveCharacterTextSplitterOptions {
    chunkSize?: number;
    chunkOverlap?: number;
  }

  export class RecursiveCharacterTextSplitter {
    constructor(opts?: RecursiveCharacterTextSplitterOptions);
    splitText(text: string): Promise<string[]>;
  }
}
