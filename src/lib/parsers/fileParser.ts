import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';



export interface ParseResult {
  text: string;
  error?: string;
}

/**
 * Parse a file buffer and extract text content
 * Supports: PDF, DOCX, TXT, PNG, JPG, JPEG
 */
export async function parseFile(buffer: Buffer, fileName: string): Promise<ParseResult> {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  console.log('[FILE PARSER] Parsing file:', fileName, 'Extension:', extension, 'Buffer size:', buffer.length);

  try {
    switch (extension) {
      case 'pdf':
  return {
    text: '',
    error: 'PDF parsing temporarily disabled'
  };
      case 'docx':
        console.log('[FILE PARSER] Using DOCX parser');
        return await parseDOCX(buffer);
      case 'txt':
        console.log('[FILE PARSER] Using TXT parser');
        return { text: buffer.toString('utf-8') };
      case 'png':
      case 'jpg':
      case 'jpeg':
        console.log('[FILE PARSER] Using Image OCR parser');
        return await parseImage(buffer);
      default:
        console.log('[FILE PARSER] Unsupported file type:', extension);
        return { text: '', error: `Unsupported file type: ${extension}` };
    }
  } catch (error) {
    console.error('[FILE PARSER] Parse error:', error);
    console.error('[FILE PARSER] Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('[FILE PARSER] Error stack:', error instanceof Error ? error.stack : 'No stack');
    return { text: '', error: `Failed to parse ${extension}: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

// async function parsePDF(buffer: Buffer): Promise<ParseResult> {
//  console.log('[PDF PARSER] Parsing PDF with pdf-parse...');

// const pdfData = await pdfParse(buffer);

// console.log('[PDF PARSER] PDF parsed successfully');
// console.log('[PDF PARSER] Number of pages:', pdfData.numpages);
// console.log('[PDF PARSER] Extracted text length:', pdfData.text.length);
// console.log('[PDF PARSER] ========== PDF PARSING SUCCESS ==========');

// return {
//   text: pdfData.text.trim()
// }};

async function parseDOCX(buffer: Buffer): Promise<ParseResult> {
  console.log('[DOCX PARSER] Starting DOCX parse');
  try {
    console.log('[DOCX PARSER] Calling mammoth.extractRawText');
    const result = await mammoth.extractRawText({ buffer });
    console.log('[DOCX PARSER] DOCX parsed successfully, text length:', result.value?.length);
    return { text: result.value || '' };
  } catch (error) {
    console.error('[DOCX PARSER] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[DOCX PARSER] Error message:', errorMessage);
    // Return empty text instead of error to allow flow to continue
    return { text: '', error: `DOCX parsing failed: ${errorMessage}` };
  }
}

async function parseImage(buffer: Buffer): Promise<ParseResult> {
  console.log('[IMAGE PARSER] Starting image OCR');
  try {
    console.log('[IMAGE PARSER] Calling Tesseract.recognize');
    const result = await Tesseract.recognize(buffer, 'eng');
    console.log('[IMAGE PARSER] OCR completed, text length:', result.data.text?.length);
    return { text: result.data.text || '' };
  } catch (error) {
    console.error('[IMAGE PARSER] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[IMAGE PARSER] Error message:', errorMessage);
    // Return empty text instead of error to allow flow to continue
    return { text: '', error: `OCR failed: ${errorMessage}` };
  }
}

/**
 * Validate file type
 */
export function isValidFileType(fileName: string, allowedTypes: string[]): boolean {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  return allowedTypes.includes(extension);
}
