/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/building-your-application/configuring/typescript for more information.
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_GEMINI_API_KEY: string;
  }
}