import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const folderParam: string = data.get('folder') as string || ''

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary in 'adminza' folder
    // Organize by type: adminza/products or adminza/services
    const cloudinaryFolder = folderParam ? `adminza/${folderParam}` : 'adminza'
    const cloudinaryUrl = await uploadToCloudinary(buffer, cloudinaryFolder, file.type)

    // Extract filename from URL for backward compatibility
    const filename = cloudinaryUrl.split('/').pop() || file.name
    
    return NextResponse.json({ 
      success: true, 
      url: cloudinaryUrl,
      filename: filename 
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}