const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? "http://localhost:4000"
    : "http://bullpen.trevorflanigan.com";


export {BACKEND_URL}