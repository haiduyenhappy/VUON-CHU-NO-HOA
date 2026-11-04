/** OCR chạy tại trình duyệt, không dùng Gemini API. Cần mạng để tải Tesseract và dữ liệu tiếng Việt lần đầu. */
type OcrWorker = { recognize: (image: string) => Promise<{data:{text:string}}>; terminate: () => Promise<unknown> };
type TesseractGlobal = { createWorker: (languages: string) => Promise<OcrWorker> };
let scriptPromise: Promise<TesseractGlobal> | null = null;
function loadTesseract(): Promise<TesseractGlobal> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const current = (window as any).Tesseract as TesseractGlobal | undefined;
    if (current?.createWorker) return resolve(current);
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
    script.async = true;
    script.onload = () => {
      const api = (window as any).Tesseract as TesseractGlobal | undefined;
      api?.createWorker ? resolve(api) : reject(new Error('Không tải được thư viện đọc ảnh.'));
    };
    script.onerror = () => reject(new Error('Không tải được bộ nhận dạng ảnh. Vui lòng kiểm tra kết nối Internet.'));
    document.head.appendChild(script);
  }).catch(error => { scriptPromise = null; throw error; });
  return scriptPromise;
}
export async function recognizeVietnameseImages(images: string[]): Promise<string> {
  if (!images.length) throw new Error('Chưa có ảnh để nhận dạng.');
  const tesseract = await loadTesseract();
  let worker: OcrWorker | undefined;
  try {
    worker = await tesseract.createWorker('vie+eng');
    const texts: string[] = [];
    for (const image of images) {
      const result = await worker.recognize(image);
      const text = result.data.text.replace(/\r/g, '').replace(/[^\S\n]+/g, ' ').trim();
      if (text) texts.push(text);
    }
    if (!texts.length) throw new Error('Không nhận diện được chữ trong ảnh. Hãy thử ảnh rõ nét hơn.');
    return texts.join('\n\n');
  } catch (error) {
    if (error instanceof Error && /Không nhận diện/.test(error.message)) throw error;
    throw new Error('Không thể đọc ảnh trên trình duyệt. Kiểm tra kết nối Internet hoặc thử ảnh rõ nét hơn.');
  } finally { if (worker) await worker.terminate().catch(() => undefined); }
}
