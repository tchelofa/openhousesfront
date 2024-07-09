// imports necessários
import { Env } from '@/lib/Env';
import axios from 'axios';
import { FormEvent, useState } from 'react';

export default function Uploads() {
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles(event.target.files);
            setErrorMessage(null); // Limpar mensagem de erro ao mudar de arquivo
        }
    };

    const handleFileUpload = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (selectedFiles) {
            let anyFileTooLarge = false;
            const maxFileSize = 3 * 1024 * 1024; // 2MB em bytes

            const formData = new FormData();
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                if (file.size > maxFileSize) {
                    anyFileTooLarge = true;
                    const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
                    setErrorMessage(`File "${file.name}" (${fileSizeInMB}MB) exceeds the maximum allowable size of 3MB.`);
                    break; // Sair do loop se algum arquivo for muito grande
                }
                formData.append('files', file);
            }

            if (anyFileTooLarge) {
                return; // Não prosseguir com o upload se algum arquivo for muito grande
            }

            try {
                const response = await axios.post(`${Env.baseurl}/uploads/multiplefiles/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log('Upload bem-sucedido:', response.data);
                // Tratar resposta, se necessário

            } catch (error) {
                console.error('Erro ao enviar arquivos:', error);
                // Tratar erro aqui
            }
        } else {
            console.error('Nenhum arquivo selecionado.');
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <label htmlFor="files" className="block text-sm font-medium text-gray-700">
                Select files (multiple allowed) Maximum size: 3MB each image.
            </label>
            <form encType="multipart/form-data" onSubmit={handleFileUpload} className='flex flex-col gap-4'>
                <input
                    type="file"
                    name="files"
                    id="files"
                    multiple
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 hover:bg-gray-100"
                />
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Enviar Arquivos
                </button>
            </form>
            {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
        </div>
    );
}
