import cors from 'cors';
const corsOptions = { origin: true };
export const handleCors = cors(corsOptions);
