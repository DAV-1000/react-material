import '@testing-library/jest-dom';
import { TextEncoder as NodeTextEncoder, TextDecoder as NodeTextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = NodeTextEncoder as unknown as typeof window.TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = NodeTextDecoder as unknown as typeof window.TextDecoder;
}