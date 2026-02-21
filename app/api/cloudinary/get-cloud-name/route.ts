import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ''
    
    if (!cloudName) {
      return NextResponse.json({ 
        error: 'Cloudinary cloud name not configured' 
      }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true,
      cloudName: cloudName
    })
  } catch (error: any) {
    console.error('Error getting Cloudinary cloud name:', error)
    return NextResponse.json({ 
      error: 'Failed to get Cloudinary cloud name',
      details: error.message 
    }, { status: 500 })
  }
}
