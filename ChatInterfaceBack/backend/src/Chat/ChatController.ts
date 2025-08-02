import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { File as MulterFile } from 'multer';

@Controller('chat')
export class ChatController {
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
    const audioUrl = `http://localhost:3001/audio/${file.filename}`;
    return { audioUrl };
  }
}
