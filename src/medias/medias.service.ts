import { Injectable } from '@nestjs/common';
import { UpdateMediaInput } from './dto/update-media.input';
import CreateMediaInput from './dto/create-media.input';
import { join } from 'path';
import { uploadFileStream } from 'src/utils/upload';

@Injectable()
export class MediasService {
  uploadDirectory = 'upload_directory';
  singleUpload(createMediaInput: CreateMediaInput) {
    const filePaths = createMediaInput.files.map(async (file, index) => {
      const fileData: any = await file;
      const fileName = `${Date.now()}_${index}_${fileData.filename}`;
      const uploadDir = join(
        this.uploadDirectory,
        'example',
        'images',
      );
      const filePath = await uploadFileStream(
        fileData.createReadStream,
        uploadDir,
        fileName,
      );
      return filePath;
    });

    return true;
  }
}
