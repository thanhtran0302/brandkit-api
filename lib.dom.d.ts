declare function fetch(
  input?: RequestInfo,
  init?: RequestInit
): Promise<Response>;

declare interface GlobalFetch {
  fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;
}
