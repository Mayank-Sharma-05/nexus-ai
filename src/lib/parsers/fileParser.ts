import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';

// Disable worker for Node.js server environment
// PDF.js can work without a worker for basic text extraction
pdfjsLib.GlobalWorkerOptions.workerSrc = '';

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
        console.log('[FILE PARSER] Using PDF parser');
        return await parsePDF(buffer);
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

async function parsePDF(buffer: Buffer): Promise<ParseResult> {
  console.log('[PDF PARSER] ========== PDF PARSING START ==========');
  console.log('[PDF PARSER] Buffer size:', buffer.length, 'bytes');
  console.log('[PDF PARSER] Buffer first 20 bytes:', Array.from(buffer.slice(0, 20)));
  
  try {
    console.log('[PDF PARSER] Loading PDF document...');
    const loadingTask = pdfjsLib.getDocument({ data: buffer });
    console.log('[PDF PARSER] Loading task created');
    
    const pdfDocument = await loadingTask.promise;
    console.log('[PDF PARSER] PDF loaded successfully');
    console.log('[PDF PARSER] Number of pages:', pdfDocument.numPages);
    
    if (pdfDocument.numPages === 0) {
      console.error('[PDF PARSER] PDF has 0 pages');
      return { text: '', error: 'PDF has no pages' };
    }

    let fullText = '';
    
    console.log('[PDF PARSER] Starting text extraction from all pages...');
    for (let i = 1; i <= pdfDocument.numPages; i++) {
      console.log(`[PDF PARSER] Processing page ${i}/${pdfDocument.numPages}`);
      const page = await pdfDocument.getPage(i);
      console.log(`[PDF PARSER] Page ${i} retrieved`);
      
      const textContent = await page.getTextContent();
      console.log(`[PDF PARSER] Page ${i} text content items:`, textContent.items.length);
      
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      console.log(`[PDF PARSER] Page ${i} extracted text length:`, pageText.length);
      console.log(`[PDF PARSER] Page ${i} first 100 chars:`, pageText.substring(0, 100));
      
      fullText += pageText + '\n';
    }

    console.log('[PDF PARSER] Text extraction complete');
    console.log('[PDF PARSER] Total extracted text length:', fullText.length);
    console.log('[PDF PARSER] Total extracted text (first 500 chars):', fullText.substring(0, 500));
    console.log('[PDF PARSER] ========== PDF PARSING SUCCESS ==========');
    
    return { text: fullText.trim() };
  } catch (error) {
    console.error('[PDF PARSER] ========== PDF PARSING ERROR ==========');
    console.error('[PDF PARSER] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[PDF PARSER] Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('[PDF PARSER] Error message:', errorMessage);
    console.error('[PDF PARSER] Error stack:', error instanceof Error ? error.stack : 'No stack');
    return { text: '', error: `PDF parsing failed: ${errorMessage}` };
  }
}

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
