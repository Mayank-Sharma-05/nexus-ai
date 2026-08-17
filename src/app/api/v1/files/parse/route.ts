import { NextRequest, NextResponse } from "next/server";
import { parseFile } from "@/lib/parsers/fileParser";

export async function POST(req: NextRequest) {
  console.log('[FILE PARSE API] ========== API ROUTE START ==========');
  console.log('[FILE PARSE API] Method:', req.method);
  console.log('[FILE PARSE API] URL:', req.url);
  console.log('[FILE PARSE API] Headers:', Object.fromEntries(req.headers.entries()));
  
  let result;
  try {
    console.log('[FILE PARSE API] Parsing request body...');
    const body = await req.json();
    console.log('[FILE PARSE API] Request body keys:', Object.keys(body));
    console.log('[FILE PARSE API] fileName:', body.fileName);
    console.log('[FILE PARSE API] fileBuffer type:', typeof body.fileBuffer);
    console.log('[FILE PARSE API] fileBuffer length:', body.fileBuffer?.length);
    console.log('[FILE PARSE API] fileBuffer first 10 values:', body.fileBuffer?.slice(0, 10));
    
    const { fileName, fileBuffer } = body;
    
    if (!fileName || !fileBuffer) {
      console.log('[FILE PARSE API] Missing required fields');
      console.log('[FILE PARSE API] fileName exists:', !!fileName);
      console.log('[FILE PARSE API] fileBuffer exists:', !!fileBuffer);
      result = NextResponse.json({ success: false, error: "File name and buffer required" }, { status: 400 });
    } else {
      console.log('[FILE PARSE API] Converting array to Buffer...');
      const buffer = Buffer.from(fileBuffer);
      console.log('[FILE PARSE API] Buffer size:', buffer.length, 'bytes');
      console.log('[FILE PARSE API] Buffer first 10 bytes:', Array.from(buffer.slice(0, 10)));
      
      if (buffer.length === 0) {
        console.error('[FILE PARSE API] Buffer is empty!');
        result = NextResponse.json({ success: false, error: "File buffer is empty" }, { status: 400 });
      } else {
        console.log('[FILE PARSE API] Calling parseFile...');
        const parseResult = await parseFile(buffer, fileName);
        console.log('[FILE PARSE API] Parse result received');
        console.log('[FILE PARSE API] Parse result text length:', parseResult.text?.length);
        console.log('[FILE PARSE API] Parse result error:', parseResult.error);
        console.log('[FILE PARSE API] Extracted text (first 200 chars):', parseResult.text?.substring(0, 200));

        if (parseResult.error) {
          console.log('[FILE PARSE API] Returning error response');
          result = NextResponse.json({ success: false, error: parseResult.error }, { status: 400 });
        } else {
          console.log('[FILE PARSE API] Returning success response');
          result = NextResponse.json({ success: true, data: { text: parseResult.text } });
        }
      }
    }
  } catch (error: any) {
    console.error('[FILE PARSE API] ========== ERROR ==========');
    console.error('[FILE PARSE API] Error:', error);
    console.error('[FILE PARSE API] Error name:', error.name);
    console.error('[FILE PARSE API] Error message:', error.message);
    console.error('[FILE PARSE API] Error stack:', error.stack);
    
    // Always return JSON, never HTML
    result = NextResponse.json(
      { success: false, error: error.message || "Unknown error occurred" },
      { status: 500 }
    );
  } finally {
    console.log('[FILE PARSE API] ========== API ROUTE END ==========');
    // Ensure we always return a Response
    if (!result) {
      console.error('[FILE PARSE API] No result set, returning error');
      result = NextResponse.json(
        { success: false, error: "Internal server error - no result generated" },
        { status: 500 }
      );
    }
  }
  
  return result;
}
