import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageName, folder = 'adminza/products' } = body

    if (!imageName) {
      return NextResponse.json({ error: 'Image name is required' }, { status: 400 })
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    
    // Method 1: Try to find by exact public_id (with and without extension)
    const publicIdWithExt = `${folder}/${imageName}`
    const publicIdWithoutExt = imageName.includes('.') 
      ? `${folder}/${imageName.split('.')[0]}` 
      : `${folder}/${imageName}`

    // Try with extension first
    try {
      const resource = await cloudinary.api.resource(publicIdWithExt)
      if (resource && resource.secure_url) {
        return NextResponse.json({ 
          success: true, 
          url: resource.secure_url,
          publicId: resource.public_id
        })
      }
    } catch (error: any) {
      // Try without extension
      try {
        const resource = await cloudinary.api.resource(publicIdWithoutExt)
        if (resource && resource.secure_url) {
          return NextResponse.json({ 
            success: true, 
            url: resource.secure_url,
            publicId: resource.public_id
          })
        }
      } catch (error2: any) {
        // Continue to search method
      }
    }

    // Method 2: Search by filename pattern
    try {
      // Remove extension for search
      const searchName = imageName.includes('.') ? imageName.split('.')[0] : imageName
      const searchResult = await cloudinary.search
        .expression(`folder:${folder} AND filename:${searchName}*`)
        .max_results(10)
        .execute()

      if (searchResult.resources && searchResult.resources.length > 0) {
        // Try to find exact match first
        const exactMatch = searchResult.resources.find((r: any) => 
          r.filename === imageName || 
          r.filename === searchName ||
          r.public_id.includes(imageName) ||
          r.public_id.includes(searchName)
        )
        
        if (exactMatch) {
          return NextResponse.json({ 
            success: true, 
            url: exactMatch.secure_url,
            publicId: exactMatch.public_id
          })
        }
        
        // Return first match if no exact match found
        return NextResponse.json({ 
          success: true, 
          url: searchResult.resources[0].secure_url,
          publicId: searchResult.resources[0].public_id
        })
      }
    } catch (searchError) {
      console.error('Cloudinary search error:', searchError)
    }

    // Method 3: Construct URL directly (Cloudinary will serve if image exists)
    // This is a fallback - the URL will work if the image exists in Cloudinary
    const constructedUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${folder}/${imageName}`
    
    return NextResponse.json({ 
      success: true, 
      url: constructedUrl,
      publicId: publicIdWithExt,
      note: 'URL constructed - image will be served if it exists in Cloudinary'
    })
  } catch (error: any) {
    console.error('Error fetching image from Cloudinary:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch image from Cloudinary',
      details: error.message 
    }, { status: 500 })
  }
}

