import Cors from 'cors';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Khởi tạo cors middleware
const cors = Cors({
  methods: ['GET', 'POST'],
  origin: '*', // Cho phép mọi origin
});

// Middleware wrapper cho Next.js API
function runMiddleware(req: Request, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, { end: () => {} }, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY; // Load your API key from environment variables

export async function POST(req: Request) {
  try {
    // Chạy middleware CORS
    await runMiddleware(req, cors);

    const { userInput } = await req.json();

    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Call the model to generate content based on user input
    const result = await model.generateContent(userInput);

    // Return the response from Gemini AI as JSON
    return NextResponse.json({ reply: result.response.text() });
  } catch (error: unknown) { // Thay đổi từ 'any' thành 'unknown'
    if (error instanceof Error) { // Kiểm tra xem lỗi có phải là instance của Error không
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });

      // Return a more detailed error message in the response
      return NextResponse.json(
        { 
          error: 'There was an issue processing your request.',
          details: error.message || 'Unknown error occurred.',
          GEMINI_API_KEY: GEMINI_API_KEY,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined // Show stack trace in development only
        },
        { status: 500 }
      );
    } else {
      // Nếu lỗi không phải là Error, bạn có thể xử lý thêm ở đây.
      console.error('Unknown error:', error);
      return NextResponse.json(
        { error: 'An unknown error occurred.' },
        { status: 500 }
      );
    }
  }
}
