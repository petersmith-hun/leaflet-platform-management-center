import { Observable, Subscriber } from "rxjs";

/**
 * Wraps a streaming Fetch API response into an RxJS Observable. When a subscription is active, it reads the data chunks
 * as JSON objects of type T, and emits them via the observable object.
 *
 * @param publisher Fetch API call supplier
 */
export const createObservable = <T>(publisher: () => Promise<Response>): Observable<T> => {

  return new Observable<T>(subscriber => {

    publisher()
      .then(response  => response.body!.getReader())
      .then(async reader => readStream(reader, subscriber))
      .catch(() => subscriber.complete());
  });
}

const readStream = async <T>(reader: ReadableStreamDefaultReader<Uint8Array>, subscriber: Subscriber<T>): Promise<void> => {

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      subscriber.complete();
      break;
    }

    processChunks(value, (data: T) => subscriber.next(data));
  }
}

const processChunks = <T>(value: Uint8Array, emitter: (data: T) => void): void => {

  Buffer
    .from(value)
    .toString()
    .split(/\r?\n/)
    .filter(chunk => chunk.startsWith("data:"))
    .map(chunk => chunk.substring(5).trim())
    .map(data => safeParse<T>(data))
    .filter(data => data !== null)
    .map(data => data!)
    .forEach(emitter);
}

const safeParse = <T>(data: string): T | null => {

  try {
    return JSON.parse(data) as T;
  } catch (error) {
    return null;
  }
}
