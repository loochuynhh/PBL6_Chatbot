import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*', // Cho phép mọi origin
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Các method được phép
      'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Các header được phép
    },
  });
}

export async function POST(req: Request) {
  try {
    const { userInput } = await req.json();

    // Khởi tạo Google Generative AI client
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Gọi model để tạo nội dung dựa trên user input
    const result = await model.generateContent(userInput);

    // Trả về kết quả từ Gemini AI dưới dạng JSON
    return new NextResponse(
      JSON.stringify({ reply: result.response.text() }),
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*', // Cho phép mọi origin
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });

      // Trả về thông báo lỗi chi tiết
      return NextResponse.json(
        {
          error: 'There was an issue processing your request.',
          details: error.message || 'Unknown error occurred.',
          GEMINI_API_KEY: GEMINI_API_KEY,
          stack:
            process.env.NODE_ENV === 'development' ? error.stack : undefined,
        },
        { status: 500 }
      );
    } else {
      console.error('Unknown error:', error);
      return NextResponse.json(
        { error: 'An unknown error occurred.' },
        { status: 500 }
      );
    }
  }
}
