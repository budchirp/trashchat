import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { NextResponse, type NextRequest } from 'next/server'
import { authenticate } from '@/lib/auth/server'
import { S3Client } from '@aws-sdk/client-s3'
import { Secrets } from '@/lib/secrets'
import { randomUUID } from 'crypto'
import slugify from 'slugify'
import { getTranslations } from 'next-intl/server'

const client = new S3Client({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: Secrets.awsAccessKeyId!,
    secretAccessKey: Secrets.awsSecretAccessKey!
  }
})

export const POST = async (request: NextRequest) => {
  try {
    const locale = request.headers.get('accept-language') || 'en'
    const t = await getTranslations({ locale })

    const [isTokenValid, payload, user] = await authenticate(request.headers, request.cookies)
    if (!isTokenValid || !payload) {
      return NextResponse.json(
        {
          message: t('errors.unauthorized'),
          data: {}
        },
        {
          status: 403
        }
      )
    }

    const {
      file: { name, contentType }
    } = await request.json()

    const { url, fields } = await createPresignedPost(client, {
      Bucket: Secrets.S3Bucket!,
      Key: `${user.id}-${new Date().getTime()}-${randomUUID()}-${slugify(name)}`,
      Fields: {
        'Content-Type': contentType
      }
    })

    return NextResponse.json({
      message: t('common.success'),
      data: {
        name,
        url,
        fields
      }
    })
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      {
        message: (error as Error).message,
        data: {}
      },
      { status: 500 }
    )
  }
}
