declare global {
  // type Recordable<T = any> = Record<string, T>
  // type ReadonlyRecordable<T = any> = {
  //   readonly [key: string]: T
  // }
  // interface ImportMetaEnv extends ViteEnv {
  //   __: string | boolean | undefined
  // }
}
interface redis {
  port: number;
  host: string;
  db: number;
  password: string;
}
