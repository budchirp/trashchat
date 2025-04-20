import { NextResponse, type NextRequest } from 'next/server'
import { authenticate } from '@/lib/auth/server/authenticate'
import { prisma } from '@/lib/prisma'
import { S3Client } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { Env } from '@/lib/env'
import { randomUUID } from 'crypto'
import slugify from 'slugify'

const client = new S3Client({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: Env.awsAccessKeyId!,
    secretAccessKey: Env.awsSecretAccessKey!
  }
})

export const POST = async (request: NextRequest) => {
  try {
    const [isTokenValid, payload, user] = await authenticate(request.headers)
    if (!isTokenValid || !payload) {
      return NextResponse.json(
        {
          message: 'Unauthorized',
          data: {}
        },
        {
          status: 403
        }
      )
    }

    let response: {
      [filename: string]: {
        url: string
        fields: any
      }
    } = {}

    const { files } = await request.json()
    await Promise.all(
      files.map(
        async ({
          name,
          contentType
        }: {
          name: string
          contentType: string
        }) => {
          const { url, fields } = await createPresignedPost(client, {
            Bucket: Env.S3_bucket!,
            Key: `${user.id}-${new Date().getTime()}-${randomUUID()}-${slugify(name)}`,
            Fields: {
              'Content-Type': contentType
            }
          })

          response = {
            ...response,
            [name]: { url, fields }
          }
        }
      )
    )

    return NextResponse.json({
      message: 'Success',
      data: response
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
