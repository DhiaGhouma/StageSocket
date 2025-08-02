import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { File as MulterFile } from 'multer';

@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  @Post('upload-audio')
  @UseInterceptors(
    FileInterceptor('audio', {
      storage: diskStorage({
        destination: './uploads/audio',
        filename: (req, file, cb) => {
          const uniqueName = `audio-${Date.now()}-${Math.round(Math.random() * 19)}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  uploadAudio(@UploadedFile() file: MulterFile) {
    this.logger.log(`Audio uploaded: ${file.filename}`);
    const audioUrl = `http://localhost:3001/audio/${file.filename}`;
    return { audioUrl };
  }

  @Post('upload-file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/files',
        filename: (req, file, cb) => {
          // Sanitize filename and add timestamp
          const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
          const uniqueName = `file-${Date.now()}-${Math.round(Math.random() * 1000)}-${sanitizedName}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Allowed file types
        const allowedMimeTypes = [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
          'application/vnd.ms-excel', // .xls
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
          'application/msword', // .doc
          'application/pdf', // .pdf
        ];

        const allowedExtensions = ['.xlsx', '.xls', '.docx', '.doc', '.pdf'];
        const fileExtension = extname(file.originalname).toLowerCase();

        if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only Excel, Word, and PDF files are allowed'), false);
        }
      },
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
      },
    }),
  )
  uploadFile(@UploadedFile() file: MulterFile) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    this.logger.log(`File uploaded: ${file.originalname} -> ${file.filename}`);

    // Format file size
    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Generate file URL that matches the static serving setup
    const fileUrl = `http://localhost:3001/files/${file.filename}`;

    return {
      fileUrl,
      fileName: file.originalname,
      fileSize: formatFileSize(file.size),
      fileType: file.mimetype,
      uploadedAt: new Date().toISOString(),
    };
  }
}