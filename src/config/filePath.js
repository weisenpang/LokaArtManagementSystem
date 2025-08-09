import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // Gets the current file's absolute path
const __dirname = path.dirname(__filename); // Gets the directory name

export const filePathStatic = path.join(__dirname, '../../cozastore-master-template');
export const filePath = (_path) => {
    return path.join(__dirname, '../../cozastore-master-template', _path);
};

