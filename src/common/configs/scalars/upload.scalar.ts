import { BadRequestException } from '@nestjs/common'
import { Scalar, CustomScalar } from '@nestjs/graphql'
import { ValueNode } from 'graphql'
import FileType from 'file-type'
import { FileUpload } from 'graphql-upload'
import { isUndefined } from 'lodash'

export type ImageProps = Promise<FileUpload>

@Scalar('Upload', () => Image)
export class Upload implements CustomScalar<ImageProps, ImageProps> {
  description = 'Image upload type.'
  supportedFormats = ['image/jpeg', 'image/png']

  parseLiteral(file: ValueNode) {
    if (file.kind === 'ObjectValue') {
      const fileObject = file as any
      if (
        typeof fileObject.filename === 'string' &&
        typeof fileObject.mimetype === 'string' &&
        typeof fileObject.encoding === 'string' &&
        typeof fileObject.createReadStream === 'function'
      )
        return Promise.resolve(fileObject)
    }

    return null
  }

  async parseValue(value: ImageProps) {
    // Comes through ok here

    const upload = await value
    const stream = upload.createReadStream()
    const fileType = await FileType.fileTypeFromStream(stream)

    if (isUndefined(fileType))
      throw new BadRequestException('Mime type is unknown.')

    if (fileType.mime !== upload.mimetype)
      throw new BadRequestException('Mime type does not match file content.')

    if (!this.supportedFormats.includes(fileType.mime))
      throw new BadRequestException(
        `Unsupported file format. Supports: ${this.supportedFormats.join(' ')}.`
      )

    return upload
  }

  serialize(value: ImageProps) {
    return value
  }
}